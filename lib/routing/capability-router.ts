import { AgentCapability, ToolCategory } from '../tools/types';

/**
 * Request capability classification
 */
export enum RequestCapability {
  NEEDS_TOOLS = 'needs_tools',
  NEEDS_VISION = 'needs_vision',
  NEEDS_IMAGE_GEN = 'needs_image_gen',
  NEEDS_AUDIO_IN = 'needs_audio_in',
  NEEDS_AUDIO_OUT = 'needs_audio_out',
  NEEDS_CODE_GEN = 'needs_code_gen',
  NEEDS_STREAMING = 'needs_streaming',
  BASIC_CHAT = 'basic_chat',
}

/**
 * Provider capability interface
 */
export interface ProviderCapability {
  name: string;
  supportsTools: boolean;
  supportsVision: boolean;
  supportsImageGen: boolean;
  supportsAudioIn: boolean;
  supportsAudioOut: boolean;
  supportsStreaming: boolean;
  maxTokens: number;
  costPerToken?: number;
}

/**
 * Request context interface
 */
export interface RequestContext {
  hasAudioInput?: boolean;
  expectsAudioOutput?: boolean;
  hasImageInput?: boolean;
  attachmentCount?: number;
  messageLength?: number;
}

/**
 * Routing decision
 */
export interface RoutingDecision {
  selectedProvider: string;
  selectedModel: string;
  fallbackUsed: boolean;
  originalProvider?: string;
  reason: string;
}

/**
 * Capability-based request router
 * Routes requests to appropriate models/providers based on required capabilities
 */
export class CapabilityRouter {
  private static instance: CapabilityRouter;

  // Known provider capabilities (dynamically updated)
  private providerCapabilities = new Map<string, ProviderCapability>();

  // Capability-based routing rules
  private routingRules: Map<RequestCapability, string[]> = new Map([
    [RequestCapability.NEEDS_TOOLS, ['openai/gpt-4o', 'anthropic/claude-3', 'openai/gpt-4-turbo']],
    [RequestCapability.NEEDS_VISION, ['openai/gpt-4o', 'anthropic/claude-3', 'google/gemini-pro-vision']],
    [RequestCapability.NEEDS_IMAGE_GEN, ['openai/dall-e-3', 'stability/stable-diffusion', 'midjourney/midjourney']],
    [RequestCapability.NEEDS_AUDIO_IN, ['openai/whisper', 'google/speech-to-text']],
    [RequestCapability.NEEDS_AUDIO_OUT, ['openai/tts', 'google/text-to-speech', 'amazon/polly']],
    [RequestCapability.NEEDS_CODE_GEN, ['openai/gpt-4o', 'anthropic/claude-3', 'codellama/code-llama']],
    [RequestCapability.NEEDS_STREAMING, ['openai/gpt-4o', 'anthropic/claude-3', 'openai/gpt-4-turbo']],
    [RequestCapability.BASIC_CHAT, ['*']], // Any provider can handle basic chat
  ]);

  private constructor() {
    this.initializeDefaultCapabilities();
  }

  static getInstance(): CapabilityRouter {
    if (!CapabilityRouter.instance) {
      CapabilityRouter.instance = new CapabilityRouter();
    }
    return CapabilityRouter.instance;
  }

  /**
   * Analyze request and determine required capabilities
   */
  analyzeRequest(message: string, agentCapabilities: AgentCapability[], context?: RequestContext): RequestCapability[] {
    const capabilities: RequestCapability[] = [];

    // Check for tool requirements based on agent capabilities
    if (agentCapabilities.includes(AgentCapability.ADVANCED) || agentCapabilities.includes(AgentCapability.ADMIN)) {
      capabilities.push(RequestCapability.NEEDS_TOOLS);
    }

    // Analyze message content for specific requirements
    const lowerMessage = message.toLowerCase();

    // Code generation indicators
    if (lowerMessage.includes('write code') || lowerMessage.includes('code for') ||
        lowerMessage.includes('function') || lowerMessage.includes('class') ||
        lowerMessage.includes('implement') || lowerMessage.includes('script')) {
      capabilities.push(RequestCapability.NEEDS_CODE_GEN);
    }

    // Image generation indicators
    if (lowerMessage.includes('generate image') || lowerMessage.includes('create image') ||
        lowerMessage.includes('draw') || lowerMessage.includes('picture of') ||
        lowerMessage.includes('visualize')) {
      capabilities.push(RequestCapability.NEEDS_IMAGE_GEN);
    }

    // Audio indicators (would be enhanced with actual audio detection)
    if (context?.hasAudioInput) {
      capabilities.push(RequestCapability.NEEDS_AUDIO_IN);
    }
    if (context?.expectsAudioOutput) {
      capabilities.push(RequestCapability.NEEDS_AUDIO_OUT);
    }

    // Vision indicators
    if (context?.hasImageInput) {
      capabilities.push(RequestCapability.NEEDS_VISION);
    }

    // Streaming requirement (most modern chats need this)
    capabilities.push(RequestCapability.NEEDS_STREAMING);

    // Default to basic chat if no specific capabilities detected
    if (capabilities.length === 1 && capabilities[0] === RequestCapability.NEEDS_STREAMING) {
      capabilities.push(RequestCapability.BASIC_CHAT);
    }

    return capabilities;
  }

