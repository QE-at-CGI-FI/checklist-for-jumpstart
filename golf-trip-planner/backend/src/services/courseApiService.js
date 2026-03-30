/**
 * Golf Course API Service — MOCK
 *
 * Returns realistic mock golf course data so the app runs without API keys.
 * Replace this file's implementation with the real Google Places API calls
 * (see .env.example) when you have a GOOGLE_PLACES_API_KEY.
 */

const MOCK_COURSES = [
  {
    id: 'mock-course-1',
    name: 'Royal Helsinki Golf Club',
    rating: 4.7,
    ratingCount: 312,
    address: 'Tali, Helsinki, Finland',
    lat: 60.2052,
    lng: 24.8686,
    openingHours: [
      'Monday: 7:00 AM – 8:00 PM',
      'Tuesday: 7:00 AM – 8:00 PM',
      'Wednesday: 7:00 AM – 8:00 PM',
      'Thursday: 7:00 AM – 8:00 PM',
      'Friday: 7:00 AM – 8:00 PM',
      'Saturday: 6:30 AM – 8:00 PM',
      'Sunday: 6:30 AM – 8:00 PM',
    ],
    isOpenNow: true,
    website: 'https://www.rhgc.fi',
    phone: '+358 9 123 4567',
    priceLevel: 3,
  },
  {
    id: 'mock-course-2',
    name: 'Espoo Golf',
    rating: 4.4,
    ratingCount: 198,
    address: 'Mankkaanlaaksontie, Espoo, Finland',
    lat: 60.1756,
    lng: 24.7297,
    openingHours: [
      'Monday: 8:00 AM – 7:00 PM',
      'Tuesday: 8:00 AM – 7:00 PM',
      'Wednesday: 8:00 AM – 7:00 PM',
      'Thursday: 8:00 AM – 7:00 PM',
      'Friday: 8:00 AM – 7:00 PM',
      'Saturday: 7:00 AM – 7:00 PM',
      'Sunday: 7:00 AM – 7:00 PM',
    ],
    isOpenNow: true,
    website: 'https://www.espoogolf.fi',
    phone: '+358 9 876 5432',
    priceLevel: 2,
  },
  {
    id: 'mock-course-3',
    name: 'Vantaa Golf',
    rating: 4.2,
    ratingCount: 145,
    address: 'Ilmakentäntie 7, Vantaa, Finland',
    lat: 60.3172,
    lng: 25.0037,
    openingHours: [
      'Monday: 8:00 AM – 6:00 PM',
      'Tuesday: 8:00 AM – 6:00 PM',
      'Wednesday: 8:00 AM – 6:00 PM',
      'Thursday: 8:00 AM – 6:00 PM',
      'Friday: 8:00 AM – 6:00 PM',
      'Saturday: 7:30 AM – 6:00 PM',
      'Sunday: 7:30 AM – 6:00 PM',
    ],
    isOpenNow: false,
    website: 'https://www.vantaagolf.fi',
    phone: '+358 9 234 5678',
    priceLevel: 2,
  },
  {
    id: 'mock-course-4',
    name: 'Tallink Golf Tallinn',
    rating: 4.5,
    ratingCount: 267,
    address: 'Laagri, Saue Parish, Estonia',
    lat: 59.3378,
    lng: 24.6310,
    openingHours: [
      'Monday: 7:00 AM – 9:00 PM',
      'Tuesday: 7:00 AM – 9:00 PM',
      'Wednesday: 7:00 AM – 9:00 PM',
      'Thursday: 7:00 AM – 9:00 PM',
      'Friday: 7:00 AM – 9:00 PM',
      'Saturday: 6:00 AM – 9:00 PM',
      'Sunday: 6:00 AM – 9:00 PM',
    ],
    isOpenNow: true,
    website: 'https://www.tallinkgolf.ee',
    phone: '+372 600 1234',
    priceLevel: 2,
  },
  {
    id: 'mock-course-5',
    name: 'Fiskars Village Golf',
    rating: 4.8,
    ratingCount: 89,
    address: 'Fiskars, Raasepori, Finland',
    lat: 60.1070,
    lng: 23.5210,
    openingHours: [
      'Monday: Closed',
      'Tuesday: 9:00 AM – 6:00 PM',
      'Wednesday: 9:00 AM – 6:00 PM',
      'Thursday: 9:00 AM – 6:00 PM',
      'Friday: 9:00 AM – 6:00 PM',
      'Saturday: 8:00 AM – 7:00 PM',
      'Sunday: 8:00 AM – 7:00 PM',
    ],
    isOpenNow: false,
    website: 'https://www.fiskarsgolf.fi',
    phone: '+358 19 277 7100',
    priceLevel: 3,
  },
  {
    id: 'mock-course-6',
    name: 'Pickala Golf',
    rating: 4.3,
    ratingCount: 201,
    address: 'Pickala, Siuntio, Finland',
    lat: 60.1293,
    lng: 24.2194,
    openingHours: [
      'Monday: 8:00 AM – 7:00 PM',
      'Tuesday: 8:00 AM – 7:00 PM',
      'Wednesday: 8:00 AM – 7:00 PM',
      'Thursday: 8:00 AM – 7:00 PM',
      'Friday: 8:00 AM – 7:00 PM',
      'Saturday: 7:00 AM – 7:00 PM',
      'Sunday: 7:00 AM – 7:00 PM',
    ],
    isOpenNow: true,
    website: 'https://www.pickala.fi',
    phone: '+358 19 266 3400',
    priceLevel: 2,
  },
];

async function searchCourses({ location, lat, lng, radius = 50, minRating }) {
  // Simulate network delay
  await delay(300);

  // Filter by location keyword if provided (simple substring match on address/name)
  const keyword = (location || '').toLowerCase();
  let results = keyword
    ? MOCK_COURSES.filter(c =>
        c.name.toLowerCase().includes(keyword) ||
        c.address.toLowerCase().includes(keyword)
      )
    : MOCK_COURSES;

  // Filter by minimum rating
  if (minRating) results = results.filter(c => c.rating >= Number(minRating));

  // Return summary shape (no openingHours in list view)
  return results.map(({ openingHours, isOpenNow, website, phone, priceLevel, ...summary }) => summary);
}

async function getCourseDetails(courseId) {
  await delay(200);
  return MOCK_COURSES.find(c => c.id === courseId) || null;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = { searchCourses, getCourseDetails };
