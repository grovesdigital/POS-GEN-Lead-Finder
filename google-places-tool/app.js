// ========================================
// GLOBAL STATE
// ========================================
const APP_STATE = {
    apiKey: null,
    map: null,
    markers: [],
    autocomplete: null,
    selectedLocation: null,
    selectedTypes: [],
    radius: 5000,
    searchResults: [],
    infoWindows: [],
    radiusCircle: null,
    // Campaign state
    currentView: 'quickSearch', // 'quickSearch' or 'campaignBuilder'
    campaign: {
        name: '',
        theme: '',
        description: '',
        location: null,
        radius: 5000,
        businessesPerType: 3, // Number of businesses to suggest per industry
        selectedTypes: [],
        results: {}, // Grouped by business type (top N for display)
        allResults: {}, // All businesses by type (for replacement)
        selectedBusinesses: [], // Array of selected business objects
        currentStep: 1,
        stepsExpanded: {
            1: true,
            2: false,
            3: false
        }
    },
    campaignAutocomplete: null
};

// Official Google Places API (New) place types
const PLACE_TYPES = [
    { value: 'accounting', label: 'Accounting' },
    { value: 'airport', label: 'Airport' },
    { value: 'amusement_park', label: 'Amusement Park' },
    { value: 'aquarium', label: 'Aquarium' },
    { value: 'art_gallery', label: 'Art Gallery' },
    { value: 'atm', label: 'ATM' },
    { value: 'bakery', label: 'Bakery' },
    { value: 'bank', label: 'Bank' },
    { value: 'bar', label: 'Bar' },
    { value: 'beauty_salon', label: 'Beauty Salon' },
    { value: 'bicycle_store', label: 'Bicycle Store' },
    { value: 'book_store', label: 'Book Store' },
    { value: 'bowling_alley', label: 'Bowling Alley' },
    { value: 'bus_station', label: 'Bus Station' },
    { value: 'cafe', label: 'Cafe' },
    { value: 'campground', label: 'Campground' },
    { value: 'car_dealer', label: 'Car Dealer' },
    { value: 'car_rental', label: 'Car Rental' },
    { value: 'car_repair', label: 'Car Repair' },
    { value: 'car_wash', label: 'Car Wash' },
    { value: 'casino', label: 'Casino' },
    { value: 'cemetery', label: 'Cemetery' },
    { value: 'church', label: 'Church' },
    { value: 'city_hall', label: 'City Hall' },
    { value: 'clothing_store', label: 'Clothing Store' },
    { value: 'convenience_store', label: 'Convenience Store' },
    { value: 'courthouse', label: 'Courthouse' },
    { value: 'dentist', label: 'Dentist' },
    { value: 'department_store', label: 'Department Store' },
    { value: 'doctor', label: 'Doctor' },
    { value: 'drugstore', label: 'Drugstore' },
    { value: 'electrician', label: 'Electrician' },
    { value: 'electronics_store', label: 'Electronics Store' },
    { value: 'embassy', label: 'Embassy' },
    { value: 'fire_station', label: 'Fire Station' },
    { value: 'florist', label: 'Florist' },
    { value: 'funeral_home', label: 'Funeral Home' },
    { value: 'furniture_store', label: 'Furniture Store' },
    { value: 'gas_station', label: 'Gas Station' },
    { value: 'gym', label: 'Gym' },
    { value: 'hair_care', label: 'Hair Care' },
    { value: 'hardware_store', label: 'Hardware Store' },
    { value: 'hindu_temple', label: 'Hindu Temple' },
    { value: 'home_goods_store', label: 'Home Goods Store' },
    { value: 'hospital', label: 'Hospital' },
    { value: 'insurance_agency', label: 'Insurance Agency' },
    { value: 'jewelry_store', label: 'Jewelry Store' },
    { value: 'laundry', label: 'Laundry' },
    { value: 'lawyer', label: 'Lawyer' },
    { value: 'library', label: 'Library' },
    { value: 'light_rail_station', label: 'Light Rail Station' },
    { value: 'liquor_store', label: 'Liquor Store' },
    { value: 'local_government_office', label: 'Local Government Office' },
    { value: 'locksmith', label: 'Locksmith' },
    { value: 'lodging', label: 'Lodging' },
    { value: 'meal_delivery', label: 'Meal Delivery' },
    { value: 'meal_takeaway', label: 'Meal Takeaway' },
    { value: 'mosque', label: 'Mosque' },
    { value: 'movie_rental', label: 'Movie Rental' },
    { value: 'movie_theater', label: 'Movie Theater' },
    { value: 'moving_company', label: 'Moving Company' },
    { value: 'museum', label: 'Museum' },
    { value: 'night_club', label: 'Night Club' },
    { value: 'painter', label: 'Painter' },
    { value: 'park', label: 'Park' },
    { value: 'parking', label: 'Parking' },
    { value: 'pet_store', label: 'Pet Store' },
    { value: 'pharmacy', label: 'Pharmacy' },
    { value: 'physiotherapist', label: 'Physiotherapist' },
    { value: 'plumber', label: 'Plumber' },
    { value: 'police', label: 'Police' },
    { value: 'post_office', label: 'Post Office' },
    { value: 'primary_school', label: 'Primary School' },
    { value: 'real_estate_agency', label: 'Real Estate Agency' },
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'roofing_contractor', label: 'Roofing Contractor' },
    { value: 'rv_park', label: 'RV Park' },
    { value: 'school', label: 'School' },
    { value: 'secondary_school', label: 'Secondary School' },
    { value: 'shoe_store', label: 'Shoe Store' },
    { value: 'shopping_mall', label: 'Shopping Mall' },
    { value: 'spa', label: 'Spa' },
    { value: 'stadium', label: 'Stadium' },
    { value: 'storage', label: 'Storage' },
    { value: 'store', label: 'Store' },
    { value: 'subway_station', label: 'Subway Station' },
    { value: 'supermarket', label: 'Supermarket' },
    { value: 'synagogue', label: 'Synagogue' },
    { value: 'taxi_stand', label: 'Taxi Stand' },
    { value: 'tourist_attraction', label: 'Tourist Attraction' },
    { value: 'train_station', label: 'Train Station' },
    { value: 'transit_station', label: 'Transit Station' },
    { value: 'travel_agency', label: 'Travel Agency' },
    { value: 'university', label: 'University' },
    { value: 'veterinary_care', label: 'Veterinary Care' },
    { value: 'zoo', label: 'Zoo' }
];

// Preselected business types for campaigns
const CAMPAIGN_BUSINESS_TYPES = [
    { value: 'beauty_salon', label: 'Beauty Salon' },
    { value: 'book_store', label: 'Book Store' },
    { value: 'cafe', label: 'Cafe' },
    { value: 'florist', label: 'Florist' },
    { value: 'real_estate_agency', label: 'Real Estate Agency' },
    { value: 'restaurant', label: 'Restaurant' }
];

function getTypeLabel(typeValue) {
    const campaignMatch = CAMPAIGN_BUSINESS_TYPES.find(t => t.value === typeValue);
    if (campaignMatch) {
        return campaignMatch.label;
    }

    const placeMatch = PLACE_TYPES.find(t => t.value === typeValue);
    if (placeMatch) {
        return placeMatch.label;
    }

    return typeValue.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

// ========================================
// ENCRYPTION UTILITIES
// ========================================
const ENCRYPTION_KEY = 'gp-query-tool-v1'; // In production, use a more secure method

function encryptData(data) {
    try {
        return btoa(encodeURIComponent(data + '|' + ENCRYPTION_KEY));
    } catch (e) {
        console.error('Encryption error:', e);
        return null;
    }
}

function decryptData(encrypted) {
    try {
        const decoded = decodeURIComponent(atob(encrypted));
        const [data, key] = decoded.split('|');
        if (key === ENCRYPTION_KEY) {
            return data;
        }
        return null;
    } catch (e) {
        console.error('Decryption error:', e);
        return null;
    }
}

// ========================================
// API KEY MANAGEMENT
// ========================================
function saveApiKey(apiKey) {
    const encrypted = encryptData(apiKey);
    if (encrypted) {
        localStorage.setItem('gp_api_key', encrypted);
        APP_STATE.apiKey = apiKey;
        return true;
    }
    return false;
}

function loadApiKey() {
    const encrypted = localStorage.getItem('gp_api_key');
    if (encrypted) {
        const apiKey = decryptData(encrypted);
        if (apiKey) {
            APP_STATE.apiKey = apiKey;
            return apiKey;
        }
    }
    return null;
}

function clearApiKey() {
    localStorage.removeItem('gp_api_key');
    APP_STATE.apiKey = null;
}

// ========================================
// GOOGLE MAPS INITIALIZATION
// ========================================
function loadGoogleMapsScript(apiKey) {
    return new Promise((resolve, reject) => {
        if (window.google && window.google.maps) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
        script.async = true;
        script.defer = true;

        window.initMap = function() {
            resolve();
        };

        script.onerror = () => reject(new Error('Failed to load Google Maps'));
        document.head.appendChild(script);
    });
}

function initializeMap() {
    const mapContainer = document.getElementById('map');
    const defaultCenter = { lat: 40.7128, lng: -74.0060 }; // New York City

    APP_STATE.map = new google.maps.Map(mapContainer, {
        center: defaultCenter,
        zoom: 12,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true
    });

    // Hide placeholder
    document.getElementById('mapPlaceholder').style.display = 'none';
}

function initializeAutocomplete() {
    const input = document.getElementById('locationSearch');

    APP_STATE.autocomplete = new google.maps.places.Autocomplete(input, {
        fields: ['formatted_address', 'geometry', 'name', 'place_id']
    });

    APP_STATE.autocomplete.addListener('place_changed', onPlaceSelected);
}

function onPlaceSelected() {
    const place = APP_STATE.autocomplete.getPlace();

    if (!place.geometry) {
        showError('searchError', 'No location found for this place');
        return;
    }

    APP_STATE.selectedLocation = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        name: place.name,
        address: place.formatted_address
    };

    // Update UI
    document.getElementById('selectedLocation').textContent =
        `✓ ${place.name || place.formatted_address}`;

    // Show hidden form elements
    showSearchParameters();

    // Center map on selected location with offset for open panel
    centerMapWithOffset(place.geometry.location);
    APP_STATE.map.setZoom(14);

    // Clear previous markers
    clearMarkers();

    // Add marker for selected location
    new google.maps.Marker({
        map: APP_STATE.map,
        position: place.geometry.location,
        title: place.name,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#667eea",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "#ffffff"
        }
    });

    // Update radius circle
    updateRadiusCircle();

    hideError('searchError');
}

