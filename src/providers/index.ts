import { OpenAIProvider } from './openai.js';
import { AnthropicProvider } from './anthropic.js';

export interface ProviderOptions {
  prompt: string;
  model?: string;
  apiKey: string;
}

export interface Provider {
  generateResponse(options: ProviderOptions): Promise<string>;
}

export function getProvider(providerName: string): Provider {
  switch(providerName.toLowerCase()) {
    case 'openai':
      return new OpenAIProvider();
    case 'anthropic':
      return new AnthropicProvider();
    default:
      throw new Error(`Unknown provider: ${providerName}`);
  }
} 