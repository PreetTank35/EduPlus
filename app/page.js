import Link from 'next/link';
import Image from 'next/image';

/**
 * Landing Page — Marketing / Pitch page
 * 
 * Showcases EduPulse AI with:
 * - Hero section with gradient headline and CTA
 * - Features grid with animated cards
 * - How it Works flow
 * - Stats section
 * - Footer
 */

// Feature cards data
const FEATURES = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'AI Pattern Recognition',
    description:
      'Our Gemini-powered engine analyzes how you think — identifying systemic cognitive patterns across subjects, not just right or wrong answers.',
    color: '#8b5cf6',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Cross-Subject Analytics',
    description:
      'Visualize strengths and weaknesses across Mathematics, Physics, Chemistry, Biology, and English with interactive radar and bar charts.',
    color: '#22d3ee',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    title: 'Dynamic Learning Paths',
    description:
      'Get structured, multi-step roadmaps tailored to your performance profile. Each path includes resources, milestones, and time estimates.',
    color: '#34d399',
  },
];

// How it Works steps
const STEPS = [
  {
    num: '01',
    title: 'Take the Assessment',
    desc: '15 diagnostic questions across 5 subjects, testing recall, application, and analysis skills.',
    color: '#6366f1',
  },
  {
    num: '02',
    title: 'Get AI Analysis',
    desc: 'Gemini AI processes your performance to identify cognitive patterns, strengths, and root-cause gaps.',
    color: '#8b5cf6',
  },
  {
    num: '03',
    title: 'Follow Your Roadmap',
    desc: 'Receive a personalized, step-by-step learning path with resources and milestones to master weak areas.',
    color: '#06b6d4',
  },
];

// Stats
const STATS = [
  { value: '5', label: 'Subjects Covered' },
  { value: '< 10s', label: 'Analysis Speed' },
  { value: '3', label: 'Cognitive Dimensions' },
  { value: '∞', label: 'Custom Roadmaps' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* ======================== HERO SECTION ======================== */}
      <section
        id="hero"
        className="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden"
      >
        {/* Background decorative elements */}
        <div
          className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-10 blur-3xl animate-float"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }}
        />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-10 blur-3xl animate-float"
          style={{ background: 'radial-gradient(circle, #06b6d4, transparent)', animationDelay: '1.5s' }}
        />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-8 animate-fade-in-down border border-[var(--color-border)]" style={{ background: 'rgba(99,102,241,0.1)' }}>
            <span className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse" />
            AI-Powered Educational Analytics
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 animate-fade-in-up tracking-tight">
            Discover{' '}
            <span className="gradient-text">How You Think</span>
            <br />
            Not Just What You Know
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-[var(--color-muted)] max-w-2xl mx-auto mb-10 animate-fade-in-up delay-200 leading-relaxed">
            EduPulse AI uses diagnostic assessments and Gemini AI to map your
            cognitive strengths, pinpoint root-cause academic gaps, and generate
            personalized learning roadmaps — all in under 10 seconds.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
            <Link href="/quiz" id="hero-cta-primary" className="btn-primary text-base !px-8 !py-3.5">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Start Free Assessment
            </Link>
            <Link href="/dashboard" id="hero-cta-secondary" className="btn-secondary text-base !px-8 !py-3.5">
              View Demo Dashboard
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="mt-20 animate-fade-in delay-500">
            <div className="flex flex-col items-center gap-2 text-[var(--color-muted)]">
              <span className="text-xs">Scroll to explore</span>
              <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ======================== FEATURES SECTION ======================== */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Intelligent Assessment, <span className="gradient-text">Actionable Insights</span>
            </h2>
            <p className="text-[var(--color-muted)] max-w-xl mx-auto">
              Built on diagnostic methodologies from high-literacy nations, powered by Google Gemini AI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((feature, idx) => (
              <div
                key={feature.title}
                id={`feature-card-${idx}`}
                className="card group hover:scale-[1.02] transition-transform duration-300"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: `${feature.color}15`,
                    color: feature.color,
                    boxShadow: `0 0 0 1px ${feature.color}25`,
                  }}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================== HOW IT WORKS SECTION ======================== */}
      <section id="how-it-works" className="py-24 px-4" style={{ background: 'rgba(0,0,0,0.2)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Three Steps to <span className="gradient-text">Mastery</span>
            </h2>
            <p className="text-[var(--color-muted)] max-w-lg mx-auto">
              From assessment to action plan in under a minute.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step, idx) => (
              <div
                key={step.num}
                id={`step-${step.num}`}
                className="relative text-center group"
              >
                {/* Connector line (desktop only) */}
                {idx < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-gradient-to-r from-[var(--color-border)] to-transparent" />
                )}

                {/* Number circle */}
                <div
                  className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center text-2xl font-bold text-white transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${step.color}30, ${step.color}10)`,
                    border: `1px solid ${step.color}40`,
                    boxShadow: `0 0 20px ${step.color}15`,
                    color: step.color,
                  }}
                >
                  {step.num}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-[var(--color-muted)] leading-relaxed max-w-xs mx-auto">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================== STATS SECTION ======================== */}
      <section id="stats" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-2xl p-8 sm:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-[var(--color-muted)]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ======================== CTA SECTION ======================== */}
      <section id="final-cta" className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Discover Your <span className="gradient-text">Learning DNA</span>?
          </h2>
          <p className="text-[var(--color-muted)] mb-8 max-w-lg mx-auto">
            Take the free diagnostic assessment and let AI reveal the cognitive
            patterns behind your academic performance.
          </p>
          <Link href="/quiz" id="final-cta-btn" className="btn-primary text-lg !px-10 !py-4">
            Begin Assessment Now
          </Link>
        </div>
      </section>

      {/* ======================== FOOTER ======================== */}
      <footer className="border-t border-[var(--color-border)] py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="EduPulse AI" width={24} height={24} />
            <span className="text-sm font-semibold gradient-text">
              EduPulse AI
            </span>
          </div>
          <p className="text-xs text-[var(--color-muted)]">
            © {new Date().getFullYear()} EduPulse AI. Built for smarter learning.
          </p>
        </div>
      </footer>
    </div>
  );
}
