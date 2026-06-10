-- ===========================================
-- EduPulse AI — Supabase Database Schema
-- ===========================================
-- Run this SQL in the Supabase SQL Editor to create the required tables.
-- Dashboard → SQL Editor → New Query → Paste & Run

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------
-- Table: assessments
-- Stores quiz results and AI-generated analysis
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  answers JSONB NOT NULL,           -- Raw student answers: { "1": 0, "2": 2, ... }
  scores JSONB NOT NULL,            -- Computed scores by subject and skill type
  ai_analysis JSONB,                -- Full Gemini-generated analysis object
  total_correct INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  overall_percentage INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast session lookups
CREATE INDEX IF NOT EXISTS idx_assessments_session_id ON assessments (session_id);

-- -----------------------------------------------
-- Table: roadmaps
-- Stores AI-generated learning path roadmaps
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT,                  -- Optional: links to an assessment session
  topic TEXT NOT NULL,              -- User-requested topic
  difficulty TEXT DEFAULT 'intermediate',
  roadmap JSONB NOT NULL,           -- Full Gemini-generated roadmap object
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for session lookups
CREATE INDEX IF NOT EXISTS idx_roadmaps_session_id ON roadmaps (session_id);

-- -----------------------------------------------
-- Row Level Security (RLS) - Disabled for MVP
-- -----------------------------------------------
-- For production, enable RLS and create policies:
-- ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;
-- 
-- Example policy (allow all reads/writes for anon key):
-- CREATE POLICY "Allow all" ON assessments FOR ALL USING (true);
-- CREATE POLICY "Allow all" ON roadmaps FOR ALL USING (true);