// ========================================
// PROGRESSIVE DISCLOSURE
// ========================================
function showSearchParameters() {
    document.getElementById('radiusGroup').classList.add('visible');
    document.getElementById('businessTypesGroup').classList.add('visible');
}

// ========================================
// MAP CENTERING WITH OFFSET
// ========================================
function centerMapWithOffset(location) {
    const panel = document.querySelector('.floating-search-panel');
    const isPanelCollapsed = panel && panel.classList.contains('collapsed');

    if (!isPanelCollapsed && panel) {
        // Panel is open - offset the center
        // Panel width is 420px (or 380px on tablet, auto on mobile)
        const panelWidth = panel.offsetWidth;

        // Calculate offset: shift right by half the panel width
        const scale = Math.pow(2, APP_STATE.map.getZoom());
        const worldCoordinateCenter = APP_STATE.map.getProjection().fromLatLngToPoint(location);
        const pixelOffset = new google.maps.Point(
            (panelWidth / 2) / scale,
            0
        );

        const worldCoordinateNewCenter = new google.maps.Point(
            worldCoordinateCenter.x - pixelOffset.x,
            worldCoordinateCenter.y - pixelOffset.y
        );

        const newCenter = APP_STATE.map.getProjection().fromPointToLatLng(worldCoordinateNewCenter);
        APP_STATE.map.setCenter(newCenter);
    } else {
        // Panel is closed or doesn't exist - center normally
        APP_STATE.map.setCenter(location);
    }
}

// ========================================
// BUSINESS TYPES CHECKBOX LIST
// ========================================
function initializeBusinessTypesList() {
    const listContainer = document.getElementById('businessTypesList');
    const showMoreBtn = document.getElementById('showMoreTypesBtn');
    const showMoreText = document.getElementById('showMoreText');
    const showMoreIcon = document.getElementById('showMoreIcon');
    const selectedCountDiv = document.getElementById('selectedTypesCount');

    const INITIAL_VISIBLE_COUNT = 15;
    let isExpanded = false;

    // Populate checkbox list
    PLACE_TYPES.forEach((type, index) => {
        const item = document.createElement('div');
        item.className = 'business-type-item';

        // Hide items after the first 15
        if (index >= INITIAL_VISIBLE_COUNT) {
            item.classList.add('hidden');
        }

        item.innerHTML = `
            <input type="checkbox" id="type_${type.value}" value="${type.value}">
            <label for="type_${type.value}">${type.label}</label>
        `;

        listContainer.appendChild(item);

        // Add change listener
        const checkbox = item.querySelector('input');
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                APP_STATE.selectedTypes.push(type.value);
            } else {
                APP_STATE.selectedTypes = APP_STATE.selectedTypes.filter(t => t !== type.value);
            }
            updateSelectedCount();
        });
    });

    // Show More / Show Less toggle
    showMoreBtn.addEventListener('click', () => {
        isExpanded = !isExpanded;
        const items = listContainer.querySelectorAll('.business-type-item');

        items.forEach((item, index) => {
            if (index >= INITIAL_VISIBLE_COUNT) {
                if (isExpanded) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            }
        });

        // Update button
        if (isExpanded) {
            showMoreText.textContent = 'Show Less';
            showMoreBtn.classList.add('expanded');
        } else {
            showMoreText.textContent = 'Show All Types';
            showMoreBtn.classList.remove('expanded');
        }
    });
}

function updateSelectedCount() {
    const selectedCountDiv = document.getElementById('selectedTypesCount');
    const count = APP_STATE.selectedTypes.length;

    if (count === 0) {
        selectedCountDiv.classList.remove('visible');
        selectedCountDiv.textContent = '';
    } else {
        selectedCountDiv.classList.add('visible');
        selectedCountDiv.textContent = `${count} type${count !== 1 ? 's' : ''} selected`;
    }
}

// ========================================
// RADIUS CIRCLE VISUALIZATION
// ========================================
function updateRadiusCircle() {
    // Remove existing circle
    if (APP_STATE.radiusCircle) {
        APP_STATE.radiusCircle.setMap(null);
    }

    // Only draw circle if location is selected
    if (!APP_STATE.selectedLocation) {
        return;
    }

    // Create new circle
    APP_STATE.radiusCircle = new google.maps.Circle({
        map: APP_STATE.map,
        center: {
            lat: APP_STATE.selectedLocation.lat,
            lng: APP_STATE.selectedLocation.lng
        },
        radius: APP_STATE.radius,
        strokeColor: '#667eea',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#667eea',
        fillOpacity: 0.15
    });
}

// ========================================
// DISCRETE RADIUS VALUES
// ========================================
const RADIUS_VALUES = [100, 250, 500, 750, 1000, 2000, 3000, 4000, 5000];

function getRadiusFromSlider(sliderValue) {
    const index = parseInt(sliderValue);
    return RADIUS_VALUES[index] || 1000;
}

function getSliderValueFromRadius(radius) {
    if (typeof radius !== 'number') {
        return 4;
    }

    let closestIndex = 0;
    let smallestDiff = Infinity;

    RADIUS_VALUES.forEach((value, index) => {
        const diff = Math.abs(value - radius);
        if (diff < smallestDiff) {
            smallestDiff = diff;
            closestIndex = index;
        }
    });

    return closestIndex;
}

function formatRadiusDisplay(meters) {
    if (meters < 1000) {
        return `${meters}m`;
    } else {
        return `${meters / 1000}km`;
    }
}

// ========================================
// PANEL TOGGLE FUNCTIONALITY
// ========================================
function initializePanelToggle() {
    const panel = document.querySelector('.floating-search-panel');
    const toggleBtn = document.getElementById('togglePanelBtn');

    if (toggleBtn && panel) {
        toggleBtn.addEventListener('click', () => {
            panel.classList.toggle('collapsed');

            // Re-center map with new offset when toggling
            if (APP_STATE.selectedLocation) {
                const location = new google.maps.LatLng(
                    APP_STATE.selectedLocation.lat,
                    APP_STATE.selectedLocation.lng
                );
                setTimeout(() => {
                    centerMapWithOffset(location);
                }, 300); // Wait for panel animation to complete
            }
        });
    }
}

// ========================================
// SEARCH FUNCTIONALITY
// ========================================
async function searchPlaces() {
    if (!APP_STATE.selectedLocation) {
        showError('searchError', 'Please select a location first');
        return;
    }

    if (APP_STATE.selectedTypes.length === 0) {
        showError('searchError', 'Please select at least one business type');
        return;
    }

    showStatus('searchStatus', 'Searching for places...');
    clearMarkers();

    try {
        // For Google Places API (New), we need to make a POST request
        // Note: Direct browser requests will face CORS issues
        // This is a demonstration of the API structure

        const results = [];

        for (const type of APP_STATE.selectedTypes) {
            const response = await fetchNearbyPlaces(
                APP_STATE.selectedLocation.lat,
                APP_STATE.selectedLocation.lng,
                APP_STATE.radius,
                type
            );

            if (response && response.places) {
                results.push(...response.places);
            }
        }

        APP_STATE.searchResults = results;
        displayMarkersOnMap(results);
        updateResultsCount(results.length);

        if (results.length > 0) {
            document.getElementById('viewResultsBtn').disabled = false;
        }

        hideStatus('searchStatus');
        hideError('searchError');

    } catch (error) {
        console.error('Search error:', error);
        showError('searchError', `Search failed: ${error.message}`);
        hideStatus('searchStatus');
    }
}

async function fetchNearbyPlaces(lat, lng, radius, type) {
    // Google Places API (New) endpoint
    const url = 'https://places.googleapis.com/v1/places:searchNearby';

    const requestBody = {
        includedTypes: [type],
        maxResultCount: 20,
        locationRestriction: {
            circle: {
                center: {
                    latitude: lat,
                    longitude: lng
                },
                radius: radius
            }
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': APP_STATE.apiKey,
                'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.types,places.photos,places.businessStatus,places.googleMapsUri,places.id'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        if (data) {
            data.places = Array.isArray(data.places)
                ? data.places.filter(place => Array.isArray(place.photos) && place.photos.length > 0)
                : [];
        }
        return data;

    } catch (error) {
        // CORS error expected - show helpful message
        if (error.message.includes('CORS') || error.name === 'TypeError') {
            throw new Error('CORS blocked. Please use a proxy server or backend. See README for setup.');
        }
        throw error;
    }
}

function displayMarkersOnMap(places) {
    clearMarkers();

    places.forEach((place, index) => {
        const position = {
            lat: place.location?.latitude || 0,
            lng: place.location?.longitude || 0
        };
        const primaryPhoto = Array.isArray(place.photos) && place.photos.length > 0 ? place.photos[0] : null;
        const photoUrl = primaryPhoto && APP_STATE.apiKey
            ? `https://places.googleapis.com/v1/${primaryPhoto.name}/media?key=${APP_STATE.apiKey}&maxWidthPx=320&maxHeightPx=220`
            : null;
        const safeId = (place.id || `place-${index}`).replace(/[^a-zA-Z0-9_-]/g, '_');
        const infoButtonId = `info-window-generate-${safeId}`;

        const marker = new google.maps.Marker({
            map: APP_STATE.map,
            position: position,
            title: place.displayName?.text || 'Unknown',
            animation: google.maps.Animation.DROP,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: "#f59e0b",
                fillOpacity: 0.9,
                strokeWeight: 2,
                strokeColor: "#ffffff"
            }
        });

        // Info window
        const hasPhoto = Boolean(photoUrl);
        const infoWindowContent = `
            <div style="padding: 8px; max-width: 340px;">
                <div style="display: flex; gap: 12px; align-items: flex-start;">
                    ${hasPhoto ? `
                        <div style="flex: 0 0 120px; height: 120px; border-radius: 16px; overflow: hidden; box-shadow: 0 6px 20px rgba(15, 23, 42, 0.15);">
                            <img src="${photoUrl}"
                                 alt="${(place.displayName?.text || 'Location photo').replace(/"/g, '&quot;')}"
                                 style="width: 100%; height: 100%; object-fit: cover; display: block;">
                        </div>
                    ` : ''}
                    <div style="flex: 1; min-width: 0;">
                        <div style="font-size: 1rem; font-weight: 700; margin-bottom: 6px;">${place.displayName?.text || 'Unknown'}</div>
                        <div style="color: #666; font-size: 0.85rem; margin-bottom: 8px;">${place.formattedAddress || 'No address'}</div>
                        ${place.rating ? `<div style="color: #f59e0b; font-weight: 600; font-size: 0.9rem; margin-bottom: 10px;">★ ${place.rating}</div>` : ''}
                        <button id="${infoButtonId}"
                            style="
                                display: inline-flex;
                                align-items: center;
                                gap: 6px;
                                background: linear-gradient(135deg, #667eea, #764ba2);
                                color: #fff;
                                border: none;
                                border-radius: 999px;
                                padding: 6px 14px;
                                font-size: 0.8rem;
                                font-weight: 600;
                                cursor: pointer;
                                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.35);
                            ">
                            ✨ Generate Assets
                        </button>
                    </div>
                </div>
            </div>
        `;

        const infoWindow = new google.maps.InfoWindow({ content: infoWindowContent });

        marker.addListener('click', () => {
            // Close all info windows
            APP_STATE.infoWindows.forEach(iw => iw.close());
            infoWindow.open(APP_STATE.map, marker);
            google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
                const btn = document.getElementById(infoButtonId);
                if (btn) {
                    btn.addEventListener('click', () => generateAdData(place));
                }
            });
        });

        APP_STATE.markers.push(marker);
        APP_STATE.infoWindows.push(infoWindow);
    });

    // Fit bounds to show all markers
    if (places.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        APP_STATE.markers.forEach(marker => bounds.extend(marker.getPosition()));
        APP_STATE.map.fitBounds(bounds);
    }
}

