# Piensa 🧠

A simple CLI tool to interact easily with LLMs like OpenAI and Anthropic. Pipe in prompts, text, or files to quickly summarize, calculate, or get insights.

## Installation

```bash
npm install -g piensa
```

## Usage

### Quick Examples

Ask a simple question:

```bash
piensa "What's the capital of France?"
```

Pipe a calculation:

```bash
echo "2 + 2" | piensa "calculate"
```

Summarize a file:

```bash
cat myfile.txt | piensa "summarize"
```

### Options

Use a specific provider or model:

```bash
piensa "Question?" --provider openai
piensa "Question?" --model gpt-4
```

Set your API key (stored for reuse):

```bash
piensa "Question?" --key your-api-key
```

## Config

Set up your preferences:

```bash
piensa --config
```

Check your current config:

```bash
piensa config
```

Set a default model:

```bash
piensa set-model openai gpt-4-turbo
```

Check your default model:

```bash
piensa get-model openai
```

### Config Location

- macOS: `~/Library/Preferences/piensa-nodejs/config.json`
- Linux: `~/.config/piensa-nodejs/config.json`
- Windows: `%APPDATA%\piensa-nodejs\Config\config.json`

### Security Note

⚠️ **API Key Security**: API keys are stored in plain text in the configuration file. While these files are protected by your operating system's user permissions, please be aware of the following risks:

- Do not share your configuration directory or backups containing these files
- Be cautious when using on shared computers
- Consider using environment variables for API keys in sensitive environments
- If your machine is compromised, an attacker could potentially access these keys

## Supported Providers

- OpenAI (default)
- Anthropic

## Development

Clone and run locally:

```bash
git clone https://github.com/cesarvarela/piensa.git
cd piensa
npm install
npm run build
npm start "Your prompt here"
```

## License

ISC

