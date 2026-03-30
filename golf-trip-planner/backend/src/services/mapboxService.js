/**
 * Mapbox Directions Service — MOCK
 *
 * Estimates driving distance and time between coordinates using the
 * Haversine formula instead of calling the Mapbox API.
 * Replace with the real Mapbox Matrix API (see .env.example) when
 * MAPBOX_ACCESS_TOKEN is available.
 */

/**
 * Calculate distance and travel time between an ordered list of coordinates.
 * Returns leg-by-leg results (point 0→1, 1→2, etc.).
 *
 * @param {Array<{lat: number, lng: number}>} points
 * @returns {Promise<Array<{fromIndex, toIndex, distanceKm, durationMin}>>}
 */
async function calculateDistances(points) {
  if (points.length < 2) return [];

  const legs = [];
  for (let i = 0; i < points.length - 1; i++) {
    const straightKm = haversineKm(points[i], points[i + 1]);
    // Road distance is typically ~1.3× straight-line; driving ~80 km/h avg
    const roadKm = parseFloat((straightKm * 1.3).toFixed(1));
    const durationMin = Math.round((roadKm / 80) * 60);
    legs.push({ fromIndex: i, toIndex: i + 1, distanceKm: roadKm, durationMin });
  }
  return legs;
}

/** Haversine great-circle distance in kilometres */
function haversineKm(a, b) {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const c = sinLat * sinLat + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLng * sinLng;
  return R * 2 * Math.atan2(Math.sqrt(c), Math.sqrt(1 - c));
}

function toRad(deg) { return deg * (Math.PI / 180); }

module.exports = { calculateDistances };
