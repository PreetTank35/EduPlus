'use client';

/**
 * PerformanceChart — Interactive data visualization
 * 
 * Renders two charts:
 * 1. Radar chart: Performance across 5 subjects
 * 2. Bar chart: Performance by cognitive skill type (recall/application/analysis)
 * 
 * Uses Recharts with custom themed colors matching the EduPulse design system.
 * 
 * @param {Object} props
 * @param {Object} props.subjectScores - Scores keyed by subject name
 * @param {Object} props.skillScores - Scores keyed by skill type
 */

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

// Color mapping for subjects
const SUBJECT_COLORS = {
  Mathematics: '#22d3ee',
  Physics: '#a78bfa',
  Chemistry: '#34d399',
  Biology: '#fbbf24',
  English: '#fb7185',
};

// Color mapping for skill types
const SKILL_COLORS = {
  recall: '#60a5fa',
  application: '#a78bfa',
  analysis: '#22d3ee',
};

// Custom tooltip styling
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="glass rounded-lg px-4 py-2.5 shadow-lg">
      <p className="text-sm font-semibold text-white mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-xs" style={{ color: entry.color || '#94a3b8' }}>
          Score: {entry.value}%
        </p>
      ))}
    </div>
  );
}

export default function PerformanceChart({ subjectScores, skillScores }) {
  // Transform subject data for radar chart
  const radarData = Object.entries(subjectScores || {}).map(([subject, data]) => ({
    subject: subject.substring(0, 4), // Shortened label for radar
    fullName: subject,
    percentage: data.percentage,
    score: `${data.correct}/${data.total}`,
  }));

  // Transform skill data for bar chart
  const barData = Object.entries(skillScores || {}).map(([skill, data]) => ({
    skill: skill.charAt(0).toUpperCase() + skill.slice(1),
    percentage: data.percentage,
    score: `${data.correct}/${data.total}`,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Radar Chart — Subject Performance */}
      <div className="card animate-fade-in-up" id="subject-radar-chart">
        <h3 className="text-lg font-semibold text-white mb-1">
          Subject Performance
        </h3>
        <p className="text-xs text-[var(--color-muted)] mb-4">
          Cross-subject diagnostic radar
        </p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: '#64748b', fontSize: 10 }}
                axisLine={false}
              />
              <Radar
                name="Score"
                dataKey="percentage"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.25}
                strokeWidth={2}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        {/* Subject legend */}
        <div className="flex flex-wrap gap-3 mt-2 justify-center">
          {Object.entries(subjectScores || {}).map(([subject, data]) => (
            <div key={subject} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: SUBJECT_COLORS[subject] }}
              />
              <span className="text-xs text-[var(--color-muted)]">
                {subject}: {data.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bar Chart — Cognitive Skill Breakdown */}
      <div className="card animate-fade-in-up delay-200" id="skill-bar-chart">
        <h3 className="text-lg font-semibold text-white mb-1">
          Cognitive Skills
        </h3>
        <p className="text-xs text-[var(--color-muted)] mb-4">
          Performance by thinking type
        </p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} barCategoryGap="30%">
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.06)"
                vertical={false}
              />
              <XAxis
                dataKey="skill"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="percentage"
                radius={[8, 8, 0, 0]}
                maxBarSize={60}
              >
                {barData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      Object.values(SKILL_COLORS)[index] || '#6366f1'
                    }
                    fillOpacity={0.8}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Skill legend */}
        <div className="flex flex-wrap gap-4 mt-2 justify-center">
          {barData.map((item, idx) => (
            <div key={item.skill} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  background: Object.values(SKILL_COLORS)[idx],
                }}
              />
              <span className="text-xs text-[var(--color-muted)]">
                {item.skill}: {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
