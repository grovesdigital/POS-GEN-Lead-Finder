// Supporting prompts for LLM asset generation
export const textPrompt = ({ location, manifest, language = 'en' }) => {
  const languageInstructions = {
    'de': 'Generate ALL text in GERMAN. Use natural, marketing-friendly German language.',
    'sv': 'Generate ALL text in SWEDISH. Use natural, marketing-friendly Swedish language.',
    'fr': 'Generate ALL text in FRENCH. Use natural, marketing-friendly French language.',
    'es': 'Generate ALL text in SPANISH. Use natural, marketing-friendly Spanish language.',
    'it': 'Generate ALL text in ITALIAN. Use natural, marketing-friendly Italian language.',
    'nl': 'Generate ALL text in DUTCH. Use natural, marketing-friendly Dutch language.',
    'pt': 'Generate ALL text in PORTUGUESE. Use natural, marketing-friendly Portuguese language.',
    'pl': 'Generate ALL text in POLISH. Use natural, marketing-friendly Polish language.',
    'da': 'Generate ALL text in DANISH. Use natural, marketing-friendly Danish language.',
    'no': 'Generate ALL text in NORWEGIAN. Use natural, marketing-friendly Norwegian language.',
    'fi': 'Generate ALL text in FINNISH. Use natural, marketing-friendly Finnish language.',
    'en': 'Generate ALL text in ENGLISH. Use natural, marketing-friendly English language.',
  };
  
  return `
${languageInstructions[language] || languageInstructions['en']}

Generate a JSON object for a marketing asset for the following business:
Business Name: ${location.name}
Address: ${location.address}
Phone: ${location.phone || 'N/A'}

Fields required:
- headline (max ${manifest.fields.headline.maxLength} characters, including spaces)
- subline1 (max ${manifest.fields.subline1.maxLength} characters, including spaces)
- subline2 (max ${manifest.fields.subline2.maxLength} characters, including spaces)
- cta (max ${manifest.fields.cta.maxLength} characters, including spaces)
- supporting (max ${manifest.fields.supporting.maxLength} characters, including spaces)

STRICTLY respect every character limit. If any field would exceed its limit, shorten it first. Count spaces as characters. Never exceed the limits.

Respond ONLY with valid JSON.
`;
};

export const imagePrompt = ({ location, photoUrls }) => `
Analyze these ${photoUrls.length} images for ${location.name}.

For EACH image (numbered 1-${photoUrls.length}), return a JSON array with:
- index (the image number)
- description (one word: exterior/interior/product/team/signage)
- suitability ("suitable" for business marketing images, or "unsuitable" only if blurry/inappropriate)

Be generous with "suitable" - product photos, storefronts, interiors are all suitable for marketing.
Return ONLY valid JSON array. Example: [{"index":1,"description":"exterior","suitability":"suitable"}]

Number of images: ${photoUrls.length}
`;