function clearMarkers() {
    APP_STATE.markers.forEach(marker => marker.setMap(null));
    APP_STATE.markers = [];
    APP_STATE.infoWindows.forEach(iw => iw.close());
    APP_STATE.infoWindows = [];
}

function updateResultsCount(count) {
    document.getElementById('resultsCount').textContent = `${count} result${count !== 1 ? 's' : ''}`;
}

// ========================================
// RESULTS PAGE
// ========================================
function showResultsPage() {
    document.getElementById('mainApp').style.display = 'none';
    document.getElementById('resultsPage').style.display = 'block';

    // Setup sorting and filtering event listeners
    setupResultsControls();

    renderResults();
}

function showMainApp() {
    document.getElementById('resultsPage').style.display = 'none';
    document.getElementById('mainApp').style.display = 'flex';
}

function setupResultsControls() {
    // Sort dropdown
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect && !sortSelect.hasAttribute('data-listener')) {
        sortSelect.setAttribute('data-listener', 'true');
        sortSelect.addEventListener('change', renderResults);
    }

    // Filter checkboxes
    const filterOpenNow = document.getElementById('filterOpenNow');
    if (filterOpenNow && !filterOpenNow.hasAttribute('data-listener')) {
        filterOpenNow.setAttribute('data-listener', 'true');
        filterOpenNow.addEventListener('change', renderResults);
    }

    const filterMinRating = document.getElementById('filterMinRating');
    if (filterMinRating && !filterMinRating.hasAttribute('data-listener')) {
        filterMinRating.setAttribute('data-listener', 'true');
        filterMinRating.addEventListener('change', renderResults);
    }
}

// Calculate distance between two points using Haversine formula (in meters)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

// Calculate and cache distances for all results
function calculateDistances(places) {
    if (!APP_STATE.selectedLocation) return places;

    return places.map(place => {
        if (!place._distance && place.location?.latitude && place.location?.longitude) {
            place._distance = calculateDistance(
                APP_STATE.selectedLocation.lat,
                APP_STATE.selectedLocation.lng,
                place.location.latitude,
                place.location.longitude
            );
        }
        return place;
    });
}

// Format distance for display
function formatDistance(meters) {
    if (meters < 1000) {
        return `${Math.round(meters)}m`;
    } else {
        return `${(meters / 1000).toFixed(1)}km`;
    }
}

// Sort results based on selected criteria
function sortResults(places, sortBy) {
    const sorted = [...places];

    switch (sortBy) {
        case 'distance':
            sorted.sort((a, b) => (a._distance || 0) - (b._distance || 0));
            break;
        case 'rating':
            sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
        case 'reviewCount':
            sorted.sort((a, b) => (b.userRatingCount || 0) - (a.userRatingCount || 0));
            break;
        case 'name':
            sorted.sort((a, b) => {
                const nameA = (a.displayName?.text || '').toLowerCase();
                const nameB = (b.displayName?.text || '').toLowerCase();
                return nameA.localeCompare(nameB);
            });
            break;
        case 'status':
            sorted.sort((a, b) => {
                const statusA = a.businessStatus || 'UNKNOWN';
                const statusB = b.businessStatus || 'UNKNOWN';
                // OPERATIONAL first, then others
                if (statusA === 'OPERATIONAL' && statusB !== 'OPERATIONAL') return -1;
                if (statusA !== 'OPERATIONAL' && statusB === 'OPERATIONAL') return 1;
                return 0;
            });
            break;
        default:
            break;
    }

    return sorted;
}

// Filter results based on selected criteria
function filterResults(places) {
    let filtered = [...places];

    const filterOpenNow = document.getElementById('filterOpenNow')?.checked;
    const filterMinRating = document.getElementById('filterMinRating')?.checked;

    if (filterOpenNow) {
        filtered = filtered.filter(place => {
            // Note: The new API might not provide opening_hours in the current field mask
            // This would need to be added to the field mask in fetchNearbyPlaces
            return place.currentOpeningHours?.openNow === true;
        });
    }

    if (filterMinRating) {
        filtered = filtered.filter(place => {
            return place.rating && place.rating >= 4.0;
        });
    }

    return filtered;
}

function renderResults() {
    const grid = document.getElementById('resultsGrid');
    const noResults = document.getElementById('noResults');
    const resultsInfo = document.getElementById('resultsInfo');

    if (APP_STATE.searchResults.length === 0) {
        grid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }

    // Calculate distances for all places
    calculateDistances(APP_STATE.searchResults);

    // Get sort criteria
    const sortBy = document.getElementById('sortSelect')?.value || 'distance';

    // Apply sorting
    let displayResults = sortResults(APP_STATE.searchResults, sortBy);

    // Apply filtering
    displayResults = filterResults(displayResults);

    // Update UI
    if (displayResults.length === 0) {
        grid.style.display = 'none';
        noResults.style.display = 'block';
        document.getElementById('noResults').querySelector('h3').textContent = 'No Results Match Filters';
        document.getElementById('noResults').querySelector('p').textContent = 'Try adjusting your filters or search parameters';
        return;
    }

    grid.style.display = 'grid';
    noResults.style.display = 'none';
    grid.innerHTML = '';

    const totalResults = APP_STATE.searchResults.length;
    const filteredResults = displayResults.length;
    const locationName = APP_STATE.selectedLocation?.name || APP_STATE.selectedLocation?.address || 'your location';

    if (filteredResults < totalResults) {
        resultsInfo.textContent = `Showing ${filteredResults} of ${totalResults} places near ${locationName}`;
    } else {
        resultsInfo.textContent = `Found ${totalResults} places near ${locationName}`;
    }

    displayResults.forEach(place => {
        const card = createResultCard(place);
        grid.appendChild(card);
    });
}

