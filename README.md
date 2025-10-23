# POS-GEN Lead Finder

> 🎯 **Professional Lead Generation Tool** - Discover, analyze, and generate leads with intelligent location-based business search powered by Google Places API

## Overview

POS-GEN Lead Finder is a comprehensive web application designed for lead generation professionals, marketers, and businesses looking to discover and target local businesses efficiently. The tool combines Google Places API with intelligent search capabilities and campaign management features to streamline the lead generation process.

## ✨ Key Features

### 🔍 Quick Search Mode
- **Smart Location Search** - Find businesses around any location using Google Places Autocomplete
- **Interactive Map Visualization** - Real-time results displayed on Google Maps with custom markers
- **Multi-Business Type Selection** - Search across 100+ business categories simultaneously
- **Adjustable Search Radius** - Precise control from 100m to 5km radius
- **Advanced Filtering & Sorting** - Filter by ratings, reviews, distance, and business status
- **Export Capabilities** - Export results as JSON or CSV for further processing

### 🎯 Campaign Builder Mode
- **Batch Lead Generation** - Create targeted campaigns across multiple business types
- **Intelligent Business Suggestions** - Automatically find top-rated businesses per industry
- **Customizable Campaign Parameters** - Set location, radius, and businesses per industry
- **Asset Generation Ready** - Prepare data for automated ad and content creation
- **Multi-Step Workflow** - Organized campaign setup, business selection, and action execution

### 🛡️ Security & Compliance
- **Encrypted API Key Storage** - Secure local storage of Google API credentials
- **Google Maps Platform Compliant** - Follows all Google Maps Platform Terms of Service
- **No Unauthorized Data Caching** - Respects API usage policies
- **Privacy-First Design** - All data processing happens locally in your browser

## 🚀 Getting Started

### Prerequisites
- Google Cloud Platform account
- Google Places API (New) key
- Maps JavaScript API enabled
- Basic web server (Python, Node.js, or Docker)

### Quick Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/grovesdigital/POS-GEN-Lead-Finder.git
   cd POS-GEN-Lead-Finder
   ```

2. **Set Up Google Cloud APIs**
   - Create a Google Cloud Project
   - Enable Places API (New) and Maps JavaScript API
   - Create an API key with proper restrictions

3. **Start Local Server**
   ```bash
   # Python 3
   cd google-places-tool
   python3 -m http.server 8000
   
   # Or Node.js
   npx http-server google-places-tool -p 8000
   
   # Or Docker
   docker-compose up -d
   ```

4. **Access the Application**
   - Open `http://localhost:8000`
   - Complete the guided setup with your API key
   - Start finding leads!

## 💼 Use Cases

### For Marketing Agencies
- **Local Campaign Planning** - Research competitors and prospects in target areas
- **Client Prospecting** - Find businesses that could benefit from your services
- **Market Analysis** - Understand business density and competition in specific locations

### For Sales Teams
- **Territory Planning** - Map out prospects within sales territories
- **Lead Qualification** - Research business ratings, reviews, and contact information
- **Campaign Targeting** - Build targeted outreach lists by business type and location

### For Business Development
- **Partnership Opportunities** - Find complementary businesses for partnerships
- **Market Entry Research** - Analyze business landscapes in new markets
- **Competitive Intelligence** - Monitor competitor locations and expansion

## 🏗️ Project Structure

```
POS-GEN-Lead-Finder/
├── google-places-tool/          # Main application directory
│   ├── index.html              # Single-page application interface
│   ├── app.js                  # Core application logic (2,600+ lines)
│   ├── styles.css              # Modern, responsive styling
│   ├── results.html            # Legacy results page
│   ├── Dockerfile              # Container configuration
│   ├── docker-compose.yml      # Docker Compose setup
│   └── README.md               # Detailed technical documentation
├── UI_MODERNIZATION_PLAN.md    # Development roadmap
└── README.md                   # This file
```

## 🎨 User Interface

The application features a modern, professional interface with:
- **Dual-Mode Interface** - Toggle between Quick Search and Campaign Builder
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Interactive Maps** - Google Maps integration with custom markers and info windows
- **Progressive Disclosure** - Clean, step-by-step workflows
- **Real-Time Updates** - Live search results and map updates

## 🔧 Advanced Features

### Campaign Builder Workflow
1. **Campaign Setup** - Define campaign name, theme, location, and target radius
2. **Business Selection** - Choose from recommended or advanced business types
3. **Automated Discovery** - Find top businesses per industry based on ratings and distance
4. **Asset Generation** - Export structured data ready for automated content creation

### Data Export Options
- **JSON Export** - Structured data with complete business information
- **CSV Export** - Spreadsheet-compatible format for analysis
- **Campaign Assets** - Ready-to-use data for ad generation systems

### API Integration
- **Google Places API (New)** - Latest and most comprehensive business data
- **Google Maps JavaScript API** - Interactive map visualization
- **Places Autocomplete** - Smart location search with suggestions

## 🔐 Security & Privacy

- **Local Storage Only** - No data sent to external servers (except Google APIs)
- **Encrypted API Keys** - Your Google API key is encrypted before local storage
- **CORS Compliant** - Includes solutions for production deployment
- **Privacy by Design** - Minimal data collection, maximum user control

## 📊 Technical Specifications

### Supported Business Types
- 100+ official Google Places API business types
- Categories include: Restaurants, Retail, Services, Healthcare, Professional Services, Entertainment, and more
- Custom groupings for campaign targeting

### Search Capabilities
- **Radius Control** - 100m to 5km search radius
- **Multi-Type Search** - Search multiple business types simultaneously
- **Real-Time Results** - Live map updates and result filtering
- **Batch Processing** - Handle multiple searches efficiently

### Performance Features
- **Efficient API Usage** - Optimized requests to minimize costs
- **Caching Strategy** - Smart caching while respecting API terms
- **Progressive Loading** - Fast initial load with on-demand features
- **Mobile Optimized** - Responsive design for all devices

## 🚀 Production Deployment

The application includes Docker configuration for easy deployment:

```bash
docker build -t pos-gen-lead-finder .
docker run -d -p 8080:80 pos-gen-lead-finder
```

For production environments, consider:
- Setting up a backend proxy for CORS handling
- Implementing rate limiting and API key management
- Using HTTPS with proper SSL certificates
- Monitoring API usage and costs

## 📈 Roadmap

See `UI_MODERNIZATION_PLAN.md` for detailed development plans including:
- Enhanced campaign management features
- Automated content generation integration
- Advanced analytics and reporting
- CRM system integrations
- Multi-user and team collaboration features

## 🤝 Contributing

This is a professional tool developed for lead generation and marketing purposes. The codebase is well-structured and documented for easy modification and extension.

## 📄 License

Professional use tool for lead generation and marketing. Must comply with Google Maps Platform Terms of Service.

## 🎯 About POS-GEN

POS-GEN specializes in location-based marketing and lead generation solutions. This tool represents our commitment to providing powerful, user-friendly tools for modern marketing professionals.

---

**Ready to transform your lead generation process?** Get started with POS-GEN Lead Finder today! 🚀
