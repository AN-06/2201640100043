// src/utils/geo.js

// Return a coarse geo string: country code if possible, otherwise "unknown".
// Attempts geolocation -> fallback IP lookup (ipapi.co), otherwise "unknown".
export async function getCoarseGeo() {
  // Try browser geolocation for coarse lat:lon (rounded)
  if (navigator.geolocation) {
    try {
      const pos = await new Promise((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000 })
      );
      const lat = Math.round(pos.coords.latitude);
      const lon = Math.round(pos.coords.longitude);
      return `${lat}:${lon}`; // coarse lat:lon
    } catch {
      // ignore and fallback to IP-based
    }
  }

  // Fallback: IP lookup (may fail if blocked)
  try {
    const r = await fetch("https://ipapi.co/json/").then(r => r.json());
    if (r && r.country) return r.country;
  } catch {
    // ignore
  }

  return "unknown";
}
