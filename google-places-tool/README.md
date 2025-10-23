# Google Places Query Tool (New API)

Modern, interactive web application for querying Google Places API (New) with real-time map visualization, multi-type search, and beautiful results display. Perfect for business research, lead generation, and location intelligence.

## Features

### Core Functionality
- 🔐 **Secure API Key Storage** - Encrypted local storage of your Google API key
- 📍 **Smart Location Search** - Google Places Autocomplete integration for easy location selection
- 🗺️ **Interactive Map Preview** - Real-time visualization of search results on Google Maps
- 🏢 **Multi-Type Selection** - Search for multiple business types simultaneously
- 📏 **Adjustable Search Radius** - Slider control from 100m to 50km
- 📊 **Beautiful Results Display** - Card-based layout with business photos
- 📤 **Export Capabilities** - Export results as JSON or CSV
- ⚙️ **Settings Management** - Update or clear API key anytime

### User Experience
- ✨ **Setup Wizard** - Guided first-time setup with step-by-step instructions
- 🎨 **Modern UI** - Clean, responsive design that works on all devices
- 🚀 **Single Page App** - Smooth transitions without page reloads
- 📱 **Mobile Friendly** - Fully responsive for mobile and tablet use

### Google Maps Platform Compliance
- ✅ Uses official Google Places API (New)
- ✅ Proper photo attributions
- ✅ Direct Google Maps links
- ✅ No unauthorized data caching
- ✅ Internal use compliant

## Project Structure

```
google-places-tool/
├── index.html          # Main application (single-page app)
├── app.js              # Application logic and Google Maps integration
├── styles.css          # Modern, responsive styling
├── results.html        # Legacy file (not used in new version)
├── Dockerfile          # Container configuration
├── docker-compose.yml  # Docker Compose setup
├── .dockerignore       # Docker ignore rules
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## Prerequisites

### Google Cloud Setup

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable Required APIs**
   - **Places API (New)** - For place searches
   - **Maps JavaScript API** - For map display
   - **Places API (Legacy)** - For Autocomplete (if needed)

3. **Create API Key**
   - Navigate to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - **Important:** Restrict your API key:
     - Application restrictions: HTTP referrers (for production)
     - API restrictions: Select only the APIs listed above

4. **Enable Billing**
   - Google Cloud requires a billing account
   - Monitor usage at [Google Cloud Console](https://console.cloud.google.com/billing)

### API Pricing (as of 2024)
- **Places Nearby Search (New):** ~$32 per 1,000 requests
- **Maps JavaScript API:** $7 per 1,000 map loads
- **Autocomplete:** $2.83-$17 per 1,000 requests
- **Place Photos:** $7 per 1,000 requests
- **Free Tier:** $200 monthly credit

## Installation & Local Development

### Option 1: Simple HTTP Server (Recommended for Testing)

**Python 3:**
```bash
cd google-places-tool
python3 -m http.server 8000
```

**Node.js (http-server):**
```bash
npm install -g http-server
cd google-places-tool
http-server -p 8000
```

**PHP:**
```bash
cd google-places-tool
php -S localhost:8000
```

Then open: `http://localhost:8000`

### Option 2: Docker (Production-Ready)

**Build and Run:**
```bash
cd google-places-tool
docker build -t google-places-tool .
docker run -d -p 8080:80 google-places-tool
```

Access at: `http://localhost:8080`

**Using Docker Compose:**
```bash
docker-compose up -d
```

## CORS Issue & Solutions

### The Problem

The Google Places API (New) blocks direct browser requests due to CORS (Cross-Origin Resource Sharing) policy. This is intentional by Google for security.

### Solutions

#### Solution 1: Backend Proxy (Recommended for Production)

Create a simple backend proxy to handle API requests:

**Node.js/Express Proxy:**

```javascript
// proxy-server.js
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/places/nearby', async (req, res) => {
    try {
        const response = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': req.headers['x-api-key'],
                'X-Goog-FieldMask': req.headers['x-goog-fieldmask']
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3001, () => console.log('Proxy server running on port 3001'));
```

**Install dependencies:**
```bash
npm install express cors node-fetch
```

**Run the proxy:**
```bash
node proxy-server.js
```

**Update app.js** to use proxy (line 414):
```javascript
const url = 'http://localhost:3001/api/places/nearby';
// Remove 'X-Goog-Api-Key' from headers, add:
headers: {
    'Content-Type': 'application/json',
    'x-api-key': APP_STATE.apiKey,
    'x-goog-fieldmask': 'places.displayName,...'
}
```

