import { useEffect, useRef } from 'react';

/*
|--------------------------------------------------------------------------
| Global Background
|--------------------------------------------------------------------------
|
| Premium dark backdrop for the public portfolio: solid near-black base,
| a couple of slow, softly-blurred purple/blue glow blobs, and a faint
| grid. Deliberately restrained -- no starfields, planets, orbit rings,
| or shooting stars. Motion is slow and fully disabled for
| prefers-reduced-motion.
|
|--------------------------------------------------------------------------
*/

function GlobalSpaceBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return undefined;

    let raf = null;

    const handleMouseMove = (event) => {
      if (raf) return;

      raf = requestAnimationFrame(() => {
        const { innerWidth, innerHeight } = window;

        const x = (event.clientX / innerWidth - 0.5) * 20;
        const y = (event.clientY / innerHeight - 0.5) * 20;

        container.style.setProperty('--space-mouse-x', `${x}px`);
        container.style.setProperty('--space-mouse-y', `${y}px`);

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
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#050505]"
    >
      {/* Base */}
      <div className="absolute inset-0 bg-[#050505]" />

      {/* Large purple ambient glow, top-left */}
      <div
        className="absolute -left-56 top-[-10%] h-[34rem] w-[34rem] rounded-full bg-[#8B5CF6]/[0.14] blur-[130px] transition-transform duration-[2500ms] ease-out animate-blob-drift"
        style={{
          transform:
            'translate3d(var(--space-mouse-x, 0px), var(--space-mouse-y, 0px), 0)',
        }}
      />

      {/* Blue ambient glow, right side */}
      <div
        className="absolute -right-56 top-[18%] h-[36rem] w-[36rem] rounded-full bg-[#3B82F6]/[0.10] blur-[140px] transition-transform duration-[3000ms] ease-out animate-blob-drift"
        style={{
          animationDelay: '-7s',
          transform:
            'translate3d(calc(var(--space-mouse-x, 0px) * -0.7), calc(var(--space-mouse-y, 0px) * -0.7), 0)',
        }}
      />

      {/* Soft secondary purple glow, lower section */}
      <div
        className="absolute bottom-[-14rem] left-[22%] h-[30rem] w-[30rem] rounded-full bg-[#A78BFA]/[0.06] blur-[120px] animate-blob-drift"
        style={{ animationDelay: '-13s' }}
      />

      {/* Faint grid, faded top/bottom so it never dominates */}
      <div
        className="absolute inset-0 opacity-[0.05]"
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

      {/* Gentle vignette to focus attention on content */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  );
}

export default GlobalSpaceBackground;