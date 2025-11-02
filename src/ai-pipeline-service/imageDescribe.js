import fetch from 'node-fetch';

// Vision LLM image description using OpenAI Vision API
export async function describeImages(photoUrls, location) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OpenAI API key not set');
  
  if (!photoUrls || photoUrls.length === 0) {
    console.log('[WARN] No photos provided for description');
    return [];
  }

  // Limit photos to prevent excessive API costs (max 10 images)
  const photosToAnalyze = photoUrls.slice(0, 10);
  console.log(`[INFO] Analyzing ${photosToAnalyze.length} images for ${location.name} using GPT-4o Vision`);

  // Build vision API request with image URLs
  const messages = [
    {
      role: 'system',
      content: 'You are a visual content auditor for advertising. Analyze images and return ONLY valid JSON with no markdown formatting.'
    },
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: `Analyze these ${photosToAnalyze.length} images for "${location.name}" (${location.category || 'business'}).

For EACH image (numbered 1-${photosToAnalyze.length}), return a JSON array with:
- index (the image number, starting from 1)
- description (one word: exterior/interior/product/team/signage/food/merchandise)
- suitability ("suitable" for business marketing images, or "unsuitable" only if blurry/inappropriate)

Be generous with "suitable" - product photos, storefronts, interiors, food, merchandise are all suitable for marketing.

Return ONLY this exact JSON format:
[{"index":1,"description":"exterior","suitability":"suitable"},{"index":2,"description":"interior","suitability":"suitable"}]`
        },
        // Add each image for vision analysis
        ...photosToAnalyze.map((url) => ({
          type: 'image_url',
          image_url: { 
            url, 
            detail: 'low' // Low detail = faster + cheaper, sufficient for suitability check
          }
        }))
      ]
    }
  ];

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o', // Vision-capable model (upgraded from gpt-3.5-turbo)
        messages,
        max_tokens: 2048,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[ERROR] OpenAI Vision API error:', response.status, error);
      throw new Error(`Vision API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('[DEBUG] OpenAI Vision API response:', JSON.stringify(data, null, 2));
    
    if (!data.choices || !data.choices[0].message.content) {
      throw new Error('No response from OpenAI Vision API');
    }
    
    let content = data.choices[0].message.content.trim();
    
    // Remove markdown code fences if present
    if (content.startsWith('```json')) {
      content = content.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    } else if (content.startsWith('```')) {
      content = content.replace(/^```\n?/, '').replace(/\n?```$/, '');
    }
    
    const results = JSON.parse(content);
    
    // Map indices back to URLs with index field preserved
    const mapped = results.map(r => ({
      index: r.index,
      url: photosToAnalyze[r.index - 1],
      description: r.description,
      suitability: r.suitability
    }));

    const suitableCount = mapped.filter(r => r.suitability === 'suitable').length;
    console.log(`[INFO] Vision analysis complete: ${suitableCount}/${mapped.length} images marked suitable`);

    return mapped;

  } catch (err) {
    console.error('[ERROR] Image description failed:', err.message);
    console.log('[WARN] Falling back: marking all images as suitable to prevent pipeline blocking');
    
    // Fallback: don't block pipeline if vision fails - maintain existing behavior
    return photosToAnalyze.map((url, idx) => ({
      index: idx + 1,
      url,
      description: `image${idx + 1}`,
      suitability: 'suitable'
    }));
  }
}
