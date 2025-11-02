// Simple validation using field lengths
import { manifest } from '../manifest.js';
export function validateAsset(asset) {
  for (const key in manifest.fields) {
    if (asset[key] && asset[key].length > manifest.fields[key].maxLength) {
      return false;
    }
  }
  return true;
}
