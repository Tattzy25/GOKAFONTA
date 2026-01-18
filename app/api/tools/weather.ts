import { tool } from 'ai';
import { z } from 'zod';

export const getWeather = tool({
  description: 'Get current weather for a location',
  inputSchema: z.object({
    location: z.string().describe('The city and state, e.g. San Francisco, CA'),
  }),
  execute: async ({ location }: { location: string }) => {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      throw new Error('Weather service is currently unavailable. Please try again later.');
    }

    // Parse location to extract city and state
    let city: string;
    let state: string;

    if (location.includes(',')) {
      // Format: "City, State"
      const parts = location.split(',').map(p => p.trim());
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
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cleanLocation)}&appid=${apiKey}&units=imperial`
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
        temperatureF: Math.round(data.main.temp),
        condition: data.weather[0].description,
        humidityPercent: data.main.humidity,
        windMph: data.wind.speed,
      };
    } catch (error) {
      if (error instanceof Error && (error.message.includes('Location') || error.message.includes('service'))) {
        throw error; // Re-throw user-friendly errors
      }
      throw new Error('Unable to retrieve weather information at this time. Please try again later.');
    }
  },
});