#### Solution 2: Browser Extension (Development Only)

For local testing only:

**Chrome:**
- Install [CORS Unblock](https://chrome.google.com/webstore) extension
- Enable it only when testing

**Firefox:**
- Install [CORS Everywhere](https://addons.mozilla.org/firefox) extension
- Enable temporarily for development

⚠️ **Warning:** Never deploy with CORS disabled. This is for local testing only.

#### Solution 3: Cloud Functions (Production)

Deploy a serverless function:

**Google Cloud Functions:**
```bash
gcloud functions deploy placesProxy \
  --runtime nodejs18 \
  --trigger-http \
  --allow-unauthenticated
```

**AWS Lambda:**
Use API Gateway + Lambda function to proxy requests

#### Solution 4: Nginx Reverse Proxy (VPS Deployment)

**nginx.conf:**
```nginx
location /api/places/ {
    proxy_pass https://places.googleapis.com/v1/places/;
    proxy_set_header X-Goog-Api-Key $http_x_api_key;
    add_header Access-Control-Allow-Origin *;
}
```

## Usage Guide

### First Time Setup

1. **Open the Application**
   - Navigate to `http://localhost:8000` (or your server URL)

2. **Welcome Screen**
   - You'll see a beautiful onboarding screen
   - Follow the 3-step guide to get your API key

3. **Enter API Key**
   - Paste your Google Places API key
   - Click "Continue to Search Tool"
   - Your key is encrypted and stored locally in your browser

### Searching for Places

1. **Select Location**
   - Click the "Search Location" input
   - Type a city, address, or place name
   - Select from the autocomplete dropdown
   - The map will center on your selection

2. **Set Search Radius**
   - Use the slider to set your search radius (100m - 50km)
   - The value updates in real-time

3. **Choose Business Types**
   - Click "Select business types..."
   - Use the search box to filter types
   - Check multiple business types
   - Selected types appear as tags below

4. **Preview on Map**
   - Click "🔍 Find businesses"
   - Results appear as markers on the map
   - Click markers to see business info
   - Map auto-zooms to show all results

5. **View Detailed Results**
   - Click "📋 View Results" button
   - Browse results in beautiful card format
   - See photos, ratings, reviews, and types
   - Click "View on Google Maps" to open in Google Maps

6. **Export Data**
   - Click "Export JSON" for structured data
   - Click "Export CSV" for spreadsheet import
   - Files download automatically

### Managing Settings

1. **Click the gear icon (⚙️)** in the top right
2. **Update API Key:** Enter a new key and save
3. **Clear API Key:** Remove stored key (returns to setup)

## Official Place Types

The application supports 100+ official Google Places API types including:

**Food & Drink:** restaurant, cafe, bar, bakery, meal_delivery, meal_takeaway
**Shopping:** clothing_store, electronics_store, jewelry_store, supermarket, shopping_mall
**Services:** hair_care, spa, gym, laundry, car_repair, plumber, electrician
**Health:** hospital, pharmacy, dentist, doctor, physiotherapist
**Professional:** lawyer, accountant, real_estate_agency, insurance_agency
**Automotive:** gas_station, car_dealer, car_rental, car_wash
**And many more...**

## VPS Deployment

### Prerequisites on VPS
- Ubuntu 20.04+ or similar Linux distribution
- Docker and Docker Compose installed
- Open firewall port (default: 8080)
- SSH access

### Deployment Steps

1. **SSH into your VPS:**
```bash
ssh user@your-vps-ip
```

2. **Create project directory:**
```bash
mkdir -p ~/google-places-tool
```

3. **Transfer files from your local machine:**
```bash
# From your local machine
scp -r google-places-tool/* user@your-vps-ip:~/google-places-tool/
```

Or use `rsync` for better performance:
```bash
rsync -avz --progress google-places-tool/ user@your-vps-ip:~/google-places-tool/
```

4. **On the VPS, build and start:**
```bash
cd ~/google-places-tool
docker-compose up -d
```

5. **Verify it's running:**
```bash
docker ps
docker logs google-places-tool
```

6. **Access the application:**
```
http://your-vps-ip:8080
```

### Custom Port

Edit `docker-compose.yml`:
```yaml
ports:
  - "3000:80"  # Change 3000 to your desired port
```

Then restart:
```bash
docker-compose down
docker-compose up -d
```

### Domain Setup with Nginx

1. **Install Nginx:**
```bash
sudo apt update
sudo apt install nginx
```

2. **Create Nginx config:**
```bash
sudo nano /etc/nginx/sites-available/places-tool
```

3. **Add configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

4. **Enable the site:**
```bash
sudo ln -s /etc/nginx/sites-available/places-tool /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

5. **Add SSL with Let's Encrypt:**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Troubleshooting

### CORS Error
**Problem:** "CORS blocked" error when searching
**Solution:** Implement one of the proxy solutions above (see CORS Section)

### API Key Invalid
**Problem:** "Invalid API key" or "Request denied"
**Solutions:**
- Verify the API key is correct
- Check that Places API (New) is enabled in Google Cloud Console
- Verify billing is enabled
- Check API key restrictions aren't too strict

### Map Not Loading
**Problem:** Map doesn't appear or shows gray box
**Solutions:**
- Check browser console for errors
- Verify Maps JavaScript API is enabled
- Check API key has proper permissions
- Try clearing browser cache

### No Results Found
**Problem:** Search returns zero results
**Solutions:**
- Increase search radius
- Try a different location
- Verify business types exist in that area
- Check API quotas haven't been exceeded

### Autocomplete Not Working
**Problem:** Location search doesn't show suggestions
**Solutions:**
- Enable "Places API" (legacy) in addition to "Places API (New)"
- Check API key restrictions
- Verify network connectivity

### Docker Issues
```bash
# Check if container is running
docker ps -a

# View logs
docker logs google-places-tool

# Restart container
docker restart google-places-tool

# Rebuild from scratch
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Storage Issues
**Problem:** API key not persisting
**Solutions:**
- Check if browser allows localStorage
- Try in a different browser
- Disable private/incognito mode
- Check browser storage isn't full

## Security Best Practices

### API Key Security
1. **Never commit API keys to version control**
2. **Use environment variables in production**
3. **Restrict API key by:**
   - HTTP referrers (your domain)
   - IP addresses (your VPS)
   - Specific APIs only
4. **Rotate keys regularly**
5. **Monitor usage for anomalies**

### Application Security
1. **Use HTTPS in production** (Let's Encrypt)
2. **Keep Docker images updated**
3. **Implement rate limiting** (in proxy)
4. **Use firewall rules** (UFW on Ubuntu)
5. **Regular security audits**

### Monitoring
Monitor your API usage:
- [Google Cloud Console](https://console.cloud.google.com/)
- Set up budget alerts
- Review API logs regularly

## Advanced Configuration

### Environment Variables

Create a `.env` file (don't commit):
```bash
GOOGLE_API_KEY=your_api_key_here
PORT=8080
NODE_ENV=production
```

### Custom Styling

Edit `styles.css` to customize colors:
```css
:root {
    --primary-color: #your-color;
    --secondary-color: #your-color;
}
```

### Additional Features

Want to add more features? The codebase is well-structured:
- **app.js** - Add new API calls or features
- **index.html** - Add new UI components
- **styles.css** - Customize appearance

## API Limits & Quotas

### Request Limits
- **Nearby Search:** 20 results per request
- **Rate Limit:** Based on your Google Cloud quota
- **Daily Limit:** Set in Google Cloud Console

### Cost Management
- Monitor usage in Google Cloud Console
- Set budget alerts
- Use pagination wisely
- Cache results when appropriate (per TOS)

## Support & Resources

### Documentation
- [Google Places API (New)](https://developers.google.com/maps/documentation/places/web-service/place-id)
- [Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [Place Types Reference](https://developers.google.com/maps/documentation/places/web-service/supported_types)

### Getting Help
- Check browser console for errors
- Review Google Cloud logs
- Verify API is enabled and billed
- Check network connectivity

### Common Issues
- **CORS:** Use proxy solution
- **No results:** Increase radius or change location
- **API errors:** Check key and quotas
- **Map issues:** Verify Maps API is enabled

## License

Internal tool for business research and lead generation. Not for public distribution or commercial resale. Must comply with Google Maps Platform Terms of Service.

## Credits

Built with:
- Google Maps JavaScript API
- Google Places API (New)
- Vanilla JavaScript (no frameworks)
- Modern CSS3
- Docker for containerization

---

**Version:** 2.0
**Last Updated:** 2024
**Supports:** Google Places API (New)

Enjoy your new Google Places Query Tool! 🗺️✨
