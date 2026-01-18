import { tool } from 'ai';
import { z } from 'zod';
import React from 'react';

// Tool categories for organization
export enum ToolCategory {
  WEATHER = 'weather',
  SEARCH = 'search',
  CALCULATION = 'calculation',
  DATA_PROCESSING = 'data_processing',
  COMMUNICATION = 'communication',
  UTILITY = 'utility',
}

// Agent capability levels
export enum AgentCapability {
  BASIC = 'basic',
  ADVANCED = 'advanced',
  ADMIN = 'admin',
}

// Tool metadata interface
export interface ToolMetadata {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  requiredCapabilities: AgentCapability[];
  version: string;
  author: string;
  tags: string[];
  isActive: boolean;
}

// Base tool interface
export interface RegisteredTool {
  metadata: ToolMetadata;
  tool: any; // Using any to avoid complex generic type issues
  renderComponent?: React.ComponentType<any>;
}

// Agent configuration interface
export interface AgentConfig {
  id: string;
  name: string;
  capabilities: AgentCapability[];
  allowedToolCategories: ToolCategory[];
  maxConcurrentTools: number;
  timeoutMs: number;
}

// Tool execution context
export interface ToolExecutionContext {
  agentId: string;
  agentCapabilities: AgentCapability[];
  sessionId: string;
  requestId: string;
  timestamp: Date;
}

// Error types for tool system
export class ToolRegistryError extends Error {
  constructor(
    message: string,
    public code: string,
    public toolId?: string,
    public agentId?: string
  ) {
    super(message);
    this.name = 'ToolRegistryError';
  }
}

export class ToolExecutionError extends Error {
  constructor(
    message: string,
    public toolId: string,
    public agentId: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'ToolExecutionError';
  }
}

export class AgentCapabilityError extends Error {
  constructor(
    message: string,
    public agentId: string,
    public requiredCapability: AgentCapability,
    public availableCapabilities: AgentCapability[]
  ) {
    super(message);
    this.name = 'AgentCapabilityError';
  }
}
