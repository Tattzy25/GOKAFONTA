import { streamText, UIMessage, convertToModelMessages, tool } from 'ai';
import z from 'zod';

// Allow streaming responses up to 10 minutes for proper code generation and complex responses
export const maxDuration = 600;

// Create a function to generate the image tool with the current model
function createGenerateImageTool(currentModel: string) {
  return tool({
    description: 'Generate an image based on a prompt',
    inputSchema: z.object({
      prompt: z.string().describe('The prompt to generate the image from'),
    }),
    execute: async ({ prompt }) => {
      const { generateImage } = await import('ai');

      const result = await generateImage({
        model: currentModel,
        prompt,
        size: '1024x1024',
      });

      return {
        image: result.image.base64,
        mediaType: result.image.mediaType,
        width: 1024,
        height: 1024,
        prompt
      };
    },
  });
}

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

  // Check if this is an image-only model
  const imageOnlyModels = [
    'google/imagen-4.0-generate-001',
    'recraft/recraft-v3',
    'bfl/flux-pro-1.1',
    'bfl/flux-kontext-pro'
  ];

  const isImageOnlyModel = imageOnlyModels.some(imageModel => model.includes(imageModel.split('/')[1]));

  if (isImageOnlyModel) {
    // For image-only models, directly generate image from the last message
    const lastMessage = messages.at(-1);
    const prompt = lastMessage?.parts?.find(part =>
      typeof part === 'object' && part.type === 'text'
    )?.text || 'Generate an image';

    const { generateImage } = await import('ai');
    const imageResult = await generateImage({
      model: model,
      prompt: prompt,
      size: '1024x1024',
    });

    return new Response(JSON.stringify({
      type: 'image',
      image: {
        base64: imageResult.image.base64,
        mediaType: imageResult.image.mediaType,
        width: 1024,
        height: 1024,
        prompt: prompt
      }
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // For multimodal models, use streamText with tools
  const result = streamText({
    model: model,
    messages: await convertToModelMessages(messages),
    system: 'You are a helpful assistant that can answer questions and help with tasks. You can generate images using the generateImage tool when requested.',
    tools: {
      generateImage: createGenerateImageTool(model),
    },
  });

  // send sources and reasoning back to the client
  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true,
  });
}
