/**
 * Gemini AI Client Configuration
 * 
 * Initializes the Google Generative AI SDK for use in API routes.
 * Uses the gemini-2.0-flash model for fast, structured JSON responses.
 */

import { GoogleGenAI } from '@google/genai';

// Validate API key at import time so we fail fast with a clear message
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn(
    '⚠️  GEMINI_API_KEY is not set. AI features will return fallback responses. ' +
    'Add your key to .env.local to enable Gemini integration.'
  );
}

/**
 * Configured GoogleGenAI client instance.
 * Will be null if the API key is not set.
 */
export const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

/**
 * Default model identifier used throughout the application.
 * gemini-2.0-flash provides fast responses with structured output support.
 */
export const MODEL_ID = 'gemini-2.0-flash';
