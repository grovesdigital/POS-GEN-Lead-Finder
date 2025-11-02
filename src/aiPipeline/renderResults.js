// Renders campaign assets to HTML and opens in browser
import fs from 'fs';
import path from 'path';

export async function renderResults({ campaign, assets }) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Generated Campaign Assets</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 2em; }
    .asset { border: 1px solid #ccc; margin-bottom: 2em; padding: 1em; }
    img { max-width: 300px; display: block; margin-bottom: 1em; }
    .field { margin-bottom: 0.5em; }
  </style>
</head>
<body>
  <h1>Campaign: ${campaign.campaign_name}</h1>
  <h2>Assets</h2>
  ${assets.map(asset => `
    <div class="asset">
      <h3>${asset.business_name}</h3>
      <div class="field"><strong>Headline:</strong> ${asset.headline}</div>
      <div class="field"><strong>Subline 1:</strong> ${asset.subline1}</div>
      <div class="field"><strong>Subline 2:</strong> ${asset.subline2}</div>
      <div class="field"><strong>CTA:</strong> ${asset.cta}</div>
      <div class="field"><strong>Supporting:</strong> ${asset.supporting}</div>
      <div class="field"><strong>Header Image:</strong><br><img src="${asset.header_image}" alt="Header"></div>
      <div class="field"><strong>Sub Image:</strong><br><img src="${asset.sub_image}" alt="Sub"></div>
      <div class="field"><strong>Generated At:</strong> ${asset.generated_at}</div>
      <div class="field"><strong>Versions:</strong> ${JSON.stringify(asset.versions)}</div>
    </div>
  `).join('')}
</body>
</html>`;

  const outPath = path.resolve('/tmp/campaign-assets.html');
  fs.writeFileSync(outPath, html);
  return outPath;
}
