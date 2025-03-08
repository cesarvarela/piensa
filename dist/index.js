#!/usr/bin/env node
import { Command } from 'commander';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import ora from 'ora';
import { processInput } from './utils/processor.js';
import { getConfig } from './utils/config.js';
// https://github.com/anthropics/anthropic-sdk-typescript/issues/598
// @ts-ignore
process.noDeprecation = true;
// Get the equivalent of __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Read package.json for version info
const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'));
const program = new Command();
program
    .name('piensa')
    .description('Pipe text into LLM agents from different providers')
    .version(packageJson.version);
// Main command
program
    .argument('[prompt]', 'The prompt to send to the LLM')
    .option('-p, --provider <provider>', 'LLM provider to use (openai, anthropic)', 'openai')
    .option('-m, --model <model>', 'Model to use (e.g., gpt-4, claude-3-opus)')
    .option('-k, --key <key>', 'API key for the provider (will be stored for future use)')
    .option('-c, --config', 'Configure API keys and default settings')
    .action(async (prompt, options) => {
    try {
        // Handle configuration mode
        if (options.config) {
            await getConfig().configure();
            return;
        }
        // Get input from stdin if no prompt is provided
        let input = '';
        if (!process.stdin.isTTY) {
            const chunks = [];
            for await (const chunk of process.stdin) {
                chunks.push(chunk);
            }
            input = Buffer.concat(chunks).toString().trim();
        }
        if (!prompt && !input) {
            console.error(chalk.red('Error: No input provided. Provide a prompt or pipe content.'));
            process.exit(1);
        }
        const spinner = ora('Processing...').start();
        const result = await processInput({
            prompt,
            input,
            provider: options.provider,
            model: options.model,
            apiKey: options.key
        });
        spinner.stop();
        console.log(result);
    }
    catch (e) {
        if (e instanceof Error) {
            console.error(chalk.red(`Error: ${e.message}`));
        }
        else {
            console.error(chalk.red('An unknown error occurred'));
        }
        process.exit(1);
    }
});
// Set model for any provider
program
    .command('set-model')
    .description('Set the default model for a specific provider')
    .argument('<provider>', 'The provider to set the model for (e.g., openai, anthropic)')
    .argument('<model>', 'The model to set as default')
    .action(async (provider, model) => {
    try {
        const config = getConfig();
        config.setDefaultModel(provider, model);
        console.log(chalk.green(`Default model for ${provider} set to: ${model}`));
    }
    catch (e) {
        if (e instanceof Error) {
            console.error(chalk.red(`Error: ${e.message}`));
        }
        else {
            console.error(chalk.red('An unknown error occurred'));
        }
        process.exit(1);
    }
});
// Get model for a specific provider
program
    .command('get-model')
    .description('Get the current default model for a specific provider')
    .argument('<provider>', 'The provider to get the model for (e.g., openai, anthropic)')
    .action(async (provider) => {
    try {
        const config = getConfig();
        const model = config.getDefaultModel(provider);
        if (model) {
            console.log(chalk.green(`Default model for ${provider}: ${model}`));
        }
        else {
            console.log(chalk.yellow(`No default model set for ${provider}`));
        }
    }
    catch (e) {
        if (e instanceof Error) {
            console.error(chalk.red(`Error: ${e.message}`));
        }
        else {
            console.error(chalk.red('An unknown error occurred'));
        }
        process.exit(1);
    }
});
// View current configuration
program
    .command('config')
    .description('View current configuration settings')
    .action(async () => {
    try {
        const config = getConfig();
        const defaultProvider = config.getDefaultProvider();
        console.log(chalk.blue('=== Piensa CLI Configuration ==='));
        console.log(chalk.yellow('\nDefault Provider:'), defaultProvider);
        // Display OpenAI settings if configured
        const openaiConfig = config.getProviderConfig('openai');
        if (openaiConfig) {
            console.log(chalk.yellow('\nOpenAI Configuration:'));
            console.log('API Key:', openaiConfig.apiKey ? '********' + openaiConfig.apiKey.slice(-4) : 'Not set');
            console.log('Default Model:', openaiConfig.defaultModel || 'Not set');
        }
        // Display Anthropic settings if configured
        const anthropicConfig = config.getProviderConfig('anthropic');
        if (anthropicConfig) {
            console.log(chalk.yellow('\nAnthropic Configuration:'));
            console.log('API Key:', anthropicConfig.apiKey ? '********' + anthropicConfig.apiKey.slice(-4) : 'Not set');
            console.log('Default Model:', anthropicConfig.defaultModel || 'Not set');
        }
    }
    catch (e) {
        if (e instanceof Error) {
            console.error(chalk.red(`Error: ${e.message}`));
        }
        else {
            console.error(chalk.red('An unknown error occurred'));
        }
        process.exit(1);
    }
});
program.parse();
//# sourceMappingURL=index.js.map