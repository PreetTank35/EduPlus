'use client';

/**
 * RoadmapTimeline — Visual step-by-step learning path
 * 
 * Renders a vertical timeline with numbered nodes, each showing:
 * - Step title and description
 * - Estimated duration
 * - Suggested resources
 * - Milestone / learning checkpoint
 * 
 * Supports staggered fade-in animations on mount.
 * 
 * @param {Object} props
 * @param {Object} props.roadmap - Roadmap data from the API
 * @param {string} props.roadmap.topic - Topic name
 * @param {string} props.roadmap.estimatedDuration - Total duration
 * @param {Array}  props.roadmap.steps - Array of step objects
 */

const STEP_COLORS = [
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#22d3ee', // light cyan
  '#34d399', // emerald
  '#fbbf24', // amber
  '#fb7185', // rose
  '#60a5fa', // blue
];

export default function RoadmapTimeline({ roadmap }) {
  if (!roadmap || !roadmap.steps || roadmap.steps.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-[var(--color-muted)]">
          No roadmap data available. Generate one above!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto" id="roadmap-timeline">
      {/* Header */}
      <div className="text-center mb-10 animate-fade-in-up">
        <h2 className="text-2xl font-bold gradient-text mb-2">
          {roadmap.topic}
        </h2>
        <div className="flex items-center justify-center gap-4 text-sm text-[var(--color-muted)]">
          {roadmap.totalSteps && (
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {roadmap.totalSteps} Steps
            </span>
          )}
          {roadmap.estimatedDuration && (
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {roadmap.estimatedDuration}
            </span>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div
          className="absolute left-6 top-0 bottom-0 w-0.5"
          style={{
            background:
              'linear-gradient(180deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
            opacity: 0.3,
          }}
        />

        {/* Steps */}
        <div className="space-y-6">
          {roadmap.steps.map((step, index) => {
            const color = STEP_COLORS[index % STEP_COLORS.length];
            const delayClass = `delay-${(index + 1) * 100}`;

            return (
              <div
                key={step.step || index}
                className={`relative pl-16 opacity-0 animate-fade-in-up ${delayClass}`}
                id={`roadmap-step-${index + 1}`}
              >
                {/* Step number node */}
                <div
                  className="absolute left-3 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg"
                  style={{
                    background: color,
                    boxShadow: `0 0 12px ${color}40`,
                    top: '0.25rem',
                  }}
                >
                  {step.step || index + 1}
                </div>

                {/* Step card */}
                <div className="card hover:border-[var(--color-border-light)] group">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3
                      className="font-semibold text-white group-hover:text-[var(--color-accent-cyan)] transition-colors"
                    >
                      {step.title}
                    </h3>
                    {step.duration && (
                      <span
                        className="shrink-0 text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{
                          background: `${color}20`,
                          color: color,
                          border: `1px solid ${color}30`,
                        }}
                      >
                        {step.duration}
                      </span>
                    )}
                  </div>

                  {step.description && (
                    <p className="text-sm text-[var(--color-muted)] mb-3 leading-relaxed">
                      {step.description}
                    </p>
                  )}

                  {/* Resources */}
                  {step.resources && step.resources.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-medium text-[var(--color-accent-violet)] mb-1.5 uppercase tracking-wider">
                        Resources
                      </p>
                      <ul className="space-y-1">
                        {step.resources.map((resource, rIdx) => (
                          <li
                            key={rIdx}
                            className="flex items-start gap-2 text-xs text-[var(--color-muted)]"
                          >
                            <svg
                              className="w-3.5 h-3.5 mt-0.5 shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              style={{ color }}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                              />
                            </svg>
                            {resource}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Milestone */}
                  {step.milestone && (
                    <div
                      className="flex items-center gap-2 text-xs rounded-lg px-3 py-2 mt-2"
                      style={{
                        background: 'rgba(34, 197, 94, 0.08)',
                        border: '1px solid rgba(34, 197, 94, 0.2)',
                      }}
                    >
                      <svg
                        className="w-3.5 h-3.5 text-[var(--color-success)]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-[var(--color-success)]">
                        Milestone: {step.milestone}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Completion node */}
          <div className="relative pl-16 opacity-0 animate-fade-in-up delay-700">
            <div
              className="absolute left-3 w-7 h-7 rounded-full flex items-center justify-center shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #22c55e, #34d399)',
                boxShadow: '0 0 12px rgba(34, 197, 94, 0.4)',
                top: '0.25rem',
              }}
            >
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="card" style={{ borderColor: 'rgba(34, 197, 94, 0.2)' }}>
              <p className="font-semibold text-[var(--color-success)]">
                🎉 Mastery Achieved!
              </p>
              <p className="text-sm text-[var(--color-muted)] mt-1">
                You&apos;ve completed the learning path. Time to apply your knowledge!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
