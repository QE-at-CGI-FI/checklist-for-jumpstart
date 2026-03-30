-- Golf Trip Planner — PostgreSQL Schema
-- Run with: psql -U <user> -d golf_trip_planner -f schema.sql

CREATE EXTENSION IF NOT EXISTS "pgcrypto";  -- for gen_random_uuid()

-- Users
CREATE TABLE IF NOT EXISTS users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trips
CREATE TABLE IF NOT EXISTS trips (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    start_date  DATE,
    end_date    DATE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT end_after_start CHECK (end_date IS NULL OR end_date >= start_date)
);

-- Itinerary items (one row per course visit in a trip)
CREATE TABLE IF NOT EXISTS trip_itineraries (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id              UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    external_course_id   TEXT NOT NULL,       -- Google Place ID or other API ID
    course_name          TEXT NOT NULL,
    course_lat           NUMERIC(10, 7),
    course_lng           NUMERIC(10, 7),
    sequence_order       INTEGER NOT NULL DEFAULT 1,
    visit_date           DATE,
    greens_fee_estimate  NUMERIC(10, 2),      -- in user's local currency
    accommodation_name   TEXT,
    accommodation_url    TEXT,
    accommodation_cost   NUMERIC(10, 2),
    notes                TEXT,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User's bookmarked / saved courses (for quick re-use across trips)
CREATE TABLE IF NOT EXISTS course_bookmarks (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id              UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    external_course_id   TEXT NOT NULL,
    course_name          TEXT NOT NULL,
    course_data          JSONB,              -- full API payload cached for offline use
    created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_user_course UNIQUE (user_id, external_course_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_trips_user_id            ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_itineraries_trip_id      ON trip_itineraries(trip_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id        ON course_bookmarks(user_id);
