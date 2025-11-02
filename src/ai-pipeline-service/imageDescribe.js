import fetch from 'node-fetch';
import { imagePrompt } from '../aiPipeline/prompts.js';

// Vision LLM image description using OpenAI API
export async function describeImages(photoUrls, location) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OpenAI API key not set');
  const prompt = imagePrompt({ location, photoUrls });
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that returns ONLY valid JSON arrays. Never add explanations or markdown.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 512,
      temperature: 0.3,
    }),
  });
  const data = await response.json();
  console.log('OpenAI imageDescribe response:', JSON.stringify(data, null, 2));
  if (!data.choices || !data.choices[0].message.content) throw new Error('No response from OpenAI');
  
  let content = data.choices[0].message.content.trim();
  // Remove markdown code fences if present
  if (content.startsWith('```json')) {
    content = content.replace(/^```json\n?/, '').replace(/\n?```$/, '');
  } else if (content.startsWith('```')) {
    content = content.replace(/^```\n?/, '').replace(/\n?```$/, '');
  }
  
  try {
    const results = JSON.parse(content);
    // Map indices back to URLs
    return results.map(r => ({
      url: photoUrls[r.index - 1],
      description: r.description,
      suitability: r.suitability
    }));
  } catch (err) {
    console.error('Failed to parse imageDescribe response:', content);
    throw new Error('Failed to parse AI response as JSON');
  }
}
