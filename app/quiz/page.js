'use client';

/**
 * Quiz Page — Interactive 15-question diagnostic assessment
 * 
 * Features:
 * - Progress bar with question counter
 * - Subject badge for current question
 * - Animated card transitions between questions
 * - Option selection with visual feedback
 * - Navigation (prev/next) and direct question access
 * - On completion: POST to /api/analyze, save sessionId, redirect to dashboard
 * - Loading state during AI analysis
 */

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { questions, SUBJECTS } from '@/lib/questions';
import { v4 as uuidv4 } from 'uuid';

// Subject color mapping for badges
const SUBJECT_STYLES = {
  Mathematics: { bg: 'rgba(34,211,238,0.12)', color: '#22d3ee', border: 'rgba(34,211,238,0.25)' },
  Physics: { bg: 'rgba(167,139,250,0.12)', color: '#a78bfa', border: 'rgba(167,139,250,0.25)' },
  Chemistry: { bg: 'rgba(52,211,153,0.12)', color: '#34d399', border: 'rgba(52,211,153,0.25)' },
  Biology: { bg: 'rgba(251,191,36,0.12)', color: '#fbbf24', border: 'rgba(251,191,36,0.25)' },
  English: { bg: 'rgba(251,113,133,0.12)', color: '#fb7185', border: 'rgba(251,113,133,0.25)' },
};

// Skill type labels
const SKILL_LABELS = {
  recall: { label: 'Knowledge Recall', icon: '🧠' },
  application: { label: 'Applied Problem Solving', icon: '⚡' },
  analysis: { label: 'Critical Analysis', icon: '🔬' },
};

