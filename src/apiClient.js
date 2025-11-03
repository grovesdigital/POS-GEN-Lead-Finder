// API Client: Send authenticated requests to backend endpoints
const axios = require('axios');
const { getSupabaseJWT } = require('./supabaseAuth');

async function postCampaign(payload) {
  const jwt = await getSupabaseJWT();
  const response = await axios.post(
    'https://pos-gen.groves.digital/api/campaigns',
    payload,
    {
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
}

module.exports = { postCampaign };
