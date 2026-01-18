import { registerTool } from './registry';
import { ToolCategory, AgentCapability } from './types';
import { getWeather } from '../../app/api/tools/weather';
import { WeatherCard } from '../../components/ai-elements/weather-card';

/**
 * Tool Registration Module
 * Registers all available tools with the centralized registry
 */

// Register the weather tool
registerTool(
  {
    id: 'getWeather',
    name: 'Weather Information',
    description: 'Get current weather information for a US location',
    category: ToolCategory.WEATHER,
    requiredCapabilities: [AgentCapability.BASIC],
    version: '1.0.0',
    author: 'System',
    tags: ['weather', 'forecast', 'climate'],
    isActive: true,
  },
  getWeather,
  WeatherCard
);

// Future tools can be registered here:
// registerTool(metadata, toolFunction, renderComponent);

// Example of how additional tools would be registered:
/*
// Calculator Tool
registerTool(
  {
    id: 'calculator',
    name: 'Calculator',
    description: 'Perform mathematical calculations',
    category: ToolCategory.CALCULATION,
    requiredCapabilities: [AgentCapability.BASIC],
    version: '1.0.0',
    author: 'System',
    tags: ['math', 'calculation'],
    isActive: true,
  },
  calculatorTool,
  CalculatorResult
);

// Search Tool
registerTool(
  {
    id: 'webSearch',
    name: 'Web Search',
    description: 'Search the web for information',
    category: ToolCategory.SEARCH,
    requiredCapabilities: [AgentCapability.ADVANCED],
    version: '1.0.0',
    author: 'System',
    tags: ['search', 'web', 'information'],
    isActive: true,
  },
  webSearchTool,
  SearchResults
);
*/

console.log('Tool registration completed');
