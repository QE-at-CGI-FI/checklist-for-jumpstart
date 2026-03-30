const express = require('express');
const { authenticate } = require('../middleware/auth');
const { searchAccommodations } = require('../services/bookingService');

const router = express.Router();

// GET /api/accommodations/search?lat=60.17&lng=24.94&checkin=2026-07-01&checkout=2026-07-03
router.get('/search', authenticate, async (req, res, next) => {
  try {
    const { lat, lng, checkin, checkout, maxPricePerNight } = req.query;
    if (!lat || !lng || !checkin || !checkout) {
      return res.status(400).json({ error: 'lat, lng, checkin, and checkout are required' });
    }
    const hotels = await searchAccommodations({ lat, lng, checkin, checkout, maxPricePerNight });
    res.json({ hotels });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