function createResultCard(place) {
    const card = document.createElement('div');
    card.className = 'result-card';

    const displayName = place.displayName?.text || 'Unknown';
    const address = place.formattedAddress || 'No address available';
    const rating = place.rating || 'N/A';
    const reviewCount = place.userRatingCount || 0;
    const types = place.types || [];
    const googleMapsUri = place.googleMapsUri || '#';

    // Photo URL
    let photoHtml = '<div class="result-card-image"></div>';
    if (place.photos && place.photos.length > 0) {
        const photoName = place.photos[0].name;
        const photoUrl = `https://places.googleapis.com/v1/${photoName}/media?key=${APP_STATE.apiKey}&maxHeightPx=400&maxWidthPx=400`;
        photoHtml = `<img src="${photoUrl}" alt="${displayName}" class="result-card-image" />`;
    }

    // Types badges
    const typesBadges = types.slice(0, 3).map(type =>
        `<span class="type-badge">${type.replace(/_/g, ' ')}</span>`
    ).join('');

    // Distance badge
    const distanceBadge = place._distance
        ? `<div class="distance-badge">📍 ${formatDistance(place._distance)}</div>`
        : '';

    card.innerHTML = `
        ${photoHtml}
        ${distanceBadge}
        <div class="result-card-content">
            <h3 class="result-card-title">${displayName}</h3>
            <div class="result-card-address">
                <span>📍</span>
                <span>${address}</span>
            </div>
            <div class="result-card-meta">
                <div class="meta-item">
                    <span class="rating-stars">★</span>
                    <span>${rating}</span>
                </div>
                <div class="meta-item">
                    <span>📝</span>
                    <span>${reviewCount} reviews</span>
                </div>
            </div>
            ${typesBadges ? `<div class="result-card-types">${typesBadges}</div>` : ''}
            <div class="result-card-footer">
                <div class="result-card-actions">
                    <a href="${googleMapsUri}" target="_blank" class="result-card-link">
                        View on Google Maps →
                    </a>
                    <div class="result-card-buttons">
                        <button class="btn-generate-ad" data-place-index="${APP_STATE.searchResults.indexOf(place)}">
                            ✨ Generate Ad
                        </button>
                        <button class="btn-create-campaign">
                            🎯 Create Campaign
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add event listener for Generate Ad button
    const generateAdBtn = card.querySelector('.btn-generate-ad');
    generateAdBtn.addEventListener('click', () => {
        generateAdData(place);
    });

    const createCampaignBtn = card.querySelector('.btn-create-campaign');
    createCampaignBtn.addEventListener('click', () => {
        createCampaignFromSearchResults();
    });

    return card;
}

// ========================================
// GENERATE AD DATA
// ========================================
function generateAdData(place) {
    // Extract and structure the business data for ad generation
    const adData = {
        business: {
            name: place.displayName?.text || 'Unknown',
            address: place.formattedAddress || 'No address available',
            location: {
                latitude: place.location?.latitude || null,
                longitude: place.location?.longitude || null
            },
            rating: place.rating || null,
            reviewCount: place.userRatingCount || 0,
            types: place.types || [],
            businessStatus: place.businessStatus || 'UNKNOWN'
        },
        links: {
            googleMapsUri: place.googleMapsUri || null,
            placeId: place.id || null
        },
        photos: place.photos ? place.photos.map(photo => ({
            name: photo.name,
            url: `https://places.googleapis.com/v1/${photo.name}/media?key=${APP_STATE.apiKey}&maxHeightPx=400&maxWidthPx=400`
        })) : [],
        searchContext: {
            searchLocation: APP_STATE.selectedLocation?.name || APP_STATE.selectedLocation?.address || null,
            searchRadius: APP_STATE.radius,
            searchTypes: APP_STATE.selectedTypes,
            timestamp: new Date().toISOString()
        },
        metadata: {
            toolVersion: '2.0',
            apiVersion: 'places-new',
            generatedBy: 'Google Places Query Tool'
        }
    };

    // Convert to pretty JSON
    const jsonString = JSON.stringify(adData, null, 2);

    // Open in new tab as formatted text
    const newWindow = window.open('', '_blank');
    if (newWindow) {
        newWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Ad Data - ${adData.business.name}</title>
                <style>
                    body {
                        font-family: 'Courier New', monospace;
                        background: #1e1e1e;
                        color: #d4d4d4;
                        padding: 20px;
                        margin: 0;
                    }
                    .header {
                        background: linear-gradient(135deg, #667eea, #764ba2);
                        color: white;
                        padding: 20px;
                        border-radius: 8px;
                        margin-bottom: 20px;
                    }
                    .header h1 {
                        margin: 0 0 10px 0;
                        font-size: 24px;
                    }
                    .header p {
                        margin: 0;
                        opacity: 0.9;
                    }
                    .json-container {
                        background: #252526;
                        padding: 20px;
                        border-radius: 8px;
                        overflow-x: auto;
                        border: 1px solid #3e3e42;
                    }
                    pre {
                        margin: 0;
                        white-space: pre-wrap;
                        word-wrap: break-word;
                    }
                    .actions {
                        margin-top: 20px;
                        display: flex;
                        gap: 10px;
                    }
                    button {
                        background: linear-gradient(135deg, #667eea, #764ba2);
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: 600;
                    }
                    button:hover {
                        opacity: 0.9;
                    }
                    .copy-success {
                        display: none;
                        color: #48bb78;
                        padding: 12px 24px;
                        align-items: center;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>✨ Ad Generation Data</h1>
                    <p><strong>${adData.business.name}</strong> - Ready for webhook submission</p>
                </div>
                <div class="json-container">
                    <pre id="json-content">${jsonString}</pre>
                </div>
                <div class="actions">
                    <button onclick="copyToClipboard()">📋 Copy JSON</button>
                    <button onclick="downloadJSON()">💾 Download JSON</button>
                    <div class="copy-success" id="copySuccess">✓ Copied to clipboard!</div>
                </div>
                <script>
                    const jsonData = ${jsonString};

                    function copyToClipboard() {
                        const jsonString = JSON.stringify(jsonData, null, 2);
                        navigator.clipboard.writeText(jsonString).then(() => {
                            const success = document.getElementById('copySuccess');
                            success.style.display = 'flex';
                            setTimeout(() => {
                                success.style.display = 'none';
                            }, 2000);
                        });
                    }

                    function downloadJSON() {
                        const jsonString = JSON.stringify(jsonData, null, 2);
                        const blob = new Blob([jsonString], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'ad-data-${adData.business.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.json';
                        a.click();
                        URL.revokeObjectURL(url);
                    }
                </script>
            </body>
            </html>
        `);
        newWindow.document.close();
    } else {
        // Fallback if popup is blocked
        alert('Popup blocked. Please allow popups for this site.\n\nJSON Data:\n' + jsonString);
    }
}

// ========================================
// CAMPAIGN CREATION FROM RESULTS
// ========================================
function createCampaignFromSearchResults() {
    prefillCampaignBuilderFromSearch();
    showMainApp();
    switchToCampaignBuilder();
}

function prefillCampaignBuilderFromSearch() {
    const location = APP_STATE.selectedLocation;

    if (location) {
        APP_STATE.campaign.location = {
            lat: location.lat,
            lng: location.lng,
            name: location.name,
            address: location.address
        };

        const locationInput = document.getElementById('campaignLocationSearch');
        if (locationInput) {
            locationInput.value = location.name || location.address || '';
        }

        const locationInfo = document.getElementById('campaignSelectedLocation');
        if (locationInfo) {
            const displayLabel = location.name || location.address || '';
            locationInfo.textContent = displayLabel ? `✓ ${displayLabel}` : '';
        }
    }

    ['campaignRadiusGroup', 'campaignBusinessesPerTypeGroup', 'campaignBusinessTypesGroup', 'campaignSearchBtnGroup'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = 'block';
        }
    });

    const radiusFromSearch = APP_STATE.radius;
    if (typeof radiusFromSearch === 'number') {
        const slider = document.getElementById('campaignRadiusSlider');
        const radiusValue = document.getElementById('campaignRadiusValue');
        const sliderIndex = getSliderValueFromRadius(radiusFromSearch);
        const resolvedRadius = getRadiusFromSlider(sliderIndex);

        APP_STATE.campaign.radius = resolvedRadius;

        if (slider) {
            slider.value = sliderIndex;
        }

        if (radiusValue) {
            radiusValue.textContent = formatRadiusDisplay(resolvedRadius);
        }
    }

    const businessesPerTypeInput = document.getElementById('campaignBusinessesPerType');
    if (businessesPerTypeInput) {
        const numericValue = parseInt(businessesPerTypeInput.value, 10);
        if (Number.isFinite(numericValue)) {
            APP_STATE.campaign.businessesPerType = numericValue;
        }
    }

    const businessTypeInputs = Array.from(document.querySelectorAll('#campaignBusinessTypesGroup input[type="checkbox"]'));
    const availableTypes = new Set(businessTypeInputs.map(cb => cb.value));
    const recommendedTypes = new Set(CAMPAIGN_BUSINESS_TYPES.map(type => type.value));

    let prefilledTypes = Array.isArray(APP_STATE.selectedTypes)
        ? APP_STATE.selectedTypes.filter(type => availableTypes.has(type))
        : [];

    if (prefilledTypes.length === 0 && businessTypeInputs.length > 0) {
        prefilledTypes = businessTypeInputs.filter(cb => cb.checked).map(cb => cb.value);
    }

    if (prefilledTypes.length === 0 && Array.isArray(APP_STATE.campaign.selectedTypes)) {
        prefilledTypes = APP_STATE.campaign.selectedTypes.filter(type => availableTypes.has(type));
    }

    if (prefilledTypes.length === 0) {
        prefilledTypes = Array.from(recommendedTypes).filter(type => availableTypes.has(type));
    }

    const uniqueTypes = new Set(prefilledTypes);

    APP_STATE.campaign.selectedTypes = Array.from(uniqueTypes);

    if (APP_STATE.campaign.selectedTypesSet) {
        APP_STATE.campaign.selectedTypesSet.clear();
        APP_STATE.campaign.selectedTypes.forEach(type => APP_STATE.campaign.selectedTypesSet.add(type));
    }

    businessTypeInputs.forEach(cb => {
        cb.checked = uniqueTypes.has(cb.value);
    });

    const advancedSection = document.getElementById('campaignBusinessTypesAdvancedSection');
    const toggleBtn = document.getElementById('toggleAdvancedTypesBtn');
    if (advancedSection && toggleBtn) {
        const hasAdvancedSelected = APP_STATE.campaign.selectedTypes.some(type => !recommendedTypes.has(type));
        if (hasAdvancedSelected) {
            advancedSection.classList.remove('collapsed');
            toggleBtn.textContent = 'Hide Advanced Types';
        } else {
            advancedSection.classList.add('collapsed');
            toggleBtn.textContent = 'Show Advanced Types';
        }
    }

    updateCampaignSelectedCount();

    APP_STATE.campaign.results = {};
    APP_STATE.campaign.allResults = {};
    APP_STATE.campaign.selectedBusinesses = [];

    const resultsContainer = document.getElementById('campaignResultsContainer');
    if (resultsContainer) {
        resultsContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🎯</div>
                <h3>No Results Yet</h3>
                <p>Configure your campaign and click "Find Top Businesses" to see suggestions</p>
            </div>
        `;
    }

    const subtitle = document.getElementById('campaignResultsSubtitle');
    if (subtitle) {
        subtitle.textContent = `Select up to ${APP_STATE.campaign.businessesPerType} businesses per industry`;
    }

    const selectAllGroupsBtn = document.getElementById('selectAllGroupsBtn');
    if (selectAllGroupsBtn) {
        selectAllGroupsBtn.style.display = 'none';
        selectAllGroupsBtn.textContent = '✓ Select All Groups';
    }

    const actionsContainer = document.getElementById('campaignActionsContainer');
    if (actionsContainer) {
        actionsContainer.style.display = 'none';
    }

    renderSelectedBusinesses();
}


// ========================================
// EXPORT FUNCTIONALITY
// ========================================
function exportAsJson() {
    const dataStr = JSON.stringify(APP_STATE.searchResults, null, 2);
    downloadFile(dataStr, 'places-results.json', 'application/json');
}

function exportAsCsv() {
    const headers = ['Name', 'Address', 'Rating', 'Review Count', 'Types', 'Google Maps URL'];

    const rows = APP_STATE.searchResults.map(place => {
        const name = (place.displayName?.text || '').replace(/"/g, '""');
        const address = (place.formattedAddress || '').replace(/"/g, '""');
        const rating = place.rating || '';
        const reviewCount = place.userRatingCount || 0;
        const types = (place.types || []).join(', ');
        const url = place.googleMapsUri || '';

        return [
            `"${name}"`,
            `"${address}"`,
            rating,
            reviewCount,
            `"${types}"`,
            url
        ].join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');
    downloadFile(csv, 'places-results.csv', 'text/csv');
}

function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}

// ========================================
// VIEW TOGGLE FUNCTIONALITY
// ========================================
function switchToQuickSearch() {
    APP_STATE.currentView = 'quickSearch';
    document.getElementById('quickSearchView').style.display = 'block';
    document.getElementById('campaignBuilderView').style.display = 'none';
    document.getElementById('quickSearchViewBtn').classList.add('active');
    document.getElementById('campaignBuilderViewBtn').classList.remove('active');

    const intro = document.getElementById('campaignBuilderIntro');
    if (intro) {
        intro.classList.remove('visible');
    }

    const builderView = document.getElementById('campaignBuilderView');
    if (builderView) {
        builderView.scrollTop = 0;
    }

    // Reset window scroll as a fallback
    window.scrollTo({ top: 0, behavior: 'auto' });
}

function switchToCampaignBuilder() {
    APP_STATE.currentView = 'campaignBuilder';
    document.getElementById('quickSearchView').style.display = 'none';
    document.getElementById('campaignBuilderView').style.display = 'block';
    document.getElementById('quickSearchViewBtn').classList.remove('active');
    document.getElementById('campaignBuilderViewBtn').classList.add('active');

    const intro = document.getElementById('campaignBuilderIntro');
    if (intro) {
        intro.classList.add('visible');
    }

    const builderView = document.getElementById('campaignBuilderView');
    if (builderView) {
        if (typeof builderView.scrollTo === 'function') {
            builderView.scrollTo({ top: 0, behavior: 'auto' });
        }
        builderView.scrollTop = 0;
    } else {
        window.scrollTo({ top: 0, behavior: 'auto' });
    }
}

// ========================================
// CAMPAIGN ACCORDION FUNCTIONS
// ========================================
function initializeAccordionSteps() {
    // Add click handlers to all step headers and toggle buttons
    const stepHeaders = document.querySelectorAll('.step-header');
    const stepToggles = document.querySelectorAll('.step-toggle');

    stepHeaders.forEach(header => {
        header.addEventListener('click', (e) => {
            // Don't toggle if clicking the toggle button itself
            if (e.target.classList.contains('step-toggle')) {
                return;
            }
            const stepNum = parseInt(header.dataset.step);
            toggleStep(stepNum);
        });
    });

    stepToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent header click from firing
            const stepNum = parseInt(toggle.dataset.step);
            toggleStep(stepNum);
        });
    });
}

function toggleStep(stepNumber) {
    const step = document.querySelector(`.campaign-step[data-step="${stepNumber}"]`);
    const stepHeader = step.querySelector('.step-header');
    const stepContent = step.querySelector('.step-content');
    const stepToggle = step.querySelector('.step-toggle');

    const isExpanded = APP_STATE.campaign.stepsExpanded[stepNumber];

    if (isExpanded) {
        // Collapse
        stepContent.classList.add('collapsed');
        stepHeader.classList.add('collapsed');
        stepToggle.textContent = '+';
        APP_STATE.campaign.stepsExpanded[stepNumber] = false;
    } else {
        // Expand
        stepContent.classList.remove('collapsed');
        stepHeader.classList.remove('collapsed');
        stepToggle.textContent = '−';
        APP_STATE.campaign.stepsExpanded[stepNumber] = true;
    }
}

function proceedToStep(stepNumber) {
    // Show and expand the target step
    const targetStep = document.querySelector(`.campaign-step[data-step="${stepNumber}"]`);
    if (targetStep) {
        targetStep.style.display = 'block';

        // Ensure the step is expanded
        const stepContent = targetStep.querySelector('.step-content');
        const stepHeader = targetStep.querySelector('.step-header');
        const stepToggle = targetStep.querySelector('.step-toggle');

        stepContent.classList.remove('collapsed');
        stepHeader.classList.remove('collapsed');
        stepToggle.textContent = '−';
        APP_STATE.campaign.stepsExpanded[stepNumber] = true;

        // Scroll to the step smoothly
        setTimeout(() => {
            targetStep.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }

    APP_STATE.campaign.currentStep = stepNumber;
}

function collapseStep(stepNumber) {
    const step = document.querySelector(`.campaign-step[data-step="${stepNumber}"]`);
    if (step && APP_STATE.campaign.stepsExpanded[stepNumber]) {
        const stepContent = step.querySelector('.step-content');
        const stepHeader = step.querySelector('.step-header');
        const stepToggle = step.querySelector('.step-toggle');

        stepContent.classList.add('collapsed');
        stepHeader.classList.add('collapsed');
        stepToggle.textContent = '+';
        APP_STATE.campaign.stepsExpanded[stepNumber] = false;
    }
}

function onSearchComplete() {
    // Collapse Step 1
    collapseStep(1);

    // Show and expand Step 2
    proceedToStep(2);
}

function onBusinessConfirm() {
    // Validate that at least one business is selected
    if (APP_STATE.campaign.selectedBusinesses.length === 0) {
        alert('Please select at least one business before confirming.');
        return false;
    }

    // Optionally collapse Step 2 to focus on Step 3
    collapseStep(2);

    // Show and expand Step 3
    proceedToStep(3);

    return true;
}

// ========================================
// CAMPAIGN BUILDER FUNCTIONS
// ========================================
function initializeCampaignAutocomplete() {
    const input = document.getElementById('campaignLocationSearch');

    if (!input) {
        console.error('Campaign location search input not found');
        return;
    }

    APP_STATE.campaignAutocomplete = new google.maps.places.Autocomplete(input, {
        fields: ['formatted_address', 'geometry', 'name', 'place_id']
    });

    APP_STATE.campaignAutocomplete.addListener('place_changed', onCampaignPlaceSelected);
}

function onCampaignPlaceSelected() {
    const place = APP_STATE.campaignAutocomplete.getPlace();

    if (!place.geometry) {
        showError('campaignSearchError', 'No location found for this place');
        return;
    }

    APP_STATE.campaign.location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        name: place.name,
        address: place.formatted_address
    };

    // Update UI
    document.getElementById('campaignSelectedLocation').textContent =
        `✓ ${place.name || place.formatted_address}`;

    const coreFields = document.getElementById('campaignCoreFields');
    if (coreFields) {
        coreFields.style.display = 'block';
        coreFields.classList.add('visible');
    }

    // Show hidden form elements
    document.getElementById('campaignRadiusGroup').style.display = 'block';
    document.getElementById('campaignBusinessesPerTypeGroup').style.display = 'block';
    document.getElementById('campaignBusinessTypesGroup').style.display = 'block';
    document.getElementById('campaignSearchBtnGroup').style.display = 'block';

    hideError('campaignSearchError');
}

function initializeCampaignBusinessTypes() {
    const recommendedContainer = document.getElementById('campaignBusinessTypesRecommended');
    const advancedContainer = document.getElementById('campaignBusinessTypesAdvanced');
    const advancedSection = document.getElementById('campaignBusinessTypesAdvancedSection');
    const toggleBtn = document.getElementById('toggleAdvancedTypesBtn');
    const selectedCountDiv = document.getElementById('campaignSelectedTypesCount');

    if (!recommendedContainer || !advancedContainer || !advancedSection || !toggleBtn || !selectedCountDiv) {
        console.error('Campaign business types elements not found');
        return;
    }

    recommendedContainer.innerHTML = '';
    advancedContainer.innerHTML = '';

    const availableTypeValues = new Set(PLACE_TYPES.map(type => type.value));
    const recommendedTypesSet = new Set(CAMPAIGN_BUSINESS_TYPES.map(type => type.value));

    const initialTypes = Array.isArray(APP_STATE.campaign.selectedTypes) && APP_STATE.campaign.selectedTypes.length > 0
        ? APP_STATE.campaign.selectedTypes
        : (Array.isArray(APP_STATE.selectedTypes) && APP_STATE.selectedTypes.length > 0
            ? APP_STATE.selectedTypes
            : Array.from(recommendedTypesSet));

    const selectedTypesSet = new Set(initialTypes.filter(type => availableTypeValues.has(type)));

    if (selectedTypesSet.size === 0) {
        recommendedTypesSet.forEach(type => {
            if (availableTypeValues.has(type)) {
                selectedTypesSet.add(type);
            }
        });
    }

    const addTypeOption = (container, typeObj) => {
        const isChecked = selectedTypesSet.has(typeObj.value);
        const item = document.createElement('div');
        item.className = 'campaign-business-type-item';
        item.innerHTML = `
            <input type="checkbox" id="campaign_type_${typeObj.value}" value="${typeObj.value}" ${isChecked ? 'checked' : ''}>
            <label for="campaign_type_${typeObj.value}">${typeObj.label}</label>
        `;
        container.appendChild(item);

        const checkbox = item.querySelector('input');
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                selectedTypesSet.add(typeObj.value);
            } else {
                selectedTypesSet.delete(typeObj.value);
            }
            APP_STATE.campaign.selectedTypes = Array.from(selectedTypesSet);
            if (APP_STATE.campaign.selectedTypesSet) {
                APP_STATE.campaign.selectedTypesSet.clear();
                APP_STATE.campaign.selectedTypes.forEach(type => APP_STATE.campaign.selectedTypesSet.add(type));
            }
            updateCampaignSelectedCount();
        });
    };

    CAMPAIGN_BUSINESS_TYPES.forEach(type => addTypeOption(recommendedContainer, type));

    const advancedTypes = PLACE_TYPES
        .filter(type => !recommendedTypesSet.has(type.value))
        .sort((a, b) => a.label.localeCompare(b.label));

    advancedTypes.forEach(type => addTypeOption(advancedContainer, type));

    if (!toggleBtn.dataset.listener) {
        toggleBtn.addEventListener('click', () => {
            const isCollapsed = advancedSection.classList.toggle('collapsed');
            toggleBtn.textContent = isCollapsed ? 'Show Advanced Types' : 'Hide Advanced Types';
        });
        toggleBtn.dataset.listener = 'true';
    }

    APP_STATE.campaign.selectedTypesSet = selectedTypesSet;
    APP_STATE.campaign.selectedTypes = Array.from(selectedTypesSet);

    const hasAdvancedSelected = APP_STATE.campaign.selectedTypes.some(type => !recommendedTypesSet.has(type));
    if (hasAdvancedSelected) {
        advancedSection.classList.remove('collapsed');
        toggleBtn.textContent = 'Hide Advanced Types';
    } else {
        advancedSection.classList.add('collapsed');
        toggleBtn.textContent = 'Show Advanced Types';
    }

    updateCampaignSelectedCount();
}

