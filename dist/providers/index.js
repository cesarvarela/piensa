import { OpenAIProvider } from './openai.js';
import { AnthropicProvider } from './anthropic.js';
export function getProvider(providerName) {
    switch (providerName.toLowerCase()) {
        case 'openai':
            return new OpenAIProvider();
        case 'anthropic':
            return new AnthropicProvider();
        default:
            throw new Error(`Unknown provider: ${providerName}`);
    }
}
//# sourceMappingURL=index.js.map