import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { toolRegistry } from '../../../lib/tools/registry';
import { agentCapabilitiesManager, DEFAULT_AGENT_CONFIGS } from '../../../lib/agents/capabilities';
import { capabilityRouter, RequestContext } from '../../../lib/routing/capability-router';
import '../../../lib/tools/registration'; // Import to register tools
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const {
    messages,
    model,
    webSearch,
  }: {
    messages: UIMessage[];
    model: string;
    webSearch: boolean;
  } = await req.json();

  // Register default agent if not already registered
  if (!agentCapabilitiesManager.getAgentConfig('advanced-assistant')) {
    agentCapabilitiesManager.registerAgent(DEFAULT_AGENT_CONFIGS.advancedAssistant);
  }

  // Get the latest user message for capability analysis
  const latestMessage = messages[messages.length - 1];
  const userMessage = latestMessage?.role === 'user'
    ? latestMessage.parts.find(part => part.type === 'text')?.text || ''
    : '';

  // Analyze required capabilities for this request
  const agentCapabilities = agentCapabilitiesManager.getAgentConfig('advanced-assistant')?.capabilities || [];
  const requestContext: RequestContext = {
    // These would be populated based on actual request analysis
    hasAudioInput: false,
    expectsAudioOutput: false,
    hasImageInput: false,
    attachmentCount: 0,
    messageLength: userMessage.length,
  };

  const requiredCapabilities = capabilityRouter.analyzeRequest(
    userMessage,
    agentCapabilities,
    requestContext
  );

  // Determine final provider to use
  let finalModel = model;
  if (!webSearch) {
    const routingDecision = capabilityRouter.routeRequest(model, requiredCapabilities, true);
    finalModel = routingDecision.selectedProvider;

    // Log routing decision for monitoring
    if (routingDecision.fallbackUsed) {
      console.log(`Provider routing: ${model} → ${finalModel} (${routingDecision.reason})`);
    }
  }

  // Get available tools for the agent
  const availableTools = webSearch ? {} : toolRegistry.getToolsObjectForAgent('advanced-assistant');

  const result = streamText({
    model: webSearch ? 'perplexity/sonar' : finalModel,
    messages: await convertToModelMessages(messages),
    system:
      'You are a weather assistant inside a Vercel AI SDK chat app. Tool calls are internal. Never show raw tool input/output JSON to the user. When getWeather returns, ALWAYS produce a user-facing response in TWO forms: (A) A Weather Card payload: output a single structured object for the UI to render (WeatherCard), containing exactly: location, temperatureF, condition, humidityPercent, windMph (numbers where applicable). (B) A one-sentence natural-language summary (Fahrenheit only for US locations). Do not include Celsius unless the user explicitly asks for Celsius. The default unit for US locations is Fahrenheit. Output only Fahrenheit unless the user requests Celsius. The user should never need to click a "tool completed" row to see results. The assistant\'s primary response must be the Weather Card (plus the 1-line summary). If a tool fails, apologize briefly and ask for the city/state again. Tool availability must be provider-agnostic. Assume ANY selected model can call getWeather. If tools are unavailable, respond with: "Tools not enabled for this model; enable tools for the selected provider/model."',
    tools: availableTools,
  });
  // send sources and reasoning back to the client
  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true,
  });
}