function updateCampaignSelectedCount() {
    const selectedCountDiv = document.getElementById('campaignSelectedTypesCount');
    if (!selectedCountDiv) return;

    const count = APP_STATE.campaign.selectedTypes.length;
    selectedCountDiv.textContent = `${count} type${count !== 1 ? 's' : ''} selected`;
}

async function searchCampaignBusinesses() {
    if (!APP_STATE.campaign.location) {
        showError('campaignSearchError', 'Please select a store location first');
        return;
    }

    if (APP_STATE.campaign.selectedTypes.length === 0) {
        showError('campaignSearchError', 'Please select at least one business type');
        return;
    }

    // Get the number of businesses per type from the input
    const businessesPerTypeInput = document.getElementById('campaignBusinessesPerType');
    const businessesPerType = parseInt(businessesPerTypeInput?.value || '3');

    // Validate and clamp the value
    APP_STATE.campaign.businessesPerType = Math.max(1, Math.min(20, businessesPerType));

    // Update the input to reflect clamped value
    if (businessesPerTypeInput) {
        businessesPerTypeInput.value = APP_STATE.campaign.businessesPerType;
    }

    showStatus('campaignSearchStatus', 'Searching for top businesses...');
    hideError('campaignSearchError');

    try {
        // Clear previous results
        APP_STATE.campaign.results = {};
        APP_STATE.campaign.allResults = {};

        // Search for each business type
        for (const type of APP_STATE.campaign.selectedTypes) {
            const response = await fetchNearbyPlaces(
                APP_STATE.campaign.location.lat,
                APP_STATE.campaign.location.lng,
                APP_STATE.campaign.radius,
                type
            );

            if (response && response.places) {
                // Sort by rating and distance
                const sortedPlaces = response.places
                    .map(place => {
                        // Calculate distance
                        place._distance = calculateDistance(
                            APP_STATE.campaign.location.lat,
                            APP_STATE.campaign.location.lng,
                            place.location?.latitude || 0,
                            place.location?.longitude || 0
                        );
                        return place;
                    })
                    .sort((a, b) => {
                        // Sort by rating (descending), then distance (ascending)
                        const ratingDiff = (b.rating || 0) - (a.rating || 0);
                        if (Math.abs(ratingDiff) > 0.1) {
                            return ratingDiff;
                        }
                        return (a._distance || Infinity) - (b._distance || Infinity);
                    });

                // Store all results for replacement functionality
                APP_STATE.campaign.allResults[type] = sortedPlaces;

                // Store top N for display (based on user selection)
                APP_STATE.campaign.results[type] = sortedPlaces.slice(0, APP_STATE.campaign.businessesPerType);
            }
        }

        renderCampaignResults();
        hideStatus('campaignSearchStatus');

        // Trigger step transition: collapse Step 1, show Step 2
        onSearchComplete();

    } catch (error) {
        console.error('Campaign search error:', error);
        showError('campaignSearchError', `Search failed: ${error.message}`);
        hideStatus('campaignSearchStatus');
    }
}

