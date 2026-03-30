const express = require('express');
const { body, validationResult } = require('express-validator');
const { query: dbQuery } = require('../db');
const { authenticate } = require('../middleware/auth');
const { calculateDistances } = require('../services/mapboxService');
const { calculateBudget } = require('../services/budgetCalculator');
const { getWeatherForecast } = require('../services/weatherService');

const router = express.Router();

// GET /api/trips — list user's trips
router.get('/', authenticate, async (req, res, next) => {
  try {
    const result = await dbQuery(
      'SELECT id, name, start_date, end_date, created_at FROM trips WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );
    res.json({ trips: result.rows });
  } catch (err) {
    next(err);
  }
});

// POST /api/trips — create a new trip
router.post('/',
  authenticate,
  body('name').trim().notEmpty(),
  body('startDate').isISO8601(),
  body('endDate').isISO8601(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { name, startDate, endDate } = req.body;
      const result = await dbQuery(
        'INSERT INTO trips (user_id, name, start_date, end_date) VALUES ($1, $2, $3, $4) RETURNING id, name, start_date, end_date',
        [req.userId, name, startDate, endDate]
      );
      res.status(201).json({ trip: result.rows[0] });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/trips/:id — trip detail with itinerary, distances, budget & weather
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const tripResult = await dbQuery(
      'SELECT id, name, start_date, end_date FROM trips WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId]
    );
    if (!tripResult.rows.length) return res.status(404).json({ error: 'Trip not found' });
    const trip = tripResult.rows[0];

    const itineraryResult = await dbQuery(
      `SELECT ti.id, ti.sequence_order, ti.greens_fee_estimate, ti.notes,
              ti.external_course_id, ti.course_name, ti.course_lat, ti.course_lng,
              ti.accommodation_name, ti.accommodation_url, ti.accommodation_cost,
              ti.visit_date
       FROM trip_itineraries ti WHERE ti.trip_id = $1 ORDER BY ti.sequence_order ASC`,
      [trip.id]
    );
    const itinerary = itineraryResult.rows;

    // Calculate distances between courses if coordinates are available
    const coordPoints = itinerary
      .filter(i => i.course_lat && i.course_lng)
      .map(i => ({ lng: parseFloat(i.course_lng), lat: parseFloat(i.course_lat) }));
    const distances = coordPoints.length > 1 ? await calculateDistances(coordPoints) : [];

    // Weather forecast for first course location
    let weather = null;
    if (itinerary[0]?.course_lat && trip.start_date) {
      weather = await getWeatherForecast(itinerary[0].course_lat, itinerary[0].course_lng, trip.start_date);
    }

    const budget = calculateBudget(itinerary);

    res.json({ trip: { ...trip, itinerary, distances, budget, weather } });
  } catch (err) {
    next(err);
  }
});

// POST /api/trips/:id/itinerary — add a course to a trip
router.post('/:id/itinerary',
  authenticate,
  body('externalCourseId').notEmpty(),
  body('courseName').trim().notEmpty(),
  body('visitDate').isISO8601(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      // Verify trip ownership
      const tripResult = await dbQuery('SELECT id FROM trips WHERE id = $1 AND user_id = $2', [req.params.id, req.userId]);
      if (!tripResult.rows.length) return res.status(404).json({ error: 'Trip not found' });

      // Determine next sequence order
      const orderResult = await dbQuery(
        'SELECT COALESCE(MAX(sequence_order), 0) + 1 AS next_order FROM trip_itineraries WHERE trip_id = $1',
        [req.params.id]
      );
      const nextOrder = orderResult.rows[0].next_order;

      const { externalCourseId, courseName, courseLat, courseLng, greensFeeEstimate, notes, visitDate } = req.body;
      const result = await dbQuery(
        `INSERT INTO trip_itineraries
           (trip_id, external_course_id, course_name, course_lat, course_lng,
            greens_fee_estimate, notes, sequence_order, visit_date)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING id, sequence_order, course_name, visit_date`,
        [req.params.id, externalCourseId, courseName, courseLat, courseLng, greensFeeEstimate, notes, nextOrder, visitDate]
      );
      res.status(201).json({ itineraryItem: result.rows[0] });
    } catch (err) {
      next(err);
    }
  }
);

// PATCH /api/trips/:id/itinerary/:itemId — update accommodation or fee for an itinerary item
router.patch('/:id/itinerary/:itemId', authenticate, async (req, res, next) => {
  try {
    const tripResult = await dbQuery('SELECT id FROM trips WHERE id = $1 AND user_id = $2', [req.params.id, req.userId]);
    if (!tripResult.rows.length) return res.status(404).json({ error: 'Trip not found' });

    const { accommodationName, accommodationUrl, accommodationCost, greensFeeEstimate, notes } = req.body;
    await dbQuery(
      `UPDATE trip_itineraries SET
         accommodation_name = COALESCE($1, accommodation_name),
         accommodation_url  = COALESCE($2, accommodation_url),
         accommodation_cost = COALESCE($3, accommodation_cost),
         greens_fee_estimate= COALESCE($4, greens_fee_estimate),
         notes              = COALESCE($5, notes)
       WHERE id = $6 AND trip_id = $7`,
      [accommodationName, accommodationUrl, accommodationCost, greensFeeEstimate, notes, req.params.itemId, req.params.id]
    );
    res.json({ message: 'Updated' });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/trips/:id/itinerary/:itemId
router.delete('/:id/itinerary/:itemId', authenticate, async (req, res, next) => {
  try {
    const tripResult = await dbQuery('SELECT id FROM trips WHERE id = $1 AND user_id = $2', [req.params.id, req.userId]);
    if (!tripResult.rows.length) return res.status(404).json({ error: 'Trip not found' });

    await dbQuery('DELETE FROM trip_itineraries WHERE id = $1 AND trip_id = $2', [req.params.itemId, req.params.id]);
    res.json({ message: 'Course removed from itinerary' });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/trips/:id
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const result = await dbQuery('DELETE FROM trips WHERE id = $1 AND user_id = $2 RETURNING id', [req.params.id, req.userId]);
    if (!result.rows.length) return res.status(404).json({ error: 'Trip not found' });
    res.json({ message: 'Trip deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
