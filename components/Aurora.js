'use client';

/**
 * Aurora — Lightweight CSS-only animated aurora background.
 * Uses layered radial gradients animated with GPU-accelerated transforms
 * instead of per-pixel Canvas noise for silky-smooth 60fps performance.
 *
 * Props:
 * - colorStops: [string, string, string] — Three hex colors for the aurora
 * - amplitude: number — Controls scale of the aurora movement (default 1.0)
 * - blend: number — Controls overall opacity (default 0.5)
 * - speed: number — Controls animation speed (default 1.0)
 */
export default function Aurora({
  colorStops = ['#3A29FF', '#FF94B4', '#FF3232'],
  amplitude = 1.0,
  blend = 0.5,
  speed = 1.0,
}) {
  const duration = Math.max(8 / speed, 4); // seconds per cycle

  return (
    <div
      className="aurora-root"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        opacity: blend,
      }}
    >
      {/* Layer 1 — large slow-moving blob */}
      <div
        className="aurora-blob aurora-blob-1"
        style={{
          '--aurora-color': colorStops[0],
          '--aurora-duration': `${duration * 1.6}s`,
          '--aurora-amplitude': `${amplitude * 15}%`,
        }}
      />
      {/* Layer 2 — medium counter-rotating blob */}
      <div
        className="aurora-blob aurora-blob-2"
        style={{
          '--aurora-color': colorStops[1],
          '--aurora-duration': `${duration * 1.2}s`,
          '--aurora-amplitude': `${amplitude * 20}%`,
        }}
      />
      {/* Layer 3 — small fast-moving blob */}
      <div
        className="aurora-blob aurora-blob-3"
        style={{
          '--aurora-color': colorStops[2],
          '--aurora-duration': `${duration}s`,
          '--aurora-amplitude': `${amplitude * 12}%`,
        }}
      />

      {/* Inline styles for the CSS animation — avoids a separate CSS file */}
      <style>{`
        .aurora-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          will-change: transform;
          mix-blend-mode: screen;
        }

        .aurora-blob-1 {
          width: 70%;
          height: 70%;
          top: -10%;
          left: -10%;
          background: radial-gradient(circle, var(--aurora-color) 0%, transparent 70%);
          animation: aurora-drift-1 var(--aurora-duration) ease-in-out infinite alternate;
        }

        .aurora-blob-2 {
          width: 60%;
          height: 60%;
          bottom: -15%;
          right: -10%;
          background: radial-gradient(circle, var(--aurora-color) 0%, transparent 70%);
          animation: aurora-drift-2 var(--aurora-duration) ease-in-out infinite alternate-reverse;
        }

        .aurora-blob-3 {
          width: 50%;
          height: 50%;
          top: 20%;
          left: 25%;
          background: radial-gradient(circle, var(--aurora-color) 0%, transparent 70%);
          animation: aurora-drift-3 var(--aurora-duration) ease-in-out infinite alternate;
        }

        @keyframes aurora-drift-1 {
          0%   { transform: translate(0, 0) scale(1); }
          33%  { transform: translate(var(--aurora-amplitude), calc(var(--aurora-amplitude) * 0.5)) scale(1.1); }
          66%  { transform: translate(calc(var(--aurora-amplitude) * -0.5), var(--aurora-amplitude)) scale(0.95); }
          100% { transform: translate(var(--aurora-amplitude), calc(var(--aurora-amplitude) * -0.3)) scale(1.05); }
        }

        @keyframes aurora-drift-2 {
          0%   { transform: translate(0, 0) scale(1); }
          33%  { transform: translate(calc(var(--aurora-amplitude) * -1), calc(var(--aurora-amplitude) * 0.7)) scale(1.08); }
          66%  { transform: translate(var(--aurora-amplitude), calc(var(--aurora-amplitude) * -0.5)) scale(0.92); }
          100% { transform: translate(calc(var(--aurora-amplitude) * -0.7), var(--aurora-amplitude)) scale(1.03); }
        }

        @keyframes aurora-drift-3 {
          0%   { transform: translate(0, 0) scale(1); }
          50%  { transform: translate(var(--aurora-amplitude), calc(var(--aurora-amplitude) * -1)) scale(1.15); }
          100% { transform: translate(calc(var(--aurora-amplitude) * -0.5), calc(var(--aurora-amplitude) * 0.8)) scale(0.9); }
        }
      `}</style>
    </div>
  );
}
