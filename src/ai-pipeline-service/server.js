// Express API server for AI pipeline service with queue and multi-template support
import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { generateCampaignAssets } from './mainCampaign.js';
import { manifest } from './manifest.js';

const app = express();
const PORT = process.env.AI_PIPELINE_PORT || 4000;

// CORS configuration for Codespaces
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.use(bodyParser.json({ limit: '2mb' }));

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Simple in-memory queue
let jobQueue = [];
let processing = false;


// POST /generate-content (supports batch/queue)
app.post('/generate-content', async (req, res) => {
  const { campaign, locations, template, screenLocation } = req.body;
  // Multi-template support
  const activeManifest = template ? template.manifest : manifest;
  jobQueue.push({ campaign, locations, manifest: activeManifest, screenLocation, res });
  processQueue();
});

async function processQueue() {
  if (processing || jobQueue.length === 0) return;
  processing = true;
  const job = jobQueue.shift();
  try {
    const result = await generateCampaignAssets({ 
      campaign: job.campaign, 
      locations: job.locations,
      screenLocation: job.screenLocation 
    });
    // Return as { campaign, content } for review, not assets
    job.res.json({ campaign: result.campaign, content: result.assets });
  } catch (err) {
    job.res.status(500).json({ error: err.message });
  }
  processing = false;
  if (jobQueue.length > 0) processQueue();
}

app.listen(PORT, () => {
  console.log(`AI Pipeline Service running on port ${PORT}`);
});
