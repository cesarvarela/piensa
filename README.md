# Think CLI 🧠

A simple CLI tool to interact easily with LLMs like OpenAI and Anthropic. Pipe in prompts, text, or files to quickly summarize, calculate, or get insights.

## Installation

```bash
npm install -g think
```

## Usage

### Quick Examples

Ask a simple question:

```bash
think "What's the capital of France?"
```

Pipe a calculation:

```bash
echo "2 + 2" | think "calculate"
```

Summarize a file:

```bash
cat myfile.txt | think "summarize"
```

### Options

Use a specific provider or model:

```bash
think "Question?" --provider openai
think "Question?" --model gpt-4
```

Set your API key (stored for reuse):

```bash
think "Question?" --key your-api-key
```

## Config

Set up your preferences:

```bash
think --config
```

Check your current config:

```bash
think config
```

Set a default model:

```bash
think set-model openai gpt-4-turbo
```

Check your default model:

```bash
think get-model openai
```

### Config Location

- macOS: `~/Library/Preferences/think-nodejs/config.json`
- Linux: `~/.config/think-nodejs/config.json`
- Windows: `%APPDATA%\think-nodejs\Config\config.json`

## Supported Providers

- OpenAI (default)
- Anthropic

## Development

Clone and run locally:

```bash
git clone https://github.com/cesarvarela/think.git
cd think
npm install
npm run build
npm start "Your prompt here"
```

## License

ISC