export default function QuizPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});      // { questionId: selectedOptionIndex }
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const progress = ((currentIndex + 1) / totalQuestions) * 100;
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === totalQuestions;

  const subjectStyle = SUBJECT_STYLES[currentQuestion.subject] || {};
  const skillInfo = SKILL_LABELS[currentQuestion.skillType] || {};

  // Select an answer
  const handleSelectAnswer = useCallback((optionIndex) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionIndex }));
  }, [currentQuestion.id]);

  // Navigate questions
  const goToQuestion = useCallback((index) => {
    if (index >= 0 && index < totalQuestions) {
      setCurrentIndex(index);
    }
  }, [totalQuestions]);

  const goNext = () => goToQuestion(currentIndex + 1);
  const goPrev = () => goToQuestion(currentIndex - 1);

  // Submit quiz for AI analysis
  const handleSubmit = async () => {
    if (!allAnswered) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const sessionId = uuidv4();

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, sessionId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Analysis failed (${response.status})`);
      }

      const result = await response.json();

      // Store results in localStorage for the dashboard
      localStorage.setItem('edupulse_session_id', sessionId);
      localStorage.setItem('edupulse_results', JSON.stringify(result));

      // Navigate to dashboard
      router.push('/dashboard');
    } catch (err) {
      console.error('Submit error:', err);
      setSubmitError(err.message || 'Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Loading / analyzing screen
  if (isSubmitting) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md animate-fade-in">
          {/* Animated spinner */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div
              className="absolute inset-0 rounded-full border-4 border-[var(--color-border)]"
            />
            <div
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-[var(--color-accent-violet)] animate-spin"
            />
            <div
              className="absolute inset-2 rounded-full border-4 border-transparent border-t-[var(--color-accent-cyan)] animate-spin"
              style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-2xl">
              🧠
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-3">
            Analyzing Your Performance
          </h2>
          <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
            Gemini AI is mapping your cognitive patterns across {SUBJECTS.length} subjects
            and identifying your unique learning profile...
          </p>

          {/* Animated steps */}
          <div className="space-y-3 text-left max-w-xs mx-auto">
            {['Scoring responses', 'Detecting patterns', 'Generating insights'].map(
              (step, i) => (
                <div
                  key={step}
                  className="flex items-center gap-3 text-sm opacity-0 animate-fade-in-up"
                  style={{ animationDelay: `${(i + 1) * 800}ms`, animationFillMode: 'forwards' }}
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{
                      background: 'rgba(139,92,246,0.15)',
                      border: '1px solid rgba(139,92,246,0.3)',
                    }}
                  >
                    <svg className="w-3 h-3 text-[var(--color-accent-violet)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[var(--color-muted)]">{step}</span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* ====== Header ====== */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Diagnostic Assessment
          </h1>
          <p className="text-sm text-[var(--color-muted)]">
            Answer all {totalQuestions} questions to receive your AI-powered cognitive analysis.
          </p>
        </div>

        {/* ====== Progress bar ====== */}
        <div className="mb-8 animate-fade-in-up" id="quiz-progress">
          <div className="flex items-center justify-between text-xs text-[var(--color-muted)] mb-2">
            <span>Question {currentIndex + 1} of {totalQuestions}</span>
            <span>{answeredCount}/{totalQuestions} answered</span>
          </div>
          <div className="h-1.5 bg-[var(--color-surface)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)',
              }}
            />
          </div>
        </div>

        {/* ====== Question card ====== */}
        <div
          className="card mb-6 animate-scale-in"
          key={currentQuestion.id} // triggers re-mount animation per question
          id={`question-card-${currentQuestion.id}`}
        >
          {/* Subject & skill badges */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{
                background: subjectStyle.bg,
                color: subjectStyle.color,
                border: `1px solid ${subjectStyle.border}`,
              }}
            >
              {currentQuestion.subject}
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-white/[0.04] text-[var(--color-muted)] border border-[var(--color-border)]">
              {skillInfo.icon} {skillInfo.label}
            </span>
          </div>

          {/* Question text */}
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-6 leading-relaxed">
            {currentQuestion.question}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, optIndex) => {
              const isSelected = answers[currentQuestion.id] === optIndex;
              return (
                <button
                  key={optIndex}
                  onClick={() => handleSelectAnswer(optIndex)}
                  id={`option-${currentQuestion.id}-${optIndex}`}
                  className={`w-full text-left px-5 py-4 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-3 group ${
                    isSelected
                      ? 'bg-[var(--color-accent-violet)]/15 border-[var(--color-accent-violet)]/50 text-white'
                      : 'bg-[var(--color-surface-light)] border-[var(--color-border)] text-[var(--color-muted)] hover:bg-[var(--color-surface-hover)] hover:text-white hover:border-[var(--color-border-light)]'
                  }`}
                  style={{
                    border: `1px solid ${
                      isSelected ? 'rgba(167,139,250,0.5)' : 'var(--color-border)'
                    }`,
                  }}
                >
                  {/* Option letter */}
                  <span
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-200 ${
                      isSelected
                        ? 'bg-[var(--color-accent-violet)] text-white'
                        : 'bg-[var(--color-surface)] text-[var(--color-muted)] group-hover:bg-[var(--color-surface-hover)]'
                    }`}
                  >
                    {String.fromCharCode(65 + optIndex)}
                  </span>
                  <span>{option}</span>
                  {/* Check mark when selected */}
                  {isSelected && (
                    <svg
                      className="w-5 h-5 ml-auto text-[var(--color-accent-violet)] shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ====== Navigation ====== */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="btn-secondary !py-2.5 !px-5 text-sm disabled:opacity-30 disabled:cursor-not-allowed"
            id="btn-prev"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>

          {currentIndex < totalQuestions - 1 ? (
            <button
              onClick={goNext}
              className="btn-primary !py-2.5 !px-5 text-sm"
              id="btn-next"
            >
              Next
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className="btn-primary !py-2.5 !px-6 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              id="btn-submit"
            >
              {allAnswered ? (
                <>
                  Submit & Analyze
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </>
              ) : (
                `Answer all questions (${answeredCount}/${totalQuestions})`
              )}
            </button>
          )}
        </div>

        {/* ====== Error display ====== */}
        {submitError && (
          <div
            className="p-4 rounded-xl text-sm mb-6 animate-fade-in"
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#fca5a5',
            }}
            id="submit-error"
          >
            <p className="font-semibold mb-1">Analysis Error</p>
            <p>{submitError}</p>
            <button
              onClick={handleSubmit}
              className="mt-2 text-xs underline hover:text-white transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {/* ====== Question navigator dots ====== */}
        <div className="flex flex-wrap items-center justify-center gap-2" id="question-navigator">
          {questions.map((q, idx) => {
            const isAnswered = answers[q.id] !== undefined;
            const isCurrent = idx === currentIndex;
            const style = SUBJECT_STYLES[q.subject] || {};

            return (
              <button
                key={q.id}
                onClick={() => goToQuestion(idx)}
                title={`Q${idx + 1}: ${q.subject}`}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  isCurrent
                    ? 'ring-2 ring-[var(--color-accent-violet)] ring-offset-2 ring-offset-[var(--color-background)]'
                    : ''
                }`}
                style={{
                  background: isAnswered ? style.bg : 'var(--color-surface)',
                  color: isAnswered ? style.color : 'var(--color-muted)',
                  border: `1px solid ${isAnswered ? style.border : 'var(--color-border)'}`,
                }}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
