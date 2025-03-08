import OpenAI from 'openai';
export class OpenAIProvider {
    async generateResponse(options) {
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
        }
        catch (e) {
            if (e instanceof Error) {
                throw new Error(`OpenAI error: ${e.message}`);
            }
            throw new Error('Unknown error occurred with OpenAI');
        }
    }
}
//# sourceMappingURL=openai.js.map