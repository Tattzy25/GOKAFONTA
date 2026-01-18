import {
  AgentConfig,
  AgentCapability,
  ToolCategory,
} from '../tools/types';
import { toolRegistry } from '../tools/registry';

/**
 * Agent Capabilities Management System
 * Handles agent registration, capability checking, and tool access control
 */

export class AgentCapabilitiesManager {
  private static instance: AgentCapabilitiesManager;
  private agentConfigs = new Map<string, AgentConfig>();

  private constructor() {}

  static getInstance(): AgentCapabilitiesManager {
    if (!AgentCapabilitiesManager.instance) {
      AgentCapabilitiesManager.instance = new AgentCapabilitiesManager();
    }
    return AgentCapabilitiesManager.instance;
  }

  /**
   * Register an agent with capabilities
   */
  registerAgent(config: AgentConfig): void {
    // Validate agent config
    this.validateAgentConfig(config);

    this.agentConfigs.set(config.id, config);
    toolRegistry.registerAgent(config);

    console.log(`Agent registered with capabilities: ${config.name}`);
  }

  /**
   * Update agent capabilities
   */
  updateAgentCapabilities(agentId: string, capabilities: AgentCapability[]): void {
    const agent = this.agentConfigs.get(agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }

    agent.capabilities = capabilities;
    toolRegistry.registerAgent(agent); // Re-register with updated config
  }

  /**
   * Check if agent has specific capability
   */
  hasCapability(agentId: string, capability: AgentCapability): boolean {
    const agent = this.agentConfigs.get(agentId);
    return agent?.capabilities.includes(capability) ?? false;
  }

  /**
   * Check if agent can access tool category
   */
  canAccessCategory(agentId: string, category: ToolCategory): boolean {
    const agent = this.agentConfigs.get(agentId);
    return agent?.allowedToolCategories.includes(category) ?? false;
  }

  /**
   * Get agent configuration
   */
  getAgentConfig(agentId: string): AgentConfig | undefined {
    return this.agentConfigs.get(agentId);
  }

  /**
   * Get all registered agents
   */
  getAllAgents(): AgentConfig[] {
    return Array.from(this.agentConfigs.values());
  }

  /**
   * Get agents by capability
   */
  getAgentsByCapability(capability: AgentCapability): AgentConfig[] {
    return Array.from(this.agentConfigs.values()).filter(agent =>
      agent.capabilities.includes(capability)
    );
  }

  /**
   * Get agents that can access a specific tool category
   */
  getAgentsForCategory(category: ToolCategory): AgentConfig[] {
    return Array.from(this.agentConfigs.values()).filter(agent =>
      agent.allowedToolCategories.includes(category)
    );
  }

  /**
   * Validate agent configuration
   */
  private validateAgentConfig(config: AgentConfig): void {
    if (!config.id || !config.name) {
      throw new Error('Agent config must include id and name');
    }

    if (!config.capabilities || config.capabilities.length === 0) {
      throw new Error('Agent must have at least one capability');
    }

    if (!config.allowedToolCategories || config.allowedToolCategories.length === 0) {
      throw new Error('Agent must have at least one allowed tool category');
    }

    // Validate capabilities
    const validCapabilities = Object.values(AgentCapability);
    for (const cap of config.capabilities) {
      if (!validCapabilities.includes(cap)) {
        throw new Error(`Invalid capability: ${cap}`);
      }
    }

    // Validate tool categories
    const validCategories = Object.values(ToolCategory);
    for (const cat of config.allowedToolCategories) {
      if (!validCategories.includes(cat)) {
        throw new Error(`Invalid tool category: ${cat}`);
      }
    }

    if (config.maxConcurrentTools < 1) {
      throw new Error('maxConcurrentTools must be at least 1');
    }

    if (config.timeoutMs < 1000) {
      throw new Error('timeoutMs must be at least 1000ms');
    }
  }
}

// Pre-defined agent configurations for common use cases
export const DEFAULT_AGENT_CONFIGS = {
  // Basic assistant with limited capabilities
  basicAssistant: {
    id: 'basic-assistant',
    name: 'Basic Assistant',
    capabilities: [AgentCapability.BASIC],
    allowedToolCategories: [ToolCategory.UTILITY, ToolCategory.SEARCH],
    maxConcurrentTools: 2,
    timeoutMs: 30000,
  },

  // Advanced assistant with broader capabilities
  advancedAssistant: {
    id: 'advanced-assistant',
    name: 'Advanced Assistant',
    capabilities: [AgentCapability.BASIC, AgentCapability.ADVANCED],
    allowedToolCategories: [
      ToolCategory.UTILITY,
      ToolCategory.SEARCH,
      ToolCategory.CALCULATION,
      ToolCategory.WEATHER,
      ToolCategory.DATA_PROCESSING,
    ],
    maxConcurrentTools: 5,
    timeoutMs: 60000,
  },

  // Admin assistant with full access
  adminAssistant: {
    id: 'admin-assistant',
    name: 'Admin Assistant',
    capabilities: [AgentCapability.BASIC, AgentCapability.ADVANCED, AgentCapability.ADMIN],
    allowedToolCategories: Object.values(ToolCategory),
    maxConcurrentTools: 10,
    timeoutMs: 120000,
  },

  // Specialized weather agent
  weatherSpecialist: {
    id: 'weather-specialist',
    name: 'Weather Specialist',
    capabilities: [AgentCapability.BASIC],
    allowedToolCategories: [ToolCategory.WEATHER],
    maxConcurrentTools: 3,
    timeoutMs: 30000,
  },

  // Data processing agent
  dataProcessor: {
    id: 'data-processor',
    name: 'Data Processor',
    capabilities: [AgentCapability.BASIC, AgentCapability.ADVANCED],
    allowedToolCategories: [ToolCategory.DATA_PROCESSING, ToolCategory.CALCULATION],
    maxConcurrentTools: 4,
    timeoutMs: 90000,
  },
};

// Export singleton instance
export const agentCapabilitiesManager = AgentCapabilitiesManager.getInstance();
