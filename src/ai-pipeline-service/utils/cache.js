// Simple in-memory cache for image descriptions
const cache = {};
export async function cacheGet(key) {
  return cache[key];
}
export async function cacheSet(key, value) {
  cache[key] = value;
}
