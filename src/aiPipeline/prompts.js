// Supporting prompts for LLM asset generation
export const textPrompt = ({ location, manifest }) => `
Generate a JSON object for a marketing asset for the following business:
Business Name: ${location.name}
Address: ${location.address}
Phone: ${location.phone || 'N/A'}

Fields required:
- headline (max ${manifest.fields.headline.maxLength} chars)
- subline1 (max ${manifest.fields.subline1.maxLength} chars)
- subline2 (max ${manifest.fields.subline2.maxLength} chars)
- cta (max ${manifest.fields.cta.maxLength} chars)
- supporting (max ${manifest.fields.supporting.maxLength} chars)

Respond ONLY with valid JSON.
`;

export const imagePrompt = ({ location, photoUrls }) => `
Describe each image for the business ${location.name}.
For each image, provide:
- url
- description (type: exterior, interior, product, team, signage)
- suitability ("suitable" if clear, relevant, no people/private data)
Respond as a JSON array.
Images:
${photoUrls.join('\n')}
`;