function renderCampaignResults() {
    const container = document.getElementById('campaignResultsContainer');
    const subtitle = document.getElementById('campaignResultsSubtitle');
    const selectAllGroupsBtn = document.getElementById('selectAllGroupsBtn');
    const step2FooterActions = document.getElementById('step2FooterActions');

    container.innerHTML = '';

    // Update subtitle with current businesses per type value
    if (subtitle) {
        subtitle.textContent = `Select up to ${APP_STATE.campaign.businessesPerType} businesses per industry`;
    }

    const typesWithResults = Object.keys(APP_STATE.campaign.results);

    if (typesWithResults.length === 0) {
        if (selectAllGroupsBtn) {
            selectAllGroupsBtn.style.display = 'none';
        }
        if (step2FooterActions) {
            step2FooterActions.style.display = 'none';
        }
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">😕</div>
                <h3>No Results Found</h3>
                <p>Try adjusting your search parameters or increasing the radius</p>
            </div>
        `;
        return;
    }

    if (selectAllGroupsBtn) {
        selectAllGroupsBtn.style.display = 'inline-flex';
        if (!selectAllGroupsBtn.dataset.listener) {
            selectAllGroupsBtn.addEventListener('click', toggleSelectAllGroups);
            selectAllGroupsBtn.dataset.listener = 'true';
        }
    }

    // Show the Confirm Businesses button footer
    if (step2FooterActions) {
        step2FooterActions.style.display = 'block';
    }

    // Render each business type group
    typesWithResults.forEach(typeValue => {
        const businesses = APP_STATE.campaign.results[typeValue];
        if (businesses.length === 0) return;

        const typeLabel = getTypeLabel(typeValue);

        // Count how many are currently selected for this type
        const selectedCount = APP_STATE.campaign.selectedBusinesses.filter(b => b.type === typeValue).length;
        const totalCount = businesses.length;
        const allSelected = selectedCount === totalCount;

        const groupDiv = document.createElement('div');
        groupDiv.className = 'business-type-group';
        groupDiv.dataset.type = typeValue;

        groupDiv.innerHTML = `
            <div class="business-type-group-header">
                <div class="business-type-group-info">
                    <h3 class="business-type-group-title">${typeLabel}</h3>
                    <span class="selection-counter" data-type="${typeValue}">${selectedCount}/${totalCount} selected</span>
                </div>
                <button class="btn-select-all-group" data-type="${typeValue}">
                    ${allSelected ? '✗ Deselect All' : '✓ Select All'}
                </button>
            </div>
            <div class="business-suggestion-list" data-type="${typeValue}">
                ${businesses.map(business => createBusinessSuggestionCard(business, typeValue)).join('')}
            </div>
        `;

        container.appendChild(groupDiv);

        // Add event listener to "Select All" button for this group
        const selectAllBtn = groupDiv.querySelector('.btn-select-all-group');
        selectAllBtn.addEventListener('click', () => {
            toggleSelectAllGroup(typeValue);
        });

        // Add event listeners to checkboxes
        const checkboxes = groupDiv.querySelectorAll('.business-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                handleBusinessSelection(e, typeValue);
            });
        });
    });

    if (selectAllGroupsBtn) {
        updateSelectAllGroupsButton();
    }
}

function createBusinessSuggestionCard(business, typeValue) {
    const businessId = business.id || business.displayName?.text || Math.random().toString();
    const isSelected = APP_STATE.campaign.selectedBusinesses.some(b => b.id === businessId);
    const primaryPhoto = Array.isArray(business.photos) && business.photos.length > 0 ? business.photos[0] : null;
    const photoUrl = primaryPhoto && APP_STATE.apiKey
        ? `https://places.googleapis.com/v1/${primaryPhoto.name}/media?key=${APP_STATE.apiKey}&maxWidthPx=320&maxHeightPx=320`
        : null;

    return `
        <div class="business-suggestion-card ${isSelected ? 'selected' : ''}" data-business-id="${businessId}">
            <input type="checkbox" class="business-checkbox"
                   data-business-id="${businessId}"
                   data-type="${typeValue}"
                   ${isSelected ? 'checked' : ''}>
            ${photoUrl ? `
                <div class="business-suggestion-photo">
                    <img src="${photoUrl}"
                         alt="${(business.displayName?.text || 'Business photo').replace(/"/g, '&quot;')}"
                         loading="lazy">
                </div>
            ` : ''}
            <div class="business-suggestion-info">
                <div class="business-suggestion-name">${business.displayName?.text || 'Unknown'}</div>
                <div class="business-suggestion-address">
                    📍 ${business.formattedAddress || 'No address'}
                </div>
                <div class="business-suggestion-meta">
                    <div class="business-meta-item">
                        <span class="rating-stars">★</span>
                        <span>${business.rating || 'N/A'}</span>
                    </div>
                    <div class="business-meta-item">
                        <span>📝</span>
                        <span>${business.userRatingCount || 0} reviews</span>
                    </div>
                    <div class="business-meta-item">
                        <span>📏</span>
                        <span>${formatDistance(business._distance)}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function handleBusinessSelection(event, typeValue) {
    const checkbox = event.target;
    const businessId = checkbox.dataset.businessId;
    const card = checkbox.closest('.business-suggestion-card');

    // Find the business in results
    const business = APP_STATE.campaign.results[typeValue]?.find(b =>
        (b.id || b.displayName?.text || Math.random().toString()) === businessId
    );

    if (!business) return;

    if (checkbox.checked) {
        // Check if already at limit for this type
        const currentCount = APP_STATE.campaign.selectedBusinesses.filter(b => b.type === typeValue).length;
        const maxPerType = APP_STATE.campaign.businessesPerType;

        if (currentCount >= maxPerType) {
            checkbox.checked = false;
            const typeLabel = getTypeLabel(typeValue);
            alert(`You can only select up to ${maxPerType} businesses per industry. Please deselect one before adding another ${typeLabel} business.`);
            return;
        }

        // Add to selected businesses
        APP_STATE.campaign.selectedBusinesses.push({
            ...business,
            type: typeValue,
            id: businessId
        });

        card.classList.add('selected');
    } else {
        // Remove from selected businesses
        APP_STATE.campaign.selectedBusinesses = APP_STATE.campaign.selectedBusinesses.filter(b => b.id !== businessId);
        card.classList.remove('selected');
    }

    // Update counters and selected list
    updateSelectionCounter(typeValue);
    renderSelectedBusinesses();
}

function updateSelectionCounter(typeValue) {
    const counter = document.querySelector(`.selection-counter[data-type="${typeValue}"]`);
    if (counter) {
        const count = APP_STATE.campaign.selectedBusinesses.filter(b => b.type === typeValue).length;
        const totalCount = APP_STATE.campaign.results[typeValue]?.length || APP_STATE.campaign.businessesPerType;
        counter.textContent = `${count}/${totalCount} selected`;
    }

    // Update the "Select All" button text for this group
    const selectAllBtn = document.querySelector(`.btn-select-all-group[data-type="${typeValue}"]`);
    if (selectAllBtn) {
        const businesses = APP_STATE.campaign.results[typeValue] || [];
        const selectedCount = APP_STATE.campaign.selectedBusinesses.filter(b => b.type === typeValue).length;
        const allSelected = selectedCount === businesses.length;
        selectAllBtn.textContent = allSelected ? '✗ Deselect All' : '✓ Select All';
    }

    // Update the "Select All Groups" button
    updateSelectAllGroupsButton();
}

function toggleSelectAllGroup(typeValue) {
    const businesses = APP_STATE.campaign.results[typeValue] || [];
    const selectedCount = APP_STATE.campaign.selectedBusinesses.filter(b => b.type === typeValue).length;
    const allSelected = selectedCount === businesses.length;

    if (allSelected) {
        // Deselect all in this group
        businesses.forEach(business => {
            const businessId = business.id || business.displayName?.text || Math.random().toString();
            APP_STATE.campaign.selectedBusinesses = APP_STATE.campaign.selectedBusinesses.filter(b => b.id !== businessId);

            // Update checkbox
            const checkbox = document.querySelector(`.business-checkbox[data-business-id="${businessId}"]`);
            if (checkbox) {
                checkbox.checked = false;
                const card = checkbox.closest('.business-suggestion-card');
                if (card) {
                    card.classList.remove('selected');
                }
            }
        });
    } else {
        // Select all in this group
        businesses.forEach(business => {
            const businessId = business.id || business.displayName?.text || Math.random().toString();

            // Check if already selected
            if (!APP_STATE.campaign.selectedBusinesses.some(b => b.id === businessId)) {
                APP_STATE.campaign.selectedBusinesses.push({
                    ...business,
                    type: typeValue,
                    id: businessId
                });

                // Update checkbox
                const checkbox = document.querySelector(`.business-checkbox[data-business-id="${businessId}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                    const card = checkbox.closest('.business-suggestion-card');
                    if (card) {
                        card.classList.add('selected');
                    }
                }
            }
        });
    }

    // Update UI
    updateSelectionCounter(typeValue);
    renderSelectedBusinesses();
}

