import { OpenAIProvider } from './openai.js';
import { AnthropicProvider } from './anthropic.js';

export interface ProviderOptions {
  prompt: string;
  model?: string;
  apiKey: string;
  stream?: boolean;
}

export interface Provider {
  generateResponse(options: ProviderOptions): Promise<string>;
  streamResponse?(options: ProviderOptions, callback: (chunk: string) => void): Promise<void>;
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