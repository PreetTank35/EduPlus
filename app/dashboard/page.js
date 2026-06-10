'use client';

/**
 * Dashboard Page — Student Analytics Dashboard
 * 
 * Displays AI-generated analysis of quiz performance:
 * - Score overview cards (total, strongest, weakest subject)
 * - PerformanceChart (radar + bar charts)
 * - Strengths & weaknesses panels
 * - Cognitive profile summary
 * - Recommendations
 * - CTA to roadmap generator
 * 
 * Reads data from localStorage (set by quiz submission).
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PerformanceChart from '@/components/PerformanceChart';
import RoadmapTimeline from '@/components/RoadmapTimeline';

// Subject color mapping
const SUBJECT_COLORS = {
  Mathematics: '#22d3ee',
  Physics: '#a78bfa',
  Chemistry: '#34d399',
  Biology: '#fbbf24',
  English: '#fb7185',
};

export default function DashboardPage() {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mockRoadmap, setMockRoadmap] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('edupulse_results');
      if (stored) {
        const parsed = JSON.parse(stored);
        setResults(parsed);
        
        // Generate a mock roadmap timeline based on weakest subject
        const subjectEntries = Object.entries(parsed.scores?.subjectScores || {});
        const sorted = [...subjectEntries].sort((a, b) => b[1].percentage - a[1].percentage);
        const weakest = sorted[sorted.length - 1];
        
        if (weakest) {
          setMockRoadmap({
            topic: `Mastering ${weakest[0]} Fundamentals`,
            difficulty: 'Targeted Remediation',
            milestones: [
              {
                title: `Phase 1: ${weakest[0]} Core Concepts`,
                description: `Rebuild foundational knowledge gaps identified in the diagnostic assessment. Focus heavily on basic recall and structure.`,
                resources: [`NCERT ${weakest[0]} Base Text`, 'Concept Video Lectures']
              },
              {
                title: 'Phase 2: Applied Problem Solving',
                description: 'Translate theoretical knowledge into actionable problem solving. Bridge the gap between understanding and execution.',
                resources: ['Practice Question Bank', 'Step-by-step Solution Guides']
              },
              {
                title: 'Phase 3: Advanced Analysis & Mastery',
                description: 'Tackle complex, multi-variable problems to build critical analysis skills and ensure exam-readiness.',
                resources: ['Mock Assessments', 'Previous Year Papers']
              }
            ]
          });
        }
        
      } else {
        setError('No assessment data found. Please take the quiz first.');
      }
    } catch (err) {
      setError('Failed to load assessment data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="skeleton h-8 w-64 mb-4" />
          <div className="skeleton h-4 w-96 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-32 rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="skeleton h-80 rounded-xl" />
            <div className="skeleton h-80 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (error || !results) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md animate-fade-in">
          <div className="text-6xl mb-6">📊</div>
          <h2 className="text-2xl font-bold text-white mb-3">
            No Assessment Data
          </h2>
          <p className="text-[var(--color-muted)] mb-8">
            {error || 'Take the diagnostic quiz first to see your analytics dashboard.'}
          </p>
          <Link href="/quiz" className="btn-primary" id="dashboard-take-quiz">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Take Assessment
          </Link>
        </div>
      </div>
    );
  }

  const { scores, analysis } = results;

  // Compute strongest and weakest subjects
  const subjectEntries = Object.entries(scores?.subjectScores || {});
  const sorted = [...subjectEntries].sort((a, b) => b[1].percentage - a[1].percentage);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* ====== Header ====== */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Your Analytics Dashboard
          </h1>
          <p className="text-sm text-[var(--color-muted)]">
            AI-powered cognitive performance analysis across {subjectEntries.length} subjects
          </p>
        </div>

        {/* ====== Score overview cards ====== */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* Total Score */}
          <div className="card animate-fade-in-up gradient-border" id="card-total-score">
            <p className="text-xs text-[var(--color-muted)] mb-1 uppercase tracking-wider font-medium">
              Overall Score
            </p>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold gradient-text">
                {scores?.overallPercentage ?? 0}%
              </span>
              <span className="text-sm text-[var(--color-muted)] mb-1">
                ({scores?.totalCorrect}/{scores?.totalQuestions})
              </span>
            </div>
          </div>

          {/* Strongest subject */}
          {strongest && (
            <div className="card animate-fade-in-up delay-100" id="card-strongest">
              <p className="text-xs text-[var(--color-muted)] mb-1 uppercase tracking-wider font-medium">
                Strongest Subject
              </p>
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ background: SUBJECT_COLORS[strongest[0]] }}
                />
                <span className="text-xl font-bold text-white">
                  {strongest[0]}
                </span>
              </div>
              <p className="text-sm mt-1" style={{ color: SUBJECT_COLORS[strongest[0]] }}>
                {strongest[1].percentage}% — {strongest[1].correct}/{strongest[1].total} correct
              </p>
            </div>
          )}

          {/* Weakest subject */}
          {weakest && (
            <div className="card animate-fade-in-up delay-200" id="card-weakest">
              <p className="text-xs text-[var(--color-muted)] mb-1 uppercase tracking-wider font-medium">
                Needs Improvement
              </p>
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ background: SUBJECT_COLORS[weakest[0]] }}
                />
                <span className="text-xl font-bold text-white">
                  {weakest[0]}
                </span>
              </div>
              <p className="text-sm mt-1" style={{ color: SUBJECT_COLORS[weakest[0]] }}>
                {weakest[1].percentage}% — {weakest[1].correct}/{weakest[1].total} correct
              </p>
            </div>
          )}
        </div>

        {/* ====== Charts ====== */}
        {scores && (
          <div className="mb-8">
            <PerformanceChart
              subjectScores={scores.subjectScores}
              skillScores={scores.skillScores}
            />
          </div>
        )}

        {/* ====== AI Analysis panels ====== */}
        {analysis && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Strengths */}
            <div className="card animate-fade-in-up" id="panel-strengths">
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    background: 'rgba(34,197,94,0.12)',
                    border: '1px solid rgba(34,197,94,0.25)',
                  }}
                >
                  <svg className="w-4 h-4 text-[var(--color-success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">Strengths</h3>
              </div>
              <ul className="space-y-2.5">
                {(analysis.strengths || []).map((s, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--color-muted)]">
                    <span className="text-[var(--color-success)] mt-0.5 shrink-0">✓</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="card animate-fade-in-up delay-200" id="panel-weaknesses">
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    background: 'rgba(251,113,133,0.12)',
                    border: '1px solid rgba(251,113,133,0.25)',
                  }}
                >
                  <svg className="w-4 h-4 text-[var(--color-accent-rose)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">Areas for Growth</h3>
              </div>
              <ul className="space-y-2.5">
                {(analysis.weaknesses || []).map((w, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--color-muted)]">
                    <span className="text-[var(--color-accent-rose)] mt-0.5 shrink-0">→</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ====== Cognitive Profile ====== */}
        {analysis?.cognitiveProfile && (
          <div className="card mb-8 animate-fade-in-up" id="panel-cognitive-profile">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: 'rgba(139,92,246,0.12)',
                  border: '1px solid rgba(139,92,246,0.25)',
                }}
              >
                <span className="text-base">🧠</span>
              </div>
              <h3 className="text-lg font-semibold text-white">Cognitive Profile</h3>
            </div>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed">
              {analysis.cognitiveProfile}
            </p>
          </div>
        )}

        {/* ====== Recommendations ====== */}
        {analysis?.recommendations && analysis.recommendations.length > 0 && (
          <div className="card mb-8 animate-fade-in-up" id="panel-recommendations">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: 'rgba(96,165,250,0.12)',
                  border: '1px solid rgba(96,165,250,0.25)',
                }}
              >
                <svg className="w-4 h-4 text-[var(--color-accent-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Recommendations</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {analysis.recommendations.map((rec, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 text-sm p-3 rounded-lg"
                  style={{
                    background: 'rgba(96,165,250,0.06)',
                    border: '1px solid rgba(96,165,250,0.12)',
                  }}
                >
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                    style={{
                      background: 'rgba(96,165,250,0.2)',
                      color: '#60a5fa',
                    }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-[var(--color-muted)]">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ====== Dynamic Timeline UI based on Performance Gaps ====== */}
        {mockRoadmap && (
          <div className="mb-12 animate-fade-in-up delay-300">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[var(--color-accent-saffron)]/20 border border-[var(--color-accent-saffron)]/40 text-[var(--color-accent-saffron)]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Personalized Learning Path</h3>
            </div>
            <RoadmapTimeline roadmap={mockRoadmap} />
          </div>
        )}

        {/* ====== CTA to Roadmap ====== */}
        <div className="text-center py-8 animate-fade-in-up">
          <h3 className="text-xl font-bold text-white mb-3">
            Ready for a Personalized Learning Path?
          </h3>
          <p className="text-sm text-[var(--color-muted)] mb-6 max-w-md mx-auto">
            Generate a custom roadmap based on your weak areas, or explore any topic you want to master.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/roadmap" className="btn-primary" id="dashboard-cta-roadmap">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Generate Custom Roadmap
            </Link>
            <Link href="/quiz" className="btn-secondary" id="dashboard-retake">
              Retake Assessment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
