import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateSceneBreakdown(script) {
  if (!script || typeof script !== 'string') {
    throw new Error('Invalid script format');
  }

  const systemPrompt = `
  As a video production expert, analyze this script and break it down into distinct scenes.
  For each scene, provide:
  1. Subject and main action
  2. Key visual elements
  Format: Return 3-5 scene descriptions separated by commas.
  Example: "person walking on beach at sunset, children playing in park with kites, couple dining at romantic restaurant"
  `;

  const chatCompletion = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: script }
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
    max_completion_tokens: 1024,
    top_p: 1,
    stream: false
  });

  return chatCompletion.choices[0]?.message?.content || 'No response from AI';
}
