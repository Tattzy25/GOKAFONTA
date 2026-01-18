import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const result = streamText({
    model: 'openai/gpt-4o',
    messages: await convertToModelMessages(messages),
    tools: {
      fetch_weather_data: {
        description: 'Fetch weather information for a specific location',
        inputSchema: z.object({
          location: z.string().describe('The city or location to get weather for'),
          units: z.enum(['celsius', 'fahrenheit']).default('celsius').describe('Temperature units'),
        }),
        execute: async ({ location, units }) => {
          const apiKey = process.env.OPENWEATHER_API_KEY;
          if (!apiKey) {
            throw new Error('Weather service is currently unavailable. Please try again later.');
          }

          // Parse location to extract city and state
          let city: string;
          let state: string;

          if (location.includes(',')) {
            // Format: "City, State"
            const parts = location.split(',').map((p: string) => p.trim());
            city = parts[0];
            state = parts[1] || '';
          } else {
            // Format: "City State" - assume last word is state
            const parts = location.trim().split(/\s+/);
            state = parts.pop() || '';
            city = parts.join(' ');
          }

          // Clean and format
          const cleanCity = city.trim();
          const cleanState = state.replace(/\s+/g, '').toUpperCase(); // Normalize state
          const cleanLocation = `${cleanCity},${cleanState},US`;

          try {
            const response = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cleanLocation)}&appid=${apiKey}&units=${units === 'celsius' ? 'metric' : 'imperial'}`
            );

            if (!response.ok) {
              if (response.status === 404) {
                throw new Error(`Location "${location}" could not be found. Please check the spelling and try again.`);
              } else {
                throw new Error('Weather service is currently experiencing issues. Please try again later.');
              }
            }

            const data = await response.json();

            return {
              location: data.name,
              temperature: `${Math.round(data.main.temp)}°${units === 'celsius' ? 'C' : 'F'}`,
              conditions: data.weather[0].description,
              humidity: `${data.main.humidity}%`,
              windSpeed: `${data.wind.speed} ${units === 'celsius' ? 'm/s' : 'mph'}`,
              lastUpdated: new Date().toLocaleString(),
            };
          } catch (error) {
            if (error instanceof Error && (error.message.includes('Location') || error.message.includes('service'))) {
              throw error; // Re-throw user-friendly errors
            }
            throw new Error('Unable to retrieve weather information at this time. Please try again later.');
          }
        },
      },
    },
  });
  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true,
  });
}
