// Minimal Express server for asset generation pipeline
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { generateCampaignAssets } from './aiPipeline/mainCampaign.js';


const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json({ limit: '2mb' }));

app.post('/api/generate-assets', async (req, res) => {
  try {
    // Accept campaign, locations, and LLM config from frontend
    const { campaign, businesses, llmApiKey, llmApiUrl } = req.body;
    // Set env vars for LLM usage
    process.env.LLM_API_KEY = llmApiKey;
    process.env.LLM_API_URL = llmApiUrl;
    // Rename businesses to locations for pipeline
    const locations = businesses;
    // Run pipeline
    const result = await generateCampaignAssets({ campaign, locations });
    res.json(result);
  } catch (err) {
    console.error('Asset generation error:', err);
    res.status(500).json({ error: 'Asset generation failed', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`POS-gen asset server running on port ${PORT}`);
});
