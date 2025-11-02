// MVP test harness for asset generation and result rendering
import { generateCampaignAssets } from './mainCampaign.js';
import { renderResults } from './renderResults.js';
import { log } from './utils/logger.js';

const campaign = {
  campaign_id: 'cmp_001',
  campaign_name: 'Autumn Specials',
};

const locations = [
  {
    name: 'Cafe Aroma',
    address: '123 Main St',
    phone: '555-1234',
    photos: [
      'https://via.placeholder.com/1200x600?text=Header+Image',
      'https://via.placeholder.com/600x600?text=Sub+Image',
    ],
  },
  {
    name: 'Bistro Bella',
    address: '456 Oak Ave',
    phone: '555-5678',
    photos: [
      'https://via.placeholder.com/1200x600?text=Header+Image',
      'https://via.placeholder.com/600x600?text=Sub+Image',
    ],
  },
];

async function main() {
  log('info', 'Starting asset generation...');
  const result = await generateCampaignAssets({ campaign, locations });
  log('info', `Generated ${result.assets.length} assets.`);
  const htmlPath = await renderResults(result);
  log('info', `Results written to: ${htmlPath}`);
  console.log('To view results, run: $BROWSER', htmlPath);
}

main();
