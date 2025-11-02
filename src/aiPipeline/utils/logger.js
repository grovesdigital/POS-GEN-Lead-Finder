// Simple console logger
export function log(level, message) {
  console[level](`[${level.toUpperCase()}] ${message}`);
}
