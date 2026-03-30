/**
 * Accommodation Service — MOCK
 *
 * Returns realistic mock hotel data for the coordinates provided.
 * Replace with the real Booking.com / RapidAPI implementation (see .env.example)
 * when RAPIDAPI_KEY is available.
 */

const MOCK_HOTELS = [
  {
    id: 'hotel-1',
    name: 'Hotel Kämp',
    stars: 5,
    reviewScore: 9.2,
    reviewWord: 'Superb',
    address: 'Pohjoisesplanadi 29, Helsinki',
    lat: 60.1689,
    lng: 24.9427,
    pricePerNight: 289,
    currency: 'EUR',
    bookingUrl: 'https://www.booking.com/hotel/fi/kamp.html',
    thumbnailUrl: null,
  },
  {
    id: 'hotel-2',
    name: 'Radisson Blu Espoo',
    stars: 4,
    reviewScore: 8.4,
    reviewWord: 'Very Good',
    address: 'Otaranta 2, Espoo',
    lat: 60.1833,
    lng: 24.8268,
    pricePerNight: 149,
    currency: 'EUR',
    bookingUrl: 'https://www.booking.com/hotel/fi/radisson-blu-espoo.html',
    thumbnailUrl: null,
  },
  {
    id: 'hotel-3',
    name: 'Holiday Inn Vantaa',
    stars: 4,
    reviewScore: 7.9,
    reviewWord: 'Good',
    address: 'Hertaksentie 2, Vantaa',
    lat: 60.2934,
    lng: 25.0378,
    pricePerNight: 119,
    currency: 'EUR',
    bookingUrl: 'https://www.booking.com/hotel/fi/holiday-inn-vantaa.html',
    thumbnailUrl: null,
  },
  {
    id: 'hotel-4',
    name: 'Sokos Hotel Tapiola Garden',
    stars: 3,
    reviewScore: 8.1,
    reviewWord: 'Very Good',
    address: 'Tapionraitti 3, Espoo',
    lat: 60.1769,
    lng: 24.8044,
    pricePerNight: 99,
    currency: 'EUR',
    bookingUrl: 'https://www.booking.com/hotel/fi/sokos-hotel-tapiola-garden.html',
    thumbnailUrl: null,
  },
  {
    id: 'hotel-5',
    name: 'Original Sokos Hotel Vantaa',
    stars: 3,
    reviewScore: 7.6,
    reviewWord: 'Good',
    address: 'Hertaksentie 4, Vantaa',
    lat: 60.2941,
    lng: 25.0401,
    pricePerNight: 89,
    currency: 'EUR',
    bookingUrl: 'https://www.booking.com/hotel/fi/original-sokos-vantaa.html',
    thumbnailUrl: null,
  },
];

async function searchAccommodations({ lat, lng, checkin, checkout, maxPricePerNight }) {
  await new Promise(r => setTimeout(r, 250));

  // Sort mock hotels by proximity to requested lat/lng
  const sorted = [...MOCK_HOTELS].sort((a, b) => {
    const da = Math.hypot(a.lat - Number(lat), a.lng - Number(lng));
    const db = Math.hypot(b.lat - Number(lat), b.lng - Number(lng));
    return da - db;
  });

  const results = sorted.map(h => ({
    ...h,
    bookingUrl: `${h.bookingUrl}?checkin=${checkin}&checkout=${checkout}`,
  }));

  if (maxPricePerNight) {
    return results.filter(h => h.pricePerNight <= Number(maxPricePerNight));
  }
  return results;
}

module.exports = { searchAccommodations };
