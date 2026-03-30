# Golf Trip Planner

A personal web app for planning multi-course golf trips — search courses, build itineraries, track budgets, find accommodation, and check the weather forecast.

## Architecture

```
golf-trip-planner/
├── backend/          Node.js + Express REST API
│   ├── src/
│   │   ├── index.js          Entry point, middleware
│   │   ├── routes/           auth, courses, trips, accommodations
│   │   ├── services/         courseApi, mapbox, booking, weather, budget
│   │   ├── middleware/        JWT auth guard
│   │   └── db/               PostgreSQL client + schema.sql
│   └── .env.example
└── frontend/         React + Vite SPA
    └── src/
        ├── pages/            Dashboard, CourseSearch, TripDetail, Login, Register
        ├── components/       NavBar, CourseCard, ItineraryBuilder, TripSummary, WeatherWidget
        ├── context/          AuthContext (JWT storage)
        └── hooks/            useApi (all API calls)
```

## External APIs Used

| Feature                                    | API                                                                          | Free Tier           |
| ------------------------------------------ | ---------------------------------------------------------------------------- | ------------------- |
| Golf course search, ratings, opening hours | [Google Places API](https://developers.google.com/maps/documentation/places) | $200/month credit   |
| Distance & travel time between courses     | [Mapbox Matrix API](https://docs.mapbox.com/api/navigation/matrix/)          | 100K elements/month |
| Hotel search with booking links            | [Booking.com via RapidAPI](https://rapidapi.com/tipsters/api/booking-com)    | Freemium            |
| Weather forecast for trip dates            | [WeatherAPI.com](https://www.weatherapi.com/)                                | 1M calls/month      |

## Prerequisites

- Node.js 20+
- PostgreSQL 15+

## Quick Start

### 1. Database

```bash
createdb golf_trip_planner
psql -U <user> -d golf_trip_planner -f backend/src/db/schema.sql
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env — fill in API keys and DB credentials
npm install
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## API Endpoints

### Auth

- `POST /api/auth/register` — `{ email, password }`
- `POST /api/auth/login` — `{ email, password }` → `{ token }`

### Courses _(requires Bearer token)_

- `GET /api/courses/search?location=Helsinki&radius=50&rating=4`
- `GET /api/courses/:placeId`
- `POST /api/courses/bookmark`
- `GET /api/courses/bookmarks`

### Trips _(requires Bearer token)_

- `GET /api/trips`
- `POST /api/trips` — `{ name, startDate, endDate }`
- `GET /api/trips/:id` — full detail with budget, distances, weather
- `DELETE /api/trips/:id`
- `POST /api/trips/:id/itinerary` — add course
- `PATCH /api/trips/:id/itinerary/:itemId` — update fees / accommodation
- `DELETE /api/trips/:id/itinerary/:itemId`

### Accommodations _(requires Bearer token)_

- `GET /api/accommodations/search?lat=60.17&lng=24.94&checkin=2026-07-01&checkout=2026-07-03`

## Next Steps

- [ ] Add course search from inside a trip (inline, not nav to separate page)
- [ ] Map view of trip route using Mapbox GL JS
- [ ] PDF export of trip summary
- [ ] Unit tests for `budgetCalculator.js`
- [ ] E2E Playwright tests for the critical user flow
