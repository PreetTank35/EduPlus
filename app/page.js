'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

/**
 * Landing Page — Project Showcase
 * Featuring Advanced 3D Tilt Cards, Parallax, and Scroll Animations
 */

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
function TiltCard({ spec }) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation (-10 to 10 degrees)
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
      className={`card glass group border transition-all ease-out ${isHovered ? 'border-white/20' : 'border-white/5'} relative overflow-hidden`}
      style={{
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${isHovered ? 1.02 : 1})`,
        transformStyle: 'preserve-3d',
        transitionDuration: isHovered ? '50ms' : '500ms', // Snap to mouse fast, return to flat slow
        willChange: 'transform'
      }}
    >
      {/* Dynamic Hover Glow based on Mouse Position */}
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
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => {
        setScrollY(window.scrollY);
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parallax calculations
  const parallaxOffset1 = scrollY * 0.5; // Moves slower than scroll (background depth)
  const parallaxOffset2 = scrollY * 0.2; // Moves very slow

  return (
    <div className="min-h-screen relative overflow-hidden">
      
      {/* Global Ambient Parallax Background */}
      <div className="fixed inset-0 z-[-1] bg-[var(--color-bg)] perspective-[1000px]">
        <div 
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full opacity-10 blur-[120px] animate-pulse-slow will-change-transform"
          style={{ 
            background: '#6366f1',
            transform: `translate3d(0, ${parallaxOffset1}px, -100px)`
          }}
        />
        <div 
          className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full opacity-10 blur-[120px] animate-pulse-slow will-change-transform"
          style={{ 
            background: '#06b6d4', 
            animationDelay: '2s',
            transform: `translate3d(0, ${-parallaxOffset2}px, -50px)` // Moves slightly up for counter-parallax
          }}
        />
      </div>

      {/* ======================== HERO / MISSION SECTION ======================== */}
      <section id="mission" className="relative min-h-[80vh] flex flex-col items-center justify-center px-4 pt-20 pb-16">
        <div 
          className="max-w-5xl mx-auto text-center relative z-10 will-change-transform"
          style={{ transform: `translateY(${scrollY * 0.15}px)`, opacity: 1 - scrollY / 600 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-8 animate-fade-in-down border border-[var(--color-border)] glass-light shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse shadow-[0_0_8px_var(--color-success)]" />
            Project Mission & Motive
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-8 animate-fade-in-up tracking-tight drop-shadow-2xl">
            Redefining Education Through <br />
            <span className="gradient-text animate-pulse-glow">Cognitive AI Analytics</span>
          </h1>

          <p className="text-lg sm:text-xl text-[var(--color-muted)] max-w-3xl mx-auto mb-10 animate-fade-in-up delay-200 leading-relaxed font-light">
            Our mission is to democratize personalized education. By leveraging advanced AI to diagnose how an individual thinks rather than just what they know, we aim to eliminate academic bottlenecks and provide universally accessible, tailored learning roadmaps.
          </p>

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
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 drop-shadow-lg">
              Project <span className="text-[var(--color-accent-cyan)]">Specifications</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[var(--color-accent-violet)] to-[var(--color-accent-cyan)] mx-auto rounded-full mb-6 shadow-glow-cyan" />
            <p className="text-[var(--color-muted)] max-w-2xl mx-auto">
              The technical foundation and core functional modules that power the platform's analytical capabilities.
            </p>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 perspective-[1000px]">
            {SPECIFICATIONS.map((spec, idx) => (
              <FadeInSection key={spec.title} delay={idx * 150}>
                <TiltCard spec={spec} />
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ======================== GOALS SECTION ======================== */}
      <section id="goals" className="py-24 px-4 relative z-10" style={{ background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.4))' }}>
        <div className="max-w-5xl mx-auto">
          
          <FadeInSection className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 drop-shadow-lg">
              Project <span className="text-[var(--color-accent-violet)]">Goals</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[var(--color-accent-cyan)] to-[var(--color-accent-violet)] mx-auto rounded-full mb-6 shadow-glow-violet" />
            <p className="text-[var(--color-muted)] max-w-lg mx-auto">
              The primary objectives we aim to achieve with this platform.
            </p>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {GOALS.map((goal, idx) => (
              <FadeInSection key={goal.num} delay={idx * 200} className="relative text-center group">
                
                {/* Connector line (desktop only) */}
                {idx < GOALS.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-gradient-to-r from-[var(--color-border)] to-transparent opacity-50 z-0" />
                )}

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
                <h3 className="text-lg font-semibold text-white mb-3 transition-colors duration-300" style={{ color: goal.color }}>
                  {goal.title}
                </h3>
                <p className="text-sm text-[var(--color-muted)] leading-relaxed max-w-xs mx-auto group-hover:text-[var(--color-foreground)] transition-colors duration-300">
                  {goal.desc}
                </p>
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
