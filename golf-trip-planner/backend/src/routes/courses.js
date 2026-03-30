const express = require('express');
const { query: dbQuery } = require('../db');
const { authenticate } = require('../middleware/auth');
const { searchCourses, getCourseDetails } = require('../services/courseApiService');

const router = express.Router();

// GET /api/courses/search?location=Helsinki&radius=50&rating=4
router.get('/search', authenticate, async (req, res, next) => {
  try {
    const { location, lat, lng, radius = 50, rating } = req.query;
    if (!location && (!lat || !lng)) {
      return res.status(400).json({ error: 'Provide location or lat/lng coordinates' });
    }
    const courses = await searchCourses({ location, lat, lng, radius, minRating: rating });
    res.json({ courses });
  } catch (err) {
    next(err);
  }
});

// GET /api/courses/:id — full detail including opening hours
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const course = await getCourseDetails(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json({ course });
  } catch (err) {
    next(err);
  }
});

// POST /api/courses/bookmark — save a course to user's bookmarks
router.post('/bookmark', authenticate, async (req, res, next) => {
  try {
    const { courseId, courseName, courseData } = req.body;
    if (!courseId || !courseName) return res.status(400).json({ error: 'courseId and courseName required' });

    await dbQuery(
      `INSERT INTO course_bookmarks (user_id, external_course_id, course_name, course_data)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, external_course_id) DO NOTHING`,
      [req.userId, courseId, courseName, JSON.stringify(courseData)]
    );
    res.status(201).json({ message: 'Course bookmarked' });
  } catch (err) {
    next(err);
  }
});

// GET /api/courses/bookmarks — list user's bookmarked courses
router.get('/bookmarks', authenticate, async (req, res, next) => {
  try {
    const result = await dbQuery(
      'SELECT id, external_course_id, course_name, course_data, created_at FROM course_bookmarks WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );
    res.json({ bookmarks: result.rows });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
