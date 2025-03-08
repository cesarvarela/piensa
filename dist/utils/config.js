import Conf from 'conf';
import * as readline from 'readline';
import chalk from 'chalk';
class Config {
    constructor() {
        this.config = new Conf({
            projectName: 'think',
            schema: {
                providers: {
                    type: 'object',
                    default: {}
                },
                defaultProvider: {
                    type: 'string',
                    default: 'openai'
                }
            }
        });
    }
    getProviderConfig(provider) {
        return this.config.get(`providers.${provider}`);
    }
    getApiKey(provider) {
        return this.config.get(`providers.${provider}.apiKey`);
    }
    getDefaultModel(provider) {
        return this.config.get(`providers.${provider}.defaultModel`);
    }
    getDefaultProvider() {
        return this.config.get('defaultProvider');
    }
    setApiKey(provider, apiKey) {
        this.config.set(`providers.${provider}.apiKey`, apiKey);
    }
    setDefaultModel(provider, model) {
        this.config.set(`providers.${provider}.defaultModel`, model);
    }
    setDefaultProvider(provider) {
        this.config.set('defaultProvider', provider);
    }
    async configure() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        const question = (query) => {
            return new Promise((resolve) => {
                rl.question(query, (answer) => {
                    resolve(answer);
                });
            });
        };
        console.log(chalk.blue('=== Think CLI Configuration ==='));
        // Configure OpenAI
        console.log(chalk.yellow('\nOpenAI Configuration:'));
        const openaiKey = await question('OpenAI API Key (leave empty to skip): ');
        if (openaiKey) {
            this.setApiKey('openai', openaiKey);
            const openaiModel = await question('Default OpenAI model [gpt-4]: ') || 'gpt-4';
            this.setDefaultModel('openai', openaiModel);
        }
        // Configure Anthropic
        console.log(chalk.yellow('\nAnthropic Configuration:'));
        const anthropicKey = await question('Anthropic API Key (leave empty to skip): ');
        if (anthropicKey) {
            this.setApiKey('anthropic', anthropicKey);
            const anthropicModel = await question('Default Anthropic model [claude-3-opus-20240229]: ') || 'claude-3-opus-20240229';
            this.setDefaultModel('anthropic', anthropicModel);
        }
        // Set default provider
        console.log(chalk.yellow('\nDefault Provider:'));
        const defaultProvider = await question('Default provider (openai, anthropic) [openai]: ') || 'openai';
        this.setDefaultProvider(defaultProvider);
        console.log(chalk.green('\nConfiguration saved successfully!'));
        rl.close();
    }
}
// Singleton instance
let configInstance = null;
export function getConfig() {
    if (!configInstance) {
        configInstance = new Config();
    }
    return configInstance;
}
//# sourceMappingURL=config.js.map