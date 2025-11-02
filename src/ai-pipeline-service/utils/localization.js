// Localization utilities for content generation

// Map countries to language codes
const COUNTRY_LANGUAGE_MAP = {
  // German-speaking
  'germany': 'de',
  'deutschland': 'de',
  'austria': 'de',
  'österreich': 'de',
  'switzerland': 'de', // Default to German for Switzerland (also has fr, it)
  'schweiz': 'de',
  
  // Swedish
  'sweden': 'sv',
  'sverige': 'sv',
  
  // French
  'france': 'fr',
  'belgium': 'fr',
  'belgique': 'fr',
  
  // Spanish
  'spain': 'es',
  'españa': 'es',
  'mexico': 'es',
  'argentina': 'es',
  'colombia': 'es',
  'chile': 'es',
  
  // Italian
  'italy': 'it',
  'italia': 'it',
  
  // Dutch
  'netherlands': 'nl',
  'nederland': 'nl',
  
  // Portuguese
  'portugal': 'pt',
  'brazil': 'pt',
  'brasil': 'pt',
  
  // Polish
  'poland': 'pl',
  'polska': 'pl',
  
  // Danish
  'denmark': 'da',
  'danmark': 'da',
  
  // Norwegian
  'norway': 'no',
  'norge': 'no',
  
  // Finnish
  'finland': 'fi',
  'suomi': 'fi',
  
  // Default to English
  'united kingdom': 'en',
  'uk': 'en',
  'united states': 'en',
  'usa': 'en',
  'us': 'en',
  'canada': 'en',
  'australia': 'en',
  'new zealand': 'en',
  'ireland': 'en',
};

// Language names for logging
const LANGUAGE_NAMES = {
  'de': 'German',
  'sv': 'Swedish',
  'fr': 'French',
  'es': 'Spanish',
  'it': 'Italian',
  'nl': 'Dutch',
  'pt': 'Portuguese',
  'pl': 'Polish',
  'da': 'Danish',
  'no': 'Norwegian',
  'fi': 'Finnish',
  'en': 'English',
};

/**
 * Extract country from address string
 * @param {string} address - Full address string
 * @returns {string|null} - Country name or null
 */
export function extractCountryFromAddress(address) {
  if (!address) return null;
  
  // Address typically ends with country (e.g., "123 Main St, Stockholm, Sweden")
  const parts = address.split(',').map(p => p.trim());
  if (parts.length > 0) {
    // Return last part (likely country)
    return parts[parts.length - 1].toLowerCase();
  }
  
  return null;
}

/**
 * Detect language from location address
 * @param {string} address - Location address
 * @returns {string} - Language code (defaults to 'en')
 */
export function detectLanguageFromAddress(address) {
  const country = extractCountryFromAddress(address);
  
  if (!country) {
    console.log('[LOCALIZATION] No country detected, defaulting to English');
    return 'en';
  }
  
  // Check if country matches any in our map
  for (const [countryKey, langCode] of Object.entries(COUNTRY_LANGUAGE_MAP)) {
    if (country.includes(countryKey) || countryKey.includes(country)) {
      console.log(`[LOCALIZATION] Detected country: ${country} → Language: ${LANGUAGE_NAMES[langCode]} (${langCode})`);
      return langCode;
    }
  }
  
  // Default to English if no match
  console.log(`[LOCALIZATION] Unknown country: ${country}, defaulting to English`);
  return 'en';
}

/**
 * Get language name from code
 * @param {string} langCode - Language code
 * @returns {string} - Language name
 */
export function getLanguageName(langCode) {
  return LANGUAGE_NAMES[langCode] || 'English';
}
