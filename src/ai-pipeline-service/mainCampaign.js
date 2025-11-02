// Orchestrator for AI asset generation pipeline
import { describeImages } from './imageDescribe.js';
import { selectImages } from './imageSelect.js';
import { generateText } from './textGenerate.js';
import { manifest } from './manifest.js';
import { validateAsset } from './utils/schemaValidate.js';
import { log } from './utils/logger.js';
import { cacheGet, cacheSet } from './utils/cache.js';
import { detectLanguageFromAddress, getLanguageName } from './utils/localization.js';

export async function generateCampaignAssets({ campaign, locations, screenLocation }) {
  // Detect language from screen location
  const language = screenLocation?.address 
    ? detectLanguageFromAddress(screenLocation.address)
    : 'en';
  
  log('info', `Campaign language: ${getLanguageName(language)} (${language})`);
  
  const assets = [];
  for (const loc of locations) {
    log('info', `Processing location: ${loc.name}`);
    // Caching image descriptions
    let evaluated = await cacheGet(`imgdesc:${loc.gmb_id}`);
    if (!evaluated) {
      evaluated = await describeImages(loc.photos, loc);
      await cacheSet(`imgdesc:${loc.gmb_id}`, evaluated);
    }
    const suitable = evaluated.filter(i => i.suitability === 'suitable');
    if (!suitable.length) {
      log('warn', `No suitable images for ${loc.name}`);
      continue;
    }
    const chosen = await selectImages(suitable, manifest);
    const text = await generateText(loc, manifest, language);
    const asset = {
      campaign_id: campaign.campaign_id,
      campaign_name: campaign.campaign_name,
      business_name: loc.name,
      language: language,
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
