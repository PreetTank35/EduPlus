'use client';

/**
 * Roadmap Page — Custom Learning Path Generator
 * 
 * Features:
 * - Topic input with difficulty selector
 * - Pre-filled suggestion chips from dashboard weaknesses
 * - Loading animation during generation
 * - Interactive RoadmapTimeline component for results
 * - Ability to generate new roadmaps
 */

import { useState, useEffect } from 'react';
import RoadmapTimeline from '@/components/RoadmapTimeline';

const DIFFICULTY_OPTIONS = [
  { value: 'beginner', label: 'Beginner', icon: '🌱', desc: 'Start from scratch' },
  { value: 'intermediate', label: 'Intermediate', icon: '📚', desc: 'Some prior knowledge' },
  { value: 'advanced', label: 'Advanced', icon: '🚀', desc: 'Deep dive & mastery' },
];

// Default suggestion topics
const DEFAULT_SUGGESTIONS = [
  'Calculus Fundamentals',
  'Organic Chemistry',
  'Quantum Mechanics',
  'Cell Biology',
  'English Grammar',
];

export default function RoadmapPage() {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [roadmap, setRoadmap] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState(DEFAULT_SUGGESTIONS);

  // Load weakness-based suggestions from dashboard data
  useEffect(() => {
    try {
      const stored = localStorage.getItem('edupulse_results');
      if (stored) {
        const data = JSON.parse(stored);
        const weaknesses = data?.analysis?.weaknesses;
        if (weaknesses && weaknesses.length > 0) {
          // Use first 3 weaknesses as suggestions, plus 2 defaults
          const weakSuggestions = weaknesses.slice(0, 3).map((w) => {
            // Try to extract a topic name from the weakness string
            return w.length > 50 ? w.substring(0, 50) + '...' : w;
          });
          setSuggestions([...weakSuggestions, ...DEFAULT_SUGGESTIONS.slice(0, 2)]);
        }
      }
    } catch {
      // Ignore parse errors, use defaults
    }
  }, []);

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setIsGenerating(true);
    setError(null);
    setRoadmap(null);

    try {
      const sessionId = localStorage.getItem('edupulse_session_id') || null;

      const response = await fetch('/api/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          difficulty,
          sessionId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Generation failed (${response.status})`);
      }

      const data = await response.json();
      setRoadmap(data.roadmap);
    } catch (err) {
      console.error('Roadmap generation error:', err);
      setError(err.message || 'Failed to generate roadmap. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && topic.trim() && !isGenerating) {
      handleGenerate();
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* ====== Header ====== */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Learning Roadmap Generator
          </h1>
          <p className="text-sm text-[var(--color-muted)]">
            Enter any topic and get an AI-generated, step-by-step learning path with resources and milestones.
          </p>
        </div>

        {/* ====== Input Form ====== */}
        <div className="card mb-8 animate-fade-in-up" id="roadmap-form">
          {/* Topic input */}
          <label className="block mb-4">
            <span className="text-sm font-medium text-white mb-2 block">
              What do you want to learn?
            </span>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g., Calculus Fundamentals, Organic Chemistry, Machine Learning..."
              className="w-full px-4 py-3 rounded-xl text-sm bg-[var(--color-surface-light)] text-white placeholder-[var(--color-muted)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-accent-violet)] focus:ring-1 focus:ring-[var(--color-accent-violet)]/30 transition-all"
              id="roadmap-topic-input"
            />
          </label>

          {/* Suggestion chips */}
          <div className="flex flex-wrap gap-2 mb-6">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => setTopic(s)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--color-muted)] bg-white/[0.04] border border-[var(--color-border)] hover:border-[var(--color-accent-violet)] hover:text-white hover:bg-[var(--color-accent-violet)]/10 transition-all"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Difficulty selector */}
          <div className="mb-6">
            <span className="text-sm font-medium text-white mb-3 block">
              Difficulty Level
            </span>
            <div className="grid grid-cols-3 gap-3">
              {DIFFICULTY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setDifficulty(opt.value)}
                  id={`difficulty-${opt.value}`}
                  className={`p-3 rounded-xl text-center transition-all duration-200 ${
                    difficulty === opt.value
                      ? 'bg-[var(--color-accent-violet)]/15 border-[var(--color-accent-violet)]/50'
                      : 'bg-[var(--color-surface-light)] border-[var(--color-border)] hover:border-[var(--color-border-light)]'
                  }`}
                  style={{
                    border: `1px solid ${
                      difficulty === opt.value
                        ? 'rgba(167,139,250,0.5)'
                        : 'var(--color-border)'
                    }`,
                  }}
                >
                  <div className="text-xl mb-1">{opt.icon}</div>
                  <div
                    className={`text-sm font-semibold ${
                      difficulty === opt.value
                        ? 'text-white'
                        : 'text-[var(--color-muted)]'
                    }`}
                  >
                    {opt.label}
                  </div>
                  <div className="text-[10px] text-[var(--color-muted)] mt-0.5">
                    {opt.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={!topic.trim() || isGenerating}
            className="btn-primary w-full !py-3.5"
            id="btn-generate-roadmap"
          >
            {isGenerating ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating Roadmap...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Generate Learning Path
              </>
            )}
          </button>
        </div>

        {/* ====== Error ====== */}
        {error && (
          <div
            className="p-4 rounded-xl text-sm mb-8 animate-fade-in"
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#fca5a5',
            }}
            id="roadmap-error"
          >
            <p className="font-semibold mb-1">Generation Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* ====== Loading state ====== */}
        {isGenerating && (
          <div className="text-center py-16 animate-fade-in">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-[var(--color-border)]" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[var(--color-accent-emerald)] animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-2xl">
                🗺️
              </div>
            </div>
            <p className="text-[var(--color-muted)]">
              Crafting your personalized learning path...
            </p>
          </div>
        )}

        {/* ====== Results ====== */}
        {roadmap && !isGenerating && (
          <div className="animate-fade-in-up">
            <RoadmapTimeline roadmap={roadmap} />

            {/* Generate another */}
            <div className="text-center mt-12">
              <button
                onClick={() => {
                  setRoadmap(null);
                  setTopic('');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="btn-secondary"
                id="btn-new-roadmap"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Generate Another Roadmap
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
