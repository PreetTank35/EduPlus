'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

/**
 * Navbar — Glassmorphic navigation bar
 * 
 * Features:
 * - Active link detection via usePathname
 * - Mobile hamburger menu with slide-in drawer
 * - Gradient logo branding
 * - Sticky positioning with backdrop blur
 */

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/quiz', label: 'Quiz' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/roadmap', label: 'Roadmap' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav
      id="navbar"
      className="fixed top-0 left-0 right-0 z-50 glass"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
            id="nav-logo"
          >
            <Image
              src="/logo.svg"
              alt="EduPulse AI Logo"
              width={32}
              height={32}
              className="transition-transform duration-300 group-hover:scale-110"
            />
            <span className="text-lg font-bold gradient-text tracking-tight">
              EduPulse AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  id={`nav-link-${link.label.toLowerCase()}`}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-white'
                      : 'text-[var(--color-muted)] hover:text-white'
                  }`}
                >
                  {link.label}
                  {/* Active indicator — gradient underline */}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-6 rounded-full"
                      style={{
                        background:
                          'linear-gradient(90deg, #6366f1, #06b6d4)',
                      }}
                    />
                  )}
                  {/* Hover background */}
                  {!isActive && (
                    <span className="absolute inset-0 rounded-lg bg-white/[0.04] opacity-0 hover:opacity-100 transition-opacity duration-200" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Link
              href="/quiz"
              id="nav-cta"
              className="btn-primary text-sm !py-2 !px-5"
            >
              Start Assessment
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[var(--color-muted)] hover:text-white transition-colors"
            aria-label="Toggle navigation menu"
            id="mobile-menu-btn"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden glass-light animate-fade-in-down"
          id="mobile-menu-drawer"
        >
          <div className="px-4 py-3 space-y-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-white bg-white/[0.08]'
                      : 'text-[var(--color-muted)] hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-2">
              <Link
                href="/quiz"
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn-primary w-full text-sm !py-2.5"
              >
                Start Assessment
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