function toggleSelectAllGroups() {
    const typesWithResults = Object.keys(APP_STATE.campaign.results);

    // Calculate how many businesses are selected across all groups
    let totalBusinesses = 0;
    let totalSelected = 0;
    typesWithResults.forEach(typeValue => {
        const businesses = APP_STATE.campaign.results[typeValue] || [];
        totalBusinesses += businesses.length;
        totalSelected += APP_STATE.campaign.selectedBusinesses.filter(b => b.type === typeValue).length;
    });

    const allSelected = totalSelected === totalBusinesses;

    if (allSelected) {
        // Deselect all across all groups
        typesWithResults.forEach(typeValue => {
            const businesses = APP_STATE.campaign.results[typeValue] || [];
            businesses.forEach(business => {
                const businessId = business.id || business.displayName?.text || Math.random().toString();
                APP_STATE.campaign.selectedBusinesses = APP_STATE.campaign.selectedBusinesses.filter(b => b.id !== businessId);

                // Update checkbox
                const checkbox = document.querySelector(`.business-checkbox[data-business-id="${businessId}"]`);
                if (checkbox) {
                    checkbox.checked = false;
                    const card = checkbox.closest('.business-suggestion-card');
                    if (card) {
                        card.classList.remove('selected');
                    }
                }
            });

            updateSelectionCounter(typeValue);
        });
    } else {
        // Select all across all groups
        typesWithResults.forEach(typeValue => {
            const businesses = APP_STATE.campaign.results[typeValue] || [];
            businesses.forEach(business => {
                const businessId = business.id || business.displayName?.text || Math.random().toString();

                // Check if already selected
                if (!APP_STATE.campaign.selectedBusinesses.some(b => b.id === businessId)) {
                    APP_STATE.campaign.selectedBusinesses.push({
                        ...business,
                        type: typeValue,
                        id: businessId
                    });

                    // Update checkbox
                    const checkbox = document.querySelector(`.business-checkbox[data-business-id="${businessId}"]`);
                    if (checkbox) {
                        checkbox.checked = true;
                        const card = checkbox.closest('.business-suggestion-card');
                        if (card) {
                            card.classList.add('selected');
                        }
                    }
                }
            });

            updateSelectionCounter(typeValue);
        });
    }

    // Update UI
    renderSelectedBusinesses();
    updateSelectAllGroupsButton();
}

function updateSelectAllGroupsButton() {
    const btn = document.getElementById('selectAllGroupsBtn');
    if (!btn) return;

    const typesWithResults = Object.keys(APP_STATE.campaign.results);

    let totalBusinesses = 0;
    let totalSelected = 0;
    typesWithResults.forEach(typeValue => {
        const businesses = APP_STATE.campaign.results[typeValue] || [];
        totalBusinesses += businesses.length;
        totalSelected += APP_STATE.campaign.selectedBusinesses.filter(b => b.type === typeValue).length;
    });

    const allSelected = totalSelected === totalBusinesses && totalBusinesses > 0;
    btn.textContent = allSelected ? '✗ Deselect All Groups' : '✓ Select All Groups';
}

function renderSelectedBusinesses() {
    const summary = document.getElementById('campaignSelectionSummary');
    const countBadge = document.getElementById('selectedBusinessesCount');
    const generateAssetsBtn = document.getElementById('generateAssetsBtn');

    if (!summary || !countBadge) {
        console.error('Selection summary elements not found');
        return;
    }

    const selectedCount = APP_STATE.campaign.selectedBusinesses.length;
    countBadge.textContent = selectedCount;

    // Update Generate Assets button state and label
    if (generateAssetsBtn) {
        const label = `Create Assets for ${selectedCount} ${selectedCount === 1 ? 'Business' : 'Businesses'}`;

        if (generateAssetsBtn.dataset.processing === 'true') {
            generateAssetsBtn.dataset.pendingLabel = label;
        } else {
            delete generateAssetsBtn.dataset.pendingLabel;
            generateAssetsBtn.textContent = label;
            if (selectedCount > 0) {
                generateAssetsBtn.disabled = false;
                generateAssetsBtn.removeAttribute('title');
            } else {
                generateAssetsBtn.disabled = true;
                generateAssetsBtn.setAttribute('title', 'Select businesses first');
            }
        }
    }

    if (selectedCount === 0) {
        summary.textContent = 'Select businesses in the suggestions panel to get started.';
        summary.classList.remove('has-selection');
        return;
    }

    const typeCounts = APP_STATE.campaign.selectedBusinesses.reduce((acc, business) => {
        const typeLabel = getTypeLabel(business.type);
        acc[typeLabel] = (acc[typeLabel] || 0) + 1;
        return acc;
    }, {});

    const breakdown = Object.entries(typeCounts)
        .map(([label, count]) => `${label} (${count})`)
        .join(', ');

    summary.textContent = breakdown
        ? `Ready with ${selectedCount} selected ${selectedCount === 1 ? 'business' : 'businesses'} • ${breakdown}`
        : `Ready with ${selectedCount} selected ${selectedCount === 1 ? 'business' : 'businesses'}`;
    summary.classList.add('has-selection');
}

function removeSelectedBusiness(businessId, typeValue) {
    // Remove from selected list
    APP_STATE.campaign.selectedBusinesses = APP_STATE.campaign.selectedBusinesses.filter(b => b.id !== businessId);

    // Uncheck the checkbox in results
    const checkbox = document.querySelector(`.business-checkbox[data-business-id="${businessId}"]`);
    if (checkbox) {
        checkbox.checked = false;
        const card = checkbox.closest('.business-suggestion-card');
        if (card) {
            card.classList.remove('selected');
        }
    }

    // Update UI
    updateSelectionCounter(typeValue);
    renderSelectedBusinesses();
}

function replaceSelectedBusiness(businessId, typeValue) {
    // Get all businesses for this type
    const allBusinesses = APP_STATE.campaign.allResults[typeValue] || [];

    // Get currently selected business IDs for this type
    const selectedIds = APP_STATE.campaign.selectedBusinesses
        .filter(b => b.type === typeValue)
        .map(b => b.id);

    // Find the next best business that isn't already selected
    const nextBusiness = allBusinesses.find(business => {
        const bId = business.id || business.displayName?.text || Math.random().toString();
        return !selectedIds.includes(bId);
    });

    if (!nextBusiness) {
        alert(`No more alternative businesses available for ${getTypeLabel(typeValue)}`);
        return;
    }

    // Generate ID for the new business
    const newBusinessId = nextBusiness.id || nextBusiness.displayName?.text || Math.random().toString();

    // Remove the old business from selected list
    const oldBusinessIndex = APP_STATE.campaign.selectedBusinesses.findIndex(b => b.id === businessId);
    if (oldBusinessIndex !== -1) {
        APP_STATE.campaign.selectedBusinesses.splice(oldBusinessIndex, 1);
    }

    // Add the new business to selected list
    APP_STATE.campaign.selectedBusinesses.push({
        ...nextBusiness,
        type: typeValue,
        id: newBusinessId
    });

    // Uncheck the old checkbox in results
    const oldCheckbox = document.querySelector(`.business-checkbox[data-business-id="${businessId}"]`);
    if (oldCheckbox) {
        oldCheckbox.checked = false;
        const oldCard = oldCheckbox.closest('.business-suggestion-card');
        if (oldCard) {
            oldCard.classList.remove('selected');
        }
    }

    // Check the new checkbox in results (if it's in the displayed results)
    const newCheckbox = document.querySelector(`.business-checkbox[data-business-id="${newBusinessId}"]`);
    if (newCheckbox) {
        newCheckbox.checked = true;
        const newCard = newCheckbox.closest('.business-suggestion-card');
        if (newCard) {
            newCard.classList.add('selected');
        }
    }

    // Update UI
    updateSelectionCounter(typeValue);
    renderSelectedBusinesses();

    // Show a notification about the replacement
    const typeLabel = getTypeLabel(typeValue);
    const newBusinessName = nextBusiness.displayName?.text || 'Unknown';
    showStatus('campaignSearchStatus', `✓ Replaced with: ${newBusinessName} (${typeLabel})`);
    setTimeout(() => {
        hideStatus('campaignSearchStatus');
    }, 3000);
}

