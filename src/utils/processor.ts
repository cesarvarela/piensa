import { getConfig } from './config.js';
import { getProvider } from '../providers/index.js';

interface ProcessInputOptions {
  prompt?: string;
  input?: string;
  provider?: string;
  model?: string;
  apiKey?: string;
  stream?: boolean;
}

export async function processInput(options: ProcessInputOptions): Promise<string> {
  const config = getConfig();
  
  // Determine which provider to use
  const providerName = options.provider || config.getDefaultProvider();
  
  // Get API key (priority: command line > config > error)
  let apiKey = options.apiKey;
  if(!apiKey) {
    apiKey = config.getApiKey(providerName);
    if(!apiKey) {
      throw new Error(`No API key found for provider '${providerName}'. Please provide an API key with --key or run 'piensa --config' to set up.`);
    }
  } else {
    // If API key is provided via command line, save it for future use
    config.setApiKey(providerName, apiKey);
  }
  
  // Get model (priority: command line > config > provider default)
  const model = options.model || config.getDefaultModel(providerName);
  
  // Combine prompt and input
  let fullPrompt = '';
  if(options.prompt) {
    fullPrompt = options.prompt;
  }
  
  if(options.input) {
    if(fullPrompt) {
      fullPrompt = `${fullPrompt}\n\n${options.input}`;
    } else {
      fullPrompt = options.input;
    }
  }
  
  // Get the provider implementation
  const provider = getProvider(providerName);
  
  // Call the provider with the prompt
  return await provider.generateResponse({
    prompt: fullPrompt,
    model,
    apiKey
  });
}

export async function streamInput(options: ProcessInputOptions, callback: (chunk: string) => void): Promise<void> {
  const config = getConfig();
  
  // Determine which provider to use
  const providerName = options.provider || config.getDefaultProvider();
  
  // Get API key (priority: command line > config > error)
  let apiKey = options.apiKey;
  if(!apiKey) {
    apiKey = config.getApiKey(providerName);
    if(!apiKey) {
      throw new Error(`No API key found for provider '${providerName}'. Please provide an API key with --key or run 'piensa --config' to set up.`);
    }
  } else {
    // If API key is provided via command line, save it for future use
    config.setApiKey(providerName, apiKey);
  }
  
  // Get model (priority: command line > config > provider default)
  const model = options.model || config.getDefaultModel(providerName);
  
  // Combine prompt and input
  let fullPrompt = '';
  if(options.prompt) {
    fullPrompt = options.prompt;
  }
  
  if(options.input) {
    if(fullPrompt) {
      fullPrompt = `${fullPrompt}\n\n${options.input}`;
    } else {
      fullPrompt = options.input;
    }
  }
  
  // Get the provider implementation
  const provider = getProvider(providerName);
  
  // Check if provider supports streaming
  if(!provider.streamResponse) {
    throw new Error(`Provider '${providerName}' does not support streaming responses`);
  }
  
  // Call the provider with the prompt in streaming mode
  await provider.streamResponse({
    prompt: fullPrompt,
    model,
    apiKey,
    stream: true
  }, callback);
} 