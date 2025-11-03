// Supabase Auth: Login and JWT retrieval for API requests
const axios = require('axios');
require('dotenv').config();

const SUPABASE_URL = 'https://opcyxmdyufiqlbtzyrsy.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_EMAIL = process.env.SUPABASE_EMAIL;
const SUPABASE_PASSWORD = process.env.SUPABASE_PASSWORD;

async function getSupabaseJWT() {
  try {
    const response = await axios.post(
      `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
      {
        email: SUPABASE_EMAIL,
        password: SUPABASE_PASSWORD
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY
        }
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Supabase login failed:', error.response?.data || error.message);
    throw error;
  }
}

module.exports = { getSupabaseJWT };
