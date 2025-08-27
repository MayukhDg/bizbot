import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateAnswer({ system, messages, temperature = 0.2 }) {
  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature,
    messages: [
      { role: 'system', content: system },
      ...messages.map(m => ({ role: m.role, content: m.content })),
    ],
  });
  return res.choices[0].message.content?.trim() || '';
}