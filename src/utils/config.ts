import Conf from 'conf';
import * as readline from 'readline';
import chalk from 'chalk';

interface ConfigSchema {
  providers: {
    openai?: {
      apiKey: string;
      defaultModel: string;
    };
    anthropic?: {
      apiKey: string;
      defaultModel: string;
    };
    // Add more providers as needed
  };
  defaultProvider: string;
}

class Config {
  private config: Conf<ConfigSchema>;

  constructor() {
    this.config = new Conf<ConfigSchema>({
      projectName: 'piensa',
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

  public getProviderConfig(provider: string) {
    return this.config.get(`providers.${provider}`);
  }

  public getApiKey(provider: string): string | undefined {
    return this.config.get(`providers.${provider}.apiKey`);
  }

  public getDefaultModel(provider: string): string | undefined {
    return this.config.get(`providers.${provider}.defaultModel`);
  }

  public getDefaultProvider(): string {
    return this.config.get('defaultProvider');
  }

  public setApiKey(provider: string, apiKey: string): void {
    this.config.set(`providers.${provider}.apiKey`, apiKey);
  }

  public setDefaultModel(provider: string, model: string): void {
    this.config.set(`providers.${provider}.defaultModel`, model);
  }

  public setDefaultProvider(provider: string): void {
    this.config.set('defaultProvider', provider);
  }

  public async configure(): Promise<void> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const question = (query: string): Promise<string> => {
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
    if(openaiKey) {
      this.setApiKey('openai', openaiKey);
      const openaiModel = await question('Default OpenAI model [gpt-4]: ') || 'gpt-4';
      this.setDefaultModel('openai', openaiModel);
    }
    
    // Configure Anthropic
    console.log(chalk.yellow('\nAnthropic Configuration:'));
    const anthropicKey = await question('Anthropic API Key (leave empty to skip): ');
    if(anthropicKey) {
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
let configInstance: Config | null = null;

export function getConfig(): Config {
  if(!configInstance) {
    configInstance = new Config();
  }
  return configInstance;
} 