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
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf8')
);

const program = new Command();

program
  .name('think')
  .description('Pipe text into LLM agents from different providers')
  .version(packageJson.version)
  .argument('[prompt]', 'The prompt to send to the LLM')
  .option('-p, --provider <provider>', 'LLM provider to use (openai, anthropic)', 'openai')
  .option('-m, --model <model>', 'Model to use (e.g., gpt-4, claude-3-opus)')
  .option('-k, --key <key>', 'API key for the provider (will be stored for future use)')
  .option('-c, --config', 'Configure API keys and default settings')
  .action(async (prompt, options) => {
    try {
      // Handle configuration mode
      if(options.config) {
        await getConfig().configure();
        return;
      }

      // Get input from stdin if no prompt is provided
      let input = '';
      if(!process.stdin.isTTY) {
        const chunks = [];
        for await (const chunk of process.stdin) {
          chunks.push(chunk);
        }
        input = Buffer.concat(chunks).toString().trim();
      }

      if(!prompt && !input) {
        console.error(chalk.red('Error: No input provided. Provide a prompt or pipe content.'));
        process.exit(1);
      }

      const spinner = ora('Thinking...').start();
      
      const result = await processInput({
        prompt,
        input,
        provider: options.provider,
        model: options.model,
        apiKey: options.key
      });
      
      spinner.stop();
      console.log(result);
    } catch(e) {
      if(e instanceof Error) {
        console.error(chalk.red(`Error: ${e.message}`));
      } else {
        console.error(chalk.red('An unknown error occurred'));
      }
      process.exit(1);
    }
  });

program.parse(); 