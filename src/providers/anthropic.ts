import Anthropic from '@anthropic-ai/sdk';
import { Provider, ProviderOptions } from './index.js';

export class AnthropicProvider implements Provider {
  async generateResponse(options: ProviderOptions): Promise<string> {
    const { prompt, model = 'claude-3-opus-20240229', apiKey } = options;
    
    const anthropic = new Anthropic({
      apiKey: apiKey
    });
    
    try {
      const response = await anthropic.messages.create({
        model: model,
        max_tokens: 1000,
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      });
      
      // Handle different content block types
      if(response.content.length > 0) {
        const block = response.content[0];
        if('text' in block) {
          return block.text;
        }
      }
      
      return 'No response generated';
    } catch(e) {
      if(e instanceof Error) {
        throw new Error(`Anthropic error: ${e.message}`);
      }
      throw new Error('Unknown error occurred with Anthropic');
    }
  }

  async streamResponse(options: ProviderOptions, callback: (chunk: string) => void): Promise<void> {
    const { prompt, model = 'claude-3-opus-20240229', apiKey } = options;
    
    const anthropic = new Anthropic({
      apiKey: apiKey
    });
    
    try {
      const stream = await anthropic.messages.create({
        model: model,
        max_tokens: 1000,
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        stream: true,
      });
      
      for await (const chunk of stream) {
        if(chunk.type === 'content_block_delta' && 
           chunk.delta && 
           'text' in chunk.delta && 
           chunk.delta.text) {
          callback(chunk.delta.text);
        }
      }
    } catch(e) {
      if(e instanceof Error) {
        throw new Error(`Anthropic error: ${e.message}`);
      }
      throw new Error('Unknown error occurred with Anthropic');
    }
  }
} 