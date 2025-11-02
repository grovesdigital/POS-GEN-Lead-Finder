// Select header and sub image from suitable candidates
export async function selectImages(suitableImages, manifest) {
  // Pick first two images for MVP
  return {
    header_image: suitableImages[0]?.url || '',
    sub_image: suitableImages[1]?.url || '',
    rationale: 'Selected based on manifest and suitability.'
  };
}
