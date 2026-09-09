import { useEffect, useRef } from 'react';

/*
|--------------------------------------------------------------------------
| Animated Background
|--------------------------------------------------------------------------
|
| Premium, subtle ambient background: a couple of slow-moving blurred
| purple/blue glow blobs + a faint grid. Intentionally restrained --
| no particle fields, streaks, or spinning rings. Motion is slow,
| smooth, and disabled entirely for prefers-reduced-motion.
|
|--------------------------------------------------------------------------
*/

function AnimatedBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    let raf = null;

    const handleMouseMove = (event) => {
      if (raf) return;

      raf = requestAnimationFrame(() => {
        const { innerWidth, innerHeight } = window;

        const x = (event.clientX / innerWidth - 0.5) * 16;
        const y = (event.clientY / innerHeight - 0.5) * 16;

        container.style.setProperty('--mouse-x', `${x}px`);
        container.style.setProperty('--mouse-y', `${y}px`);

        raf = null;
      });
    };

    window.addEventListener('mousemove', handleMouseMove, {
      passive: true,
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Large purple ambient glow, top-left */}
      <div
        className="glow-blob animate-blob-drift -left-40 top-[-10%] h-[32rem] w-[32rem] bg-indigo-400/[0.05] dark:bg-[#8B5CF6]/[0.16]"
        style={{
          transform:
            'translate3d(var(--mouse-x, 0px), var(--mouse-y, 0px), 0)',
          animationDelay: '0s',
        }}
      />

      {/* Blue ambient glow, right side */}
      <div
        className="glow-blob animate-blob-drift -right-40 top-[22%] h-[26rem] w-[26rem] bg-blue-400/[0.045] dark:bg-[#3B82F6]/[0.12]"
        style={{
          transform:
            'translate3d(calc(var(--mouse-x, 0px) * -0.6), calc(var(--mouse-y, 0px) * -0.6), 0)',
          animationDelay: '-6s',
        }}
      />

      {/* Soft secondary purple glow, lower section */}
      <div
        className="glow-blob animate-blob-drift bottom-[-15%] left-[28%] h-[24rem] w-[24rem] bg-purple-400/[0.04] dark:bg-[#A78BFA]/[0.08]"
        style={{ animationDelay: '-11s' }}
      />

      {/* Very subtle grid, faded top/bottom */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(139,92,246,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.9) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage:
            'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
        }}
      />
    </div>
  );
}

export default AnimatedBackground;