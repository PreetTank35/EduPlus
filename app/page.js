'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import BorderGlow from '@/components/BorderGlow';
import BlurText from '@/components/BlurText';

/**
 * Landing Page — Project Showcase
 * Featuring Advanced 3D Tilt Cards, Parallax, and Scroll Animations
 */

// --- Color helpers for BorderGlow ---
// Converts a hex color to "H S L" string format required by BorderGlow's glowColor prop
function hexToHSL(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)} ${Math.round(l * 100)}`;
}

// Lightens a hex color by a given percentage (0-100) to create a secondary gradient stop
function lightenHex(hex, amount) {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  r = Math.min(255, r + Math.round((255 - r) * (amount / 100)));
  g = Math.min(255, g + Math.round((255 - g) * (amount / 100)));
  b = Math.min(255, b + Math.round((255 - b) * (amount / 100)));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

const SPECIFICATIONS = [
  {
    title: 'Authentication & Security',
    description: 'Hybrid OTP and Passwordless authentication architecture powered by Supabase Auth with Row Level Security (RLS) enforcement.',
    color: '#8b5cf6', // Violet
  },
  {
    title: 'AI Integration',
    description: 'Deep integration with Google Gemini AI for complex cognitive pattern recognition, gap analysis, and roadmap generation.',
    color: '#06b6d4', // Cyan
  },
  {
    title: 'Real-time Telemetry',
    description: 'Custom global analytics tracking page views, precise dwell times, form submissions, and UI interactions.',
    color: '#34d399', // Emerald
  },
  {
    title: 'Modern Frontend Stack',
    description: 'Built on Next.js App Router (React) with Tailwind CSS, utilizing Glassmorphism design principles and CSS micro-animations.',
    color: '#f43f5e', // Rose
  },
];

const GOALS = [
  {
    num: '01',
    title: 'Identify Root Causes',
    desc: 'Move beyond simple "right/wrong" grading to uncover the underlying cognitive gaps hindering student progression.',
    color: '#6366f1', // Indigo
  },
  {
    num: '02',
    title: 'Generate Actionable Paths',
    desc: 'Translate analytical data into highly structured, actionable, and personalized learning roadmaps for every individual.',
    color: '#8b5cf6', // Violet
  },
  {
    num: '03',
    title: 'Seamless User Experience',
    desc: 'Provide a frictionless, visually stunning, and highly responsive interface that encourages deep student engagement.',
    color: '#06b6d4', // Cyan
  },
];

// --- 3D Interactive Tilt Card Component ---
function TiltCard({ spec, noBorder = false }) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 10;
    const rotateX = -((y - centerY) / centerY) * 10;
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`group relative overflow-hidden p-6 ${noBorder ? 'bg-transparent' : 'card glass border border-white/5'} transition-all ease-out`}
      style={{
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${isHovered ? 1.02 : 1})`,
        transformStyle: 'preserve-3d',
        transitionDuration: isHovered ? '50ms' : '500ms',
        willChange: 'transform'
      }}
    >
      {/* Dynamic Hover Glow */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-300 pointer-events-none"
        style={{ 
          background: `radial-gradient(circle at ${rotation.y > 0 ? 'top right' : 'top left'}, ${spec.color}, transparent 70%)` 
        }}
      />

      <div className="flex items-start gap-5 relative z-10" style={{ transform: 'translateZ(30px)' }}>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg"
          style={{ background: `linear-gradient(135deg, ${spec.color}40, ${spec.color}10)`, border: `1px solid ${spec.color}50` }}
        >
          <svg className="w-6 h-6" style={{ color: spec.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">{spec.title}</h3>
          <p className="text-sm text-[var(--color-muted)] leading-relaxed">
            {spec.description}
          </p>
        </div>
      </div>
    </div>
  );
}

// --- Scroll Reveal Component ---
function FadeInSection({ children, delay = 0, className = "" }) {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    
    if (domRef.current) observer.observe(domRef.current);
    return () => {
      if (domRef.current) observer.unobserve(domRef.current);
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`${className} transition-all duration-[1000ms] ease-out will-change-[opacity,transform] ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-95'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// --- Main Page ---
export default function LandingPage() {
  const heroRef = useRef(null);

  // Lightweight scroll parallax — writes directly to DOM, no React re-renders
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (heroRef.current) {
          heroRef.current.style.transform = `translateY(${y * 0.15}px)`;
          heroRef.current.style.opacity = Math.max(1 - y / 600, 0);
        }
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">

      {/* ======================== HERO / MISSION SECTION ======================== */}
      <section id="mission" className="relative min-h-[80vh] flex flex-col items-center justify-center px-4 pt-20 pb-16">
        <div 
          ref={heroRef}
          className="max-w-5xl mx-auto text-center relative z-10 will-change-[transform,opacity]"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-8 animate-fade-in-down border border-[var(--color-border)] glass-light shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse shadow-[0_0_8px_var(--color-success)]" />
            Project Mission & Motive
          </div>

          {/* Hero H1 — BlurText animates each word from the top with a staggered delay */}
          <BlurText
            text="Redefining Education Through Cognitive AI Analytics"
            animateBy="words"
            direction="top"
            delay={120}
            stepDuration={0.55}
            threshold={0.05}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-8 tracking-tight drop-shadow-2xl justify-center"
          />

          {/* Hero subtitle — BlurText animates word-by-word from bottom for contrast with the H1 */}
          <BlurText
            text="Our mission is to democratize personalized education. By leveraging advanced AI to diagnose how an individual thinks rather than just what they know, we aim to eliminate academic bottlenecks and provide universally accessible, tailored learning roadmaps."
            animateBy="words"
            direction="bottom"
            delay={40}
            stepDuration={0.4}
            threshold={0.05}
            className="text-lg sm:text-xl text-[var(--color-muted)] max-w-3xl mx-auto mb-10 leading-relaxed font-light justify-center"
          />

          {/* Scroll indicator */}
          <div className="mt-16 animate-fade-in delay-500 flex flex-col items-center gap-2 text-[var(--color-muted)]">
            <span className="text-xs uppercase tracking-widest font-medium opacity-80">Explore Project Details</span>
            <svg className="w-5 h-5 animate-bounce mt-2 text-[var(--color-accent-cyan)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* ======================== SPECIFICATIONS SECTION ======================== */}
      <section id="specifications" className="py-24 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          <FadeInSection className="text-center mb-16">
            {/* Section heading — letters animate in one-by-one from the top */}
            <BlurText
              text="Project Specifications"
              animateBy="letters"
              direction="top"
              delay={60}
              stepDuration={0.3}
              threshold={0.2}
              className="text-3xl sm:text-4xl font-bold mb-4 drop-shadow-lg justify-center"
            />
            <div className="w-24 h-1 bg-gradient-to-r from-[var(--color-accent-violet)] to-[var(--color-accent-cyan)] mx-auto rounded-full mb-6 shadow-glow-cyan" />
            <p className="text-[var(--color-muted)] max-w-2xl mx-auto">
              The technical foundation and core functional modules that power the platform's analytical capabilities.
            </p>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SPECIFICATIONS.map((spec, idx) => (
              <FadeInSection key={spec.title} delay={idx * 150}>
                {/* BorderGlow wraps TiltCard — glow color driven by each spec's accent color */}
                <BorderGlow
                  backgroundColor="#0d0d14"
                  glowColor={`${hexToHSL(spec.color)}`}
                  colors={[spec.color, lightenHex(spec.color, 20), '#38bdf8']}
                  borderRadius={16}
                  edgeSensitivity={20}
                  glowRadius={35}
                  glowIntensity={1.2}
                  coneSpread={22}
                  animated={idx === 0}
                  className="w-full h-full"
                >
                  <TiltCard spec={spec} noBorder />
                </BorderGlow>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ======================== GOALS SECTION ======================== */}
      <section id="goals" className="py-24 px-4 relative z-10" style={{ background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.4))' }}>
        <div className="max-w-5xl mx-auto">
          
          <FadeInSection className="text-center mb-16">
            {/* Goals heading — words animate from bottom to differentiate from the Specs heading */}
            <BlurText
              text="Project Goals"
              animateBy="words"
              direction="bottom"
              delay={180}
              stepDuration={0.5}
              threshold={0.2}
              className="text-3xl sm:text-4xl font-bold mb-4 drop-shadow-lg justify-center"
            />
            <div className="w-24 h-1 bg-gradient-to-r from-[var(--color-accent-cyan)] to-[var(--color-accent-violet)] mx-auto rounded-full mb-6 shadow-glow-violet" />
            <p className="text-[var(--color-muted)] max-w-lg mx-auto">
              The primary objectives we aim to achieve with this platform.
            </p>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {GOALS.map((goal, idx) => (
              <FadeInSection key={goal.num} delay={idx * 200} className="relative">
                {/* Connector line (desktop only) */}
                {idx < GOALS.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-gradient-to-r from-[var(--color-border)] to-transparent opacity-50 z-0" />
                )}

                {/* BorderGlow wraps entire goal card */}
                <BorderGlow
                  backgroundColor="#0a0a12"
                  glowColor={`${hexToHSL(goal.color)}`}
                  colors={[goal.color, lightenHex(goal.color, 25), '#818cf8']}
                  borderRadius={20}
                  edgeSensitivity={15}
                  glowRadius={45}
                  glowIntensity={1.4}
                  coneSpread={28}
                  animated={false}
                  fillOpacity={0.35}
                  className="w-full"
                >
                  <div className="text-center group p-6">
                    {/* Number circle */}
                    <div
                      className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center text-2xl font-bold text-white transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative z-10"
                      style={{
                        background: `linear-gradient(135deg, ${goal.color}30, ${goal.color}10)`,
                        border: `1px solid ${goal.color}40`,
                        boxShadow: `0 0 20px ${goal.color}20`,
                        color: goal.color,
                      }}
                    >
                      {goal.num}
                    </div>
                    <h3 className="text-lg font-semibold mb-3 transition-colors duration-300" style={{ color: goal.color }}>
                      {goal.title}
                    </h3>
                    <p className="text-sm text-[var(--color-muted)] leading-relaxed max-w-xs mx-auto group-hover:text-[var(--color-foreground)] transition-colors duration-300">
                      {goal.desc}
                    </p>
                  </div>
                </BorderGlow>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ======================== CTA FOOTER ======================== */}
      <FadeInSection delay={100} className="py-20 px-4 border-t border-white/5 relative z-10 glass-light">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Image src="/logo.svg" alt="EduPulse AI" width={36} height={36} className="relative z-10" />
              <div className="absolute inset-0 bg-blue-500 blur-xl opacity-30 animate-pulse-slow" />
            </div>
            <div>
              <h3 className="text-xl font-bold gradient-text">EduPulse AI</h3>
              <p className="text-xs text-[var(--color-muted)]">Advanced Educational Analytics</p>
            </div>
          </div>
          
          <div className="text-sm text-[var(--color-muted)] max-w-md">
            This project represents a structural reimagining of how technology can interface with human cognition to accelerate learning.
          </div>
        </div>
      </FadeInSection>

    </div>
  );
}
