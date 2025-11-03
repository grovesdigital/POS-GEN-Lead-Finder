# POS-Gen Lead Finder: API Integration Plan

## Objective
Integrate campaign and asset content export from POS-Gen Lead Finder to the backend API endpoints for lead, campaign, and asset import.

---

## 1. API Endpoints
- **Lead Import:** `POST /api/gmb/import`
- **Campaign Import:** `POST /api/campaigns`
- **Asset Import:** `POST /api/assets/import`

---

## 1a. Authentication (Supabase Password Grant)

For service-to-service authentication, obtain a JWT using Supabase Auth password grant:

**Request:**
```
POST https://<project>.supabase.co/auth/v1/token?grant_type=password
Content-Type: application/json

{
  "email": "service-user@example.com",
  "password": "your-service-password"
}
```

**Response:**
```
{
  "access_token": "<JWT>",
  "refresh_token": "...",
  "expires_in": 3600,
  "token_type": "bearer"
}
```

Use the `access_token` in the `Authorization: Bearer <JWT>` header for all API requests.

Automate token retrieval and refresh as needed for ingestion tools. Store credentials securely.

---

## 2. Data Flow Overview
1. **User searches for businesses and generates campaign content.**
2. **App assembles payloads for each endpoint:**
   - Lead records (businesses)
   - Campaign metadata and copy
   - Asset manifests (images, creative, metadata)
3. **App sends payloads to backend endpoints via HTTP POST.**
4. **API responds with status and IDs for tracking.**

---

## 3. Payload Structure
### Lead Import (`/api/gmb/import`)
```json
{
  "batchId": "leadgen_batch_YYYY_MM_DD_001",
  "executionMode": "staging",
  "businesses": [
    {
      "id": "leadgen-12345",
      "displayName": "Sample Dental Studio",
      "primaryType": "dentist",
      "types": ["health", "dentist", "point_of_interest"],
      "formattedAddress": "456 Elm St, Springfield, IL 62704",
      "rating": 4.7,
      "userRatingCount": 89,
      "googleMapsUri": "https://maps.google.com/?cid=1234567890",
      "photos": [
        { "name": "leadgen-12345/logo", "url": "..." },
        { "name": "leadgen-12345/hero", "url": "..." }
      ],
      "leadSource": "pos-gen-lead-generator",
      "notes": ""
    }
  ]
}
```

### Campaign Import (`/api/campaigns`)
```json
{
  "name": "Sample Dental Studio - Winter Whitening",
  "description": "Lead-gen campaign imported from POS-Gen Lead Finder",
  "status": "draft",
  "metadata": {
    "source": "pos-gen-lead-generator",
    "batchId": "leadgen_batch_YYYY_MM_DD_001",
    "ai": {
      "manifestId": "business-promo-01",
      "templateVersion": "1.0.0",
      "generatedAt": "2025-11-03T14:05:12Z",
      "model": "leadgen-manual",
      "reasoning": "Copy supplied by lead-gen specialist."
    }
  }
}
```

### Asset Import (`/api/assets/import`)
```json
{
  "campaignId": "uuid-from-campaign-response",
  "assets": [
    {
      "title": "Sample Dental Studio Display",
      "description": "Winter whitening promotion asset",
      "template_id": "business-promo-01",
      "template_data": {
        "headline": "Whitening Sale This Winter",
        "subline1": "Free consultation with every whitening package",
        "subline2": "Sample Dental Studio<br>456 Elm St<br>Call: 555-867-5309",
        "cta": "BOOK TODAY",
        "header_image": "...",
        "sub_image": "..."
      },
      "status": "draft",
      "metadata": {
        "source": "pos-gen-lead-generator",
        "ai": {
          "selectedPhoto": "...",
          "alternates": [],
          "reasoning": "Lead-gen supplied hero image already validated."
        },
        "externalRefs": {
          "leadId": "leadgen-12345"
        }
      }
    }
  ]
}
```

---

## 4. Implementation Steps

## Supabase Auth Integration Checklist

1. [ ] Store Supabase anon key, service user email, and password securely (e.g., environment variables)
2. [ ] Implement Supabase login logic to obtain JWT (access_token) via password grant
3. [ ] Store and manage JWT for API requests
4. [ ] Attach JWT to Authorization header for all outgoing API requests
5. [ ] Handle token expiration and refresh if needed
6. [ ] Add error handling for login and API failures
7. [ ] Test end-to-end: login, get JWT, send authenticated API request

---

## Progress

### 1. Store credentials securely
- Use environment variables for anon key, email, and password
- Example: `.env` file or process.env in Node.js

### 2. Implement Supabase login logic
- Use `fetch` or `axios` to POST to Supabase Auth endpoint
- Parse response to extract `access_token`

### 3. Store and manage JWT
- Save token in memory or a secure store
- Check expiration before each API call

### 4. Attach JWT to API requests
- Add `Authorization: Bearer <access_token>` header

### 5. Handle token expiration/refresh
- Use `refresh_token` if available
- Re-login if token expired

### 6. Error handling
- Log errors and provide user feedback

### 7. Test end-to-end
- Confirm login and authenticated API request work

---

**Working through checklist:**
1. Credentials can be stored in a `.env` file or as environment variables in your deployment environment.
2. Next, implement the login logic in your backend or ingestion tool (Node.js recommended for server-side).
3. Once login is working, update your API request logic to use the JWT.
4. Add error handling and test the full flow.

---

## 5. Testing Plan
- Use dummy data and real image URLs to test payload structure.
- Validate API responses for each endpoint.
- Confirm imported data appears in backend/admin dashboard.
- Adjust payloads as needed based on API feedback.

---

## 6. Future Enhancements
- Support batch processing for volume imports.
- Add error handling and reporting.
- Allow user to edit notes and metadata before export.
- Automate asset/campaign creation from search results.

---

## 7. References
- [API Documentation](https://pos-gen.groves.digital/docs)
- [Google Places API](https://developers.google.com/maps/documentation/places/web-service/overview)

---

**Last updated:** 2025-11-03