  /**
   * Route request to appropriate provider/model
   */
  routeRequest(
    requestedProvider: string,
    requiredCapabilities: RequestCapability[],
    fallbackAllowed = true
  ): RoutingDecision {

    // Check if requested provider supports all required capabilities
    const providerCaps = this.providerCapabilities.get(requestedProvider);
    if (providerCaps && this.providerSupportsCapabilities(providerCaps, requiredCapabilities)) {
      return {
        selectedProvider: requestedProvider,
        selectedModel: requestedProvider, // For simplicity, using same string
        fallbackUsed: false,
        reason: 'Requested provider supports all required capabilities'
      };
    }

    // If fallback not allowed, return error decision
    if (!fallbackAllowed) {
      return {
        selectedProvider: requestedProvider,
        selectedModel: requestedProvider,
        fallbackUsed: false,
        reason: `Provider ${requestedProvider} does not support required capabilities: ${requiredCapabilities.join(', ')}`
      };
    }

    // Find best fallback provider
    const fallbackProvider = this.findBestFallbackProvider(requiredCapabilities);

    if (fallbackProvider) {
      return {
        selectedProvider: fallbackProvider,
        selectedModel: fallbackProvider,
        fallbackUsed: true,
        originalProvider: requestedProvider,
        reason: `Switched to ${fallbackProvider} - supports required capabilities`
      };
    }

    // No suitable provider found
    return {
      selectedProvider: requestedProvider,
      selectedModel: requestedProvider,
      fallbackUsed: false,
      reason: `No provider found that supports required capabilities: ${requiredCapabilities.join(', ')}`
    };
  }

  /**
   * Register or update provider capabilities
   */
  registerProviderCapability(provider: string, capabilities: ProviderCapability): void {
    this.providerCapabilities.set(provider, capabilities);
  }

  /**
   * Get all registered providers
   */
  getRegisteredProviders(): string[] {
    return Array.from(this.providerCapabilities.keys());
  }

  /**
   * Check if provider supports specific capabilities
   */
  private providerSupportsCapabilities(
    provider: ProviderCapability,
    required: RequestCapability[]
  ): boolean {
    for (const cap of required) {
      switch (cap) {
        case RequestCapability.NEEDS_TOOLS:
          if (!provider.supportsTools) return false;
          break;
        case RequestCapability.NEEDS_VISION:
          if (!provider.supportsVision) return false;
          break;
        case RequestCapability.NEEDS_IMAGE_GEN:
          if (!provider.supportsImageGen) return false;
          break;
        case RequestCapability.NEEDS_AUDIO_IN:
          if (!provider.supportsAudioIn) return false;
          break;
        case RequestCapability.NEEDS_AUDIO_OUT:
          if (!provider.supportsAudioOut) return false;
          break;
        case RequestCapability.NEEDS_STREAMING:
          if (!provider.supportsStreaming) return false;
          break;
        // NEEDS_CODE_GEN and BASIC_CHAT are handled by general capability
      }
    }
    return true;
  }

  /**
   * Find best fallback provider for required capabilities
   */
  private findBestFallbackProvider(requiredCapabilities: RequestCapability[]): string | null {
    const candidates = new Map<string, number>();

    // Score each potential provider
    for (const [capability, providers] of this.routingRules) {
      if (requiredCapabilities.includes(capability)) {
        for (const provider of providers) {
          if (provider === '*') continue; // Skip wildcard
          candidates.set(provider, (candidates.get(provider) || 0) + 1);
        }
      }
    }

    // Return provider with highest score
    let bestProvider: string | null = null;
    let bestScore = 0;

    for (const [provider, score] of candidates) {
      if (score > bestScore) {
        bestScore = score;
        bestProvider = provider;
      }
    }

    return bestProvider;
  }

  /**
   * Initialize default provider capabilities
   */
  private initializeDefaultCapabilities(): void {
    // OpenAI models
    this.registerProviderCapability('openai/gpt-4o', {
      name: 'GPT-4o',
      supportsTools: true,
      supportsVision: true,
      supportsImageGen: false,
      supportsAudioIn: false,
      supportsAudioOut: false,
      supportsStreaming: true,
      maxTokens: 128000,
    });

    this.registerProviderCapability('openai/gpt-4-turbo', {
      name: 'GPT-4 Turbo',
      supportsTools: true,
      supportsVision: false,
      supportsImageGen: false,
      supportsAudioIn: false,
      supportsAudioOut: false,
      supportsStreaming: true,
      maxTokens: 128000,
    });

    this.registerProviderCapability('openai/dall-e-3', {
      name: 'DALL-E 3',
      supportsTools: false,
      supportsVision: false,
      supportsImageGen: true,
      supportsAudioIn: false,
      supportsAudioOut: false,
      supportsStreaming: false,
      maxTokens: 4000,
    });

    this.registerProviderCapability('openai/tts', {
      name: 'OpenAI TTS',
      supportsTools: false,
      supportsVision: false,
      supportsImageGen: false,
      supportsAudioIn: false,
      supportsAudioOut: true,
      supportsStreaming: false,
      maxTokens: 4096,
    });

    // Anthropic models
    this.registerProviderCapability('anthropic/claude-3', {
      name: 'Claude 3',
      supportsTools: true,
      supportsVision: true,
      supportsImageGen: false,
      supportsAudioIn: false,
      supportsAudioOut: false,
      supportsStreaming: true,
      maxTokens: 200000,
    });

    // Voice/Audio providers
    this.registerProviderCapability('google/text-to-speech', {
      name: 'Google TTS',
      supportsTools: false,
      supportsVision: false,
      supportsImageGen: false,
      supportsAudioIn: false,
      supportsAudioOut: true,
      supportsStreaming: false,
      maxTokens: 5000,
    });

    // Fallback for unknown providers - assume basic capabilities
    this.registerProviderCapability('unknown-provider', {
      name: 'Unknown Provider',
      supportsTools: false,
      supportsVision: false,
      supportsImageGen: false,
      supportsAudioIn: false,
      supportsAudioOut: false,
      supportsStreaming: true,
      maxTokens: 4096,
    });
  }
}

// Export singleton instance
export const capabilityRouter = CapabilityRouter.getInstance();
