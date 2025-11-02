// Orchestrator for campaign asset generation
import { describeImages } from './imageDescribe.js';
import { selectImages } from './imageSelect.js';
import { generateText } from './textGenerate.js';
import { manifest } from './manifest.js';
import { validateAsset } from './utils/schemaValidate.js';
import { log } from './utils/logger.js';

export async function generateCampaignAssets({ campaign, locations }) {
  const assets = [];
  for (const loc of locations) {
    log('info', `Processing location: ${loc.name}`);
    const evaluated = await describeImages(loc.photos, loc);
    const suitable = evaluated.filter(i => i.suitability === 'suitable');
    if (!suitable.length) {
      log('warn', `No suitable images for ${loc.name}`);
      continue;
    }
    const chosen = await selectImages(suitable, manifest);
    const text = await generateText(loc, manifest);
    const asset = {
      campaign_id: campaign.campaign_id,
      campaign_name: campaign.campaign_name,
      business_name: loc.name,
      ...text,
      ...chosen,
      generated_at: new Date().toISOString(),
      versions: {
        manifest: 'beta',
        model: 'gpt-5-nano',
        pipeline: 'v1.0',
      },
    };
    if (validateAsset(asset)) {
      assets.push(asset);
    } else {
      log('error', `Validation failed for asset: ${loc.name}`);
    }
  }
  return { campaign, assets };
}
