import { generateImage, tool } from 'ai';
import z from 'zod';

export const generateImageTool = tool({
  description: 'Generate an image based on a prompt',
  inputSchema: z.object({
    prompt: z.string().describe('The prompt to generate the image from'),
  }),
  execute: async ({ prompt }) => {
    const result = await generateImage({
      model: 'openai/dall-e-3', // Will be overridden by the actual model used
      prompt,
    });

    return {
      image: result.image.base64,
      mediaType: result.image.mediaType,
      prompt
    };
  },
});
