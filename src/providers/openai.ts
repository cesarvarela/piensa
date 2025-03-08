import OpenAI from 'openai';
import { Provider, ProviderOptions } from './index.js';

export class OpenAIProvider implements Provider {
  async generateResponse(options: ProviderOptions): Promise<string> {
    const { prompt, model = 'gpt-4', apiKey } = options;
    
    const openai = new OpenAI({
      apiKey: apiKey
    });
    
    try {
      const response = await openai.chat.completions.create({
        model: model,
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      });
      
      return response.choices[0]?.message?.content || 'No response generated';
    } catch(e) {
      if(e instanceof Error) {
        throw new Error(`OpenAI error: ${e.message}`);
      }
      throw new Error('Unknown error occurred with OpenAI');
    }
  }

  async streamResponse(options: ProviderOptions, callback: (chunk: string) => void): Promise<void> {
    const { prompt, model = 'gpt-4', apiKey } = options;
    
    const openai = new OpenAI({
      apiKey: apiKey
    });
    
    try {
      const stream = await openai.chat.completions.create({
        model: model,
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        stream: true,
      });
      
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if(content) {
          callback(content);
        }
      }
    } catch(e) {
      if(e instanceof Error) {
        throw new Error(`OpenAI error: ${e.message}`);
      }
      throw new Error('Unknown error occurred with OpenAI');
    }
  }
} 