import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import Navbar from '@/components/Navbar';
import ActivityTracker from '@/components/ActivityTracker';
import AuroraBackground from '@/components/AuroraBackground';
import './globals.css';

/**
 * Root Layout
 * 
 * Provides the global HTML structure, fonts, metadata, and the
 * persistent Navbar component across all pages.
 */

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

// SEO Metadata
export const metadata = {
  title: {
    default: 'EduPulse AI — Diagnostic Assessment Platform',
    template: '%s | EduPulse AI',
  },
  description:
    'A context-aware diagnostic assessment platform that evaluates cognitive performance patterns across subjects and generates personalized learning paths using AI.',
  keywords: [
    'education',
    'AI assessment',
    'learning analytics',
    'diagnostic quiz',
    'personalized learning',
    'study roadmap',
  ],
  authors: [{ name: 'EduPulse AI Team' }],
  openGraph: {
    title: 'EduPulse AI — Diagnostic Assessment Platform',
    description:
      'Evaluate how you think, not just what you know. AI-powered diagnostic assessments with personalized learning paths.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-[#08080c] text-white min-h-screen">
        {/* Aurora animated background — fixed, behind everything */}
        <AuroraBackground />

        <ActivityTracker />
        
        {/* Global navigation */}
        <Navbar />

        {/* Page content with top padding for fixed navbar */}
        <main className="pt-16 relative z-[1]">{children}</main>
      </body>
    </html>
  );
}

