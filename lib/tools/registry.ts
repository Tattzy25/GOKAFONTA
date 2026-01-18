import {
  RegisteredTool,
  ToolMetadata,
  ToolCategory,
  AgentCapability,
  AgentConfig,
  ToolExecutionContext,
  ToolRegistryError,
  ToolExecutionError,
  AgentCapabilityError,
} from './types';

/**
 * Centralized Tool Registry System
 * Manages tool registration, discovery, and access control for multiple agents
 */
export class ToolRegistry {
  private static instance: ToolRegistry;
  private tools = new Map<string, RegisteredTool>();
  private agents = new Map<string, AgentConfig>();
  private executionLogs: Array<{
    context: ToolExecutionContext;
    toolId: string;
    success: boolean;
    duration: number;
    error?: string;
  }> = [];

  private constructor() {}

  static getInstance(): ToolRegistry {
    if (!ToolRegistry.instance) {
      ToolRegistry.instance = new ToolRegistry();
    }
    return ToolRegistry.instance;
  }

  /**
   * Register a new tool in the system
   */
  registerTool(tool: RegisteredTool): void {
    const { metadata } = tool;

    if (this.tools.has(metadata.id)) {
      throw new ToolRegistryError(
        `Tool with ID '${metadata.id}' is already registered`,
        'TOOL_ALREADY_EXISTS',
        metadata.id
      );
    }

    // Validate metadata
    this.validateToolMetadata(metadata);

    this.tools.set(metadata.id, tool);
    console.log(`Tool registered: ${metadata.name} (${metadata.id})`);
  }

  /**
   * Unregister a tool from the system
   */
  unregisterTool(toolId: string): void {
    if (!this.tools.has(toolId)) {
      throw new ToolRegistryError(
        `Tool with ID '${toolId}' not found`,
        'TOOL_NOT_FOUND',
        toolId
      );
    }

    this.tools.delete(toolId);
    console.log(`Tool unregistered: ${toolId}`);
  }

  /**
   * Register an agent with its capabilities
   */
  registerAgent(config: AgentConfig): void {
    if (this.agents.has(config.id)) {
      throw new ToolRegistryError(
        `Agent with ID '${config.id}' is already registered`,
        'AGENT_ALREADY_EXISTS',
        undefined,
        config.id
      );
    }

    this.agents.set(config.id, config);
    console.log(`Agent registered: ${config.name} (${config.id})`);
  }

  /**
   * Get available tools for a specific agent based on capabilities
   */
  getAvailableToolsForAgent(agentId: string): RegisteredTool[] {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new ToolRegistryError(
        `Agent with ID '${agentId}' not found`,
        'AGENT_NOT_FOUND',
        undefined,
        agentId
      );
    }

    const availableTools: RegisteredTool[] = [];

    for (const [toolId, registeredTool] of this.tools) {
      if (this.canAgentAccessTool(agent, registeredTool)) {
        availableTools.push(registeredTool);
      }
    }

    return availableTools;
  }

  /**
   * Get tools as an object for AI SDK
   */
  getToolsObjectForAgent(agentId: string): Record<string, RegisteredTool['tool']> {
    const availableTools = this.getAvailableToolsForAgent(agentId);
    const toolsObject: Record<string, RegisteredTool['tool']> = {};

    for (const registeredTool of availableTools) {
      toolsObject[registeredTool.metadata.id] = registeredTool.tool;
    }

    return toolsObject;
  }

  /**
   * Get render component for a specific tool
   */
  getRenderComponent(toolId: string): RegisteredTool['renderComponent'] | undefined {
    const tool = this.tools.get(toolId);
    return tool?.renderComponent;
  }

  /**
   * Check if an agent can access a specific tool
   */
  private canAgentAccessTool(agent: AgentConfig, tool: RegisteredTool): boolean {
    // Check if tool is active
    if (!tool.metadata.isActive) {
      return false;
    }

    // Check capability requirements
    for (const requiredCapability of tool.metadata.requiredCapabilities) {
      if (!agent.capabilities.includes(requiredCapability)) {
        return false;
      }
    }

    // Check category restrictions
    if (!agent.allowedToolCategories.includes(tool.metadata.category)) {
      return false;
    }

    return true;
  }

  /**
   * Validate tool metadata
   */
  private validateToolMetadata(metadata: ToolMetadata): void {
    if (!metadata.id || !metadata.name || !metadata.description) {
      throw new ToolRegistryError(
        'Tool metadata must include id, name, and description',
        'INVALID_METADATA',
        metadata.id
      );
    }

    if (!Object.values(ToolCategory).includes(metadata.category)) {
      throw new ToolRegistryError(
        `Invalid tool category: ${metadata.category}`,
        'INVALID_CATEGORY',
        metadata.id
      );
    }

    if (!metadata.requiredCapabilities.every(cap => Object.values(AgentCapability).includes(cap))) {
      throw new ToolRegistryError(
        'Invalid capability requirements',
        'INVALID_CAPABILITIES',
        metadata.id
      );
    }
  }

  /**
   * Log tool execution for monitoring
   */
  logExecution(
    context: ToolExecutionContext,
    toolId: string,
    success: boolean,
    duration: number,
    error?: string
  ): void {
    this.executionLogs.push({
      context,
      toolId,
      success,
      duration,
      error,
    });

    // Keep only last 1000 logs
    if (this.executionLogs.length > 1000) {
      this.executionLogs = this.executionLogs.slice(-1000);
    }
  }

  /**
   * Get execution logs for monitoring
   */
  getExecutionLogs(limit = 100): typeof this.executionLogs {
    return this.executionLogs.slice(-limit);
  }

  /**
   * Get all registered tools
   */
  getAllTools(): RegisteredTool[] {
    return Array.from(this.tools.values());
  }

  /**
   * Get all registered agents
   */
  getAllAgents(): AgentConfig[] {
    return Array.from(this.agents.values());
  }

  /**
   * Get tool by ID
   */
  getTool(toolId: string): RegisteredTool | undefined {
    return this.tools.get(toolId);
  }

  /**
   * Get agent by ID
   */
  getAgent(agentId: string): AgentConfig | undefined {
    return this.agents.get(agentId);
  }
}

// Export singleton instance
export const toolRegistry = ToolRegistry.getInstance();

// Utility functions for tool registration
export function registerTool(
  metadata: ToolMetadata,
  tool: RegisteredTool['tool'],
  renderComponent?: RegisteredTool['renderComponent']
): void {
  toolRegistry.registerTool({
    metadata,
    tool,
    renderComponent,
  });
}

export function registerAgent(config: AgentConfig): void {
  toolRegistry.registerAgent(config);
}
