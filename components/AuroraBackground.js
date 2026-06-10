'use client';

import Aurora from './Aurora';

/**
 * AuroraBackground — A fixed, full-screen aurora effect
 * that sits behind all page content as the global website background.
 */
export default function AuroraBackground() {
  return (
    <div
      className="fixed inset-0 z-[-2]"
      style={{ background: '#08080c' }}
      aria-hidden="true"
    >
      <Aurora
        colorStops={['#5227FF', '#EF4444', '#5227FF']}
        amplitude={1}
        blend={0.5}
        speed={0.8}
      />
    </div>
  );
}
