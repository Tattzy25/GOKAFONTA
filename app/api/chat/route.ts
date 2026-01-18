import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { getWeather } from '../tools/weather';
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
  const result = streamText({
    model: webSearch ? 'perplexity/sonar' : model,
    messages: await convertToModelMessages(messages),
    system:
      'You are a helpful assistant that can answer questions and help with tasks. You have access to a weather tool to get current weather information.',
    tools: {
      getWeather,
    },
  });
  // send sources and reasoning back to the client
  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true,
  });
}