// ========================================
// CAMPAIGN ASSET GENERATION
// ========================================
async function generateCampaignAssets() {
    const generateBtn = document.getElementById('generateAssetsBtn');
    const statusDiv = document.getElementById('campaignAssetsStatus');
    const errorDiv = document.getElementById('campaignAssetsError');

    if (APP_STATE.campaign.selectedBusinesses.length === 0) {
        showError('campaignAssetsError', 'Please select businesses first');
        return;
    }

    // Disable button and show loading state
    if (generateBtn) {
        generateBtn.disabled = true;
        generateBtn.dataset.processing = 'true';
        generateBtn.textContent = '⏳ Creating Assets...';
    }

    hideError('campaignAssetsError');
    showStatus('campaignAssetsStatus', 'Preparing asset data...');

    try {
        // Create the JSON payload
        const payload = {
            campaign: {
                name: document.getElementById('campaignName')?.value || '',
                theme: document.getElementById('campaignTheme')?.value || '',
                description: document.getElementById('campaignDescription')?.value || '',
                storeLocation: APP_STATE.campaign.location ? {
                    name: APP_STATE.campaign.location.name,
                    address: APP_STATE.campaign.location.address,
                    coordinates: {
                        latitude: APP_STATE.campaign.location.lat,
                        longitude: APP_STATE.campaign.location.lng
                    }
                } : null,
                searchRadius: APP_STATE.campaign.radius,
                businessesPerType: APP_STATE.campaign.businessesPerType,
                timestamp: new Date().toISOString()
            },
            businesses: APP_STATE.campaign.selectedBusinesses.map(business => {
                const typeLabel = getTypeLabel(business.type);

                return {
                    id: business.id,
                    name: business.displayName?.text || 'Unknown',
                    type: business.type,
                    typeLabel: typeLabel,
                    address: business.formattedAddress || '',
                    location: {
                        latitude: business.location?.latitude || null,
                        longitude: business.location?.longitude || null
                    },
                    rating: business.rating || null,
                    reviewCount: business.userRatingCount || 0,
                    distance: business._distance ? Math.round(business._distance) : null,
                    distanceFormatted: business._distance ? formatDistance(business._distance) : null,
                    businessStatus: business.businessStatus || 'UNKNOWN',
                    types: business.types || [],
                    googleMapsUri: business.googleMapsUri || null,
                    photos: business.photos ? business.photos.map(photo => ({
                        name: photo.name,
                        url: `https://places.googleapis.com/v1/${photo.name}/media?key=${APP_STATE.apiKey}&maxHeightPx=800&maxWidthPx=800`
                    })) : []
                };
            })
        };

        // Send to webhook
        showStatus('campaignAssetsStatus', `Sending data to webhook (${payload.businesses.length} businesses)...`);

        const webhookUrl = 'https://n8n.groves.digital/webhook-test/0bdc8a49-d46c-4166-982d-917284a44032';

        // Log payload for debugging
        console.log('Asset Generation Payload:', payload);
        console.log('Payload JSON:', JSON.stringify(payload, null, 2));

        let response;
        try {
            response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
                mode: 'cors' // Explicitly set CORS mode
            });
        } catch (fetchError) {
            // CORS or network error
            console.error('Fetch error:', fetchError);

            // Try with no-cors mode as fallback (won't get response but will send data)
            console.log('Attempting to send with no-cors mode...');

            try {
                await fetch(webhookUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                    mode: 'no-cors' // Fallback mode
                });

                // With no-cors, we can't read the response, but the request was sent
                showStatus('campaignAssetsStatus', `✓ Assets data sent! (${payload.businesses.length} businesses)\n⚠️ CORS prevented response verification. Check n8n webhook logs.`);

                // Show detailed info
                alert(`Data sent successfully!\n\nNote: Due to CORS restrictions, we cannot verify the webhook response.\n\nPlease check your n8n webhook logs to confirm receipt.\n\nTo fix this:\n1. In n8n, add a "Set Response Headers" action\n2. Set "Access-Control-Allow-Origin" to "*"\n3. Set "Access-Control-Allow-Methods" to "POST, OPTIONS"\n\nPayload logged to console for debugging.`);

                setTimeout(() => {
                    if (generateBtn) {
                        delete generateBtn.dataset.processing;
                        delete generateBtn.dataset.pendingLabel;
                    }
                    renderSelectedBusinesses();
                    hideStatus('campaignAssetsStatus');
                }, 3000);

                return; // Exit function
            } catch (noCorsError) {
                throw new Error(`CORS Error: The webhook endpoint must allow cross-origin requests. Configure CORS headers in n8n. Original error: ${fetchError.message}`);
            }
        }

        if (!response.ok) {
            throw new Error(`Webhook error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json().catch(() => ({ success: true }));

        // Show success message
        showStatus('campaignAssetsStatus', `✓ Assets generated successfully! Sent ${payload.businesses.length} businesses to webhook.`);

        console.log('Webhook Response:', result);

        // Re-enable button after delay
        setTimeout(() => {
            if (generateBtn) {
                delete generateBtn.dataset.processing;
                delete generateBtn.dataset.pendingLabel;
            }
            renderSelectedBusinesses();
            hideStatus('campaignAssetsStatus');
        }, 3000);

    } catch (error) {
        console.error('Asset generation error:', error);
        showError('campaignAssetsError', `Failed to generate assets: ${error.message}`);

        // Re-enable button
        if (generateBtn) {
            delete generateBtn.dataset.processing;
            delete generateBtn.dataset.pendingLabel;
        }
        renderSelectedBusinesses();
        hideStatus('campaignAssetsStatus');
    }
}

// ========================================
// SETTINGS MODAL
// ========================================
function openSettingsModal() {
    document.getElementById('settingsModal').style.display = 'flex';
}

function closeSettingsModal() {
    document.getElementById('settingsModal').style.display = 'none';
    document.getElementById('settingsApiKey').value = '';
    hideError('settingsError');
}

function saveSettings() {
    const newApiKey = document.getElementById('settingsApiKey').value.trim();

    if (newApiKey) {
        if (saveApiKey(newApiKey)) {
            closeSettingsModal();
            alert('API key updated successfully. Please reload the page.');
            location.reload();
        } else {
            showError('settingsError', 'Failed to save API key');
        }
    } else {
        closeSettingsModal();
    }
}

function clearSettings() {
    if (confirm('Are you sure you want to clear your API key? You will need to set it up again.')) {
        clearApiKey();
        location.reload();
    }
}

// ========================================
// UI HELPERS
// ========================================
function showError(elementId, message) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.style.display = 'block';
}

function hideError(elementId) {
    const element = document.getElementById(elementId);
    element.style.display = 'none';
}

function showStatus(elementId, message) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.style.display = 'block';
}

function hideStatus(elementId) {
    const element = document.getElementById(elementId);
    element.style.display = 'none';
}

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', async function() {
    // Check for API key
    const apiKey = loadApiKey();

    if (!apiKey) {
        // Show setup screen
        document.getElementById('setupScreen').style.display = 'flex';

        // Setup form handler
        document.getElementById('setupForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const key = document.getElementById('setupApiKey').value.trim();

            if (!key) {
                showError('setupError', 'Please enter an API key');
                return;
            }

            if (saveApiKey(key)) {
                location.reload();
            } else {
                showError('setupError', 'Failed to save API key');
            }
        });
    } else {
        // Show main app
        document.getElementById('mainApp').style.display = 'flex';

        try {
            // Load Google Maps
            await loadGoogleMapsScript(apiKey);
            initializeMap();
            initializeAutocomplete();
            initializeBusinessTypesList();
            initializePanelToggle();

            // Initialize Campaign Builder
            initializeCampaignAutocomplete();
            initializeCampaignBusinessTypes();
            initializeAccordionSteps();

            // Radius slider with discrete values
            const radiusSlider = document.getElementById('radiusSlider');
            const radiusValue = document.getElementById('radiusValue');
            radiusSlider.addEventListener('input', (e) => {
                const sliderIndex = parseInt(e.target.value);
                const radiusInMeters = getRadiusFromSlider(sliderIndex);
                APP_STATE.radius = radiusInMeters;
                radiusValue.textContent = formatRadiusDisplay(radiusInMeters);

                // Update radius circle on map
                updateRadiusCircle();
            });

            // Update map button
            document.getElementById('updateMapBtn').addEventListener('click', searchPlaces);

            // View results button
            document.getElementById('viewResultsBtn').addEventListener('click', showResultsPage);

            // Back to search button
            document.getElementById('backToSearchBtn').addEventListener('click', showMainApp);

            // Export buttons
            document.getElementById('exportJsonBtn').addEventListener('click', exportAsJson);
            document.getElementById('exportCsvBtn').addEventListener('click', exportAsCsv);

            // Settings button
            document.getElementById('settingsBtn').addEventListener('click', openSettingsModal);
            document.getElementById('closeSettingsBtn').addEventListener('click', closeSettingsModal);
            document.getElementById('saveSettingsBtn').addEventListener('click', saveSettings);
            document.getElementById('clearApiKeyBtn').addEventListener('click', clearSettings);

            // Close modal on overlay click
            document.querySelector('.modal-overlay').addEventListener('click', closeSettingsModal);

            // View toggle buttons
            document.getElementById('quickSearchViewBtn').addEventListener('click', switchToQuickSearch);
            document.getElementById('campaignBuilderViewBtn').addEventListener('click', switchToCampaignBuilder);

            // Campaign radius slider
            const campaignRadiusSlider = document.getElementById('campaignRadiusSlider');
            const campaignRadiusValue = document.getElementById('campaignRadiusValue');
            campaignRadiusSlider.addEventListener('input', (e) => {
                const sliderIndex = parseInt(e.target.value);
                const radiusInMeters = getRadiusFromSlider(sliderIndex);
                APP_STATE.campaign.radius = radiusInMeters;
                campaignRadiusValue.textContent = formatRadiusDisplay(radiusInMeters);
            });

            // Campaign search button
            document.getElementById('campaignSearchBtn').addEventListener('click', searchCampaignBusinesses);

            // Confirm Businesses button
            document.getElementById('confirmBusinessesBtn').addEventListener('click', onBusinessConfirm);

            // Generate Assets button
            document.getElementById('generateAssetsBtn').addEventListener('click', generateCampaignAssets);

            // Campaign businesses per type input - update hint text when changed
            const businessesPerTypeInput = document.getElementById('campaignBusinessesPerType');
            const businessTypesHint = document.getElementById('campaignBusinessTypesHint');
            if (businessesPerTypeInput && businessTypesHint) {
                businessesPerTypeInput.addEventListener('input', (e) => {
                    const value = parseInt(e.target.value) || 3;
                    const clampedValue = Math.max(1, Math.min(20, value));
                    businessTypesHint.textContent = `Select industries to target (top ${clampedValue} per type will be found)`;
                });

                // Set initial hint text
                businessTypesHint.textContent = `Select industries to target (top ${businessesPerTypeInput.value} per type will be found)`;
            }

        } catch (error) {
            console.error('Initialization error:', error);
            showError('searchError', `Failed to initialize: ${error.message}`);
        }
    }
});
