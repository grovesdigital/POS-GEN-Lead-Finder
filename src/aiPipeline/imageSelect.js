// Select header and sub image from suitable candidates
export async function selectImages(suitableImages, manifest) {
  // MVP: pick first two images
  return {
    header_image: suitableImages[0]?.url || '',
    sub_image: suitableImages[1]?.url || '',
  };
}
