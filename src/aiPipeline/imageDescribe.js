import { imagePrompt } from './prompts.js';
import { postJSON } from './utils/httpClient.js';

export async function describeImages(photoUrls, location) {
  const prompt = imagePrompt({ location, photoUrls });
  const apiUrl = process.env.LLM_API_URL;
  const apiKey = process.env.LLM_API_KEY;
  const payload = {
    model: 'gpt-5-nano-vision',
    prompt,
    temperature: 0.1,
    max_tokens: 512,
    response_format: 'json',
  };
  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
  try {
    const response = await postJSON(apiUrl, payload, headers);
    if (response && response.data) {
      return JSON.parse(response.data);
    }
    throw new Error('No data from LLM');
  } catch (err) {
    console.error('LLM image description failed:', err);
    // Fallback: mark all as unsuitable
    return photoUrls.map(url => ({ url, description: '', suitability: 'unsuitable' }));
  }
}
