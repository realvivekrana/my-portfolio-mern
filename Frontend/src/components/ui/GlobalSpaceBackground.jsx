import { useEffect, useMemo, useRef } from 'react';

function GlobalSpaceBackground() {
  const containerRef = useRef(null);

  /*
  |--------------------------------------------------------------------------
  | STAR FIELD
  |--------------------------------------------------------------------------
  */

  const stars = useMemo(() => {
    return Array.from({ length: 140 }, (_, index) => ({
      id: index,
      left: `${(index * 47.73) % 100}%`,
      top: `${(index * 31.91) % 100}%`,
      size: 1 + (index % 3) * 0.6,
      duration: 2.5 + (index % 6) * 1.2,
      delay: (index % 10) * 0.4,
      opacity: 0.25 + (index % 5) * 0.12,
    }));
  }, []);

  /*
  |--------------------------------------------------------------------------
  | SMALL SPACE PARTICLES
  |--------------------------------------------------------------------------
  */

  const particles = useMemo(() => {
    return Array.from({ length: 35 }, (_, index) => ({
      id: index,
      left: `${(index * 67.31) % 100}%`,
      top: `${(index * 43.27) % 100}%`,
      duration: 10 + (index % 7) * 2,
      delay: (index % 8) * 0.8,
    }));
  }, []);

  /*
  |--------------------------------------------------------------------------
  | MOUSE PARALLAX
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return undefined;
    }

    const handleMouseMove = (event) => {
      const { innerWidth, innerHeight } = window;

      const x =
        (event.clientX / innerWidth - 0.5) * 18;

      const y =
        (event.clientY / innerHeight - 0.5) * 18;

      container.style.setProperty(
        '--space-mouse-x',
        `${x}px`
      );

      container.style.setProperty(
        '--space-mouse-y',
        `${y}px`
      );
    };

    window.addEventListener(
      'mousemove',
      handleMouseMove,
      {
        passive: true,
      }
    );

    return () => {
      window.removeEventListener(
        'mousemove',
        handleMouseMove
      );
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-black"
    >
      {/* =====================================================
          DEEP SPACE BASE
      ====================================================== */}

      <div className="absolute inset-0 bg-black" />

      {/* =====================================================
          LARGE COSMIC GLOW - INDIGO
      ====================================================== */}

      <div
        className="absolute -left-56 top-[-10%] h-[30rem] w-[30rem] rounded-full bg-indigo-600/10 blur-[120px] transition-transform duration-[2500ms] ease-out"
        style={{
          transform:
            'translate3d(var(--space-mouse-x, 0px), var(--space-mouse-y, 0px), 0)',
        }}
      />

      {/* =====================================================
          LARGE COSMIC GLOW - PURPLE
      ====================================================== */}

      <div
        className="absolute -right-56 top-[20%] h-[34rem] w-[34rem] rounded-full bg-purple-600/10 blur-[130px] transition-transform duration-[3000ms] ease-out"
        style={{
          transform:
            'translate3d(calc(var(--space-mouse-x, 0px) * -0.7), calc(var(--space-mouse-y, 0px) * -0.7), 0)',
        }}
      />

      {/* =====================================================
          CYAN COSMIC GLOW
      ====================================================== */}

      <div className="absolute bottom-[-12rem] left-[25%] h-[30rem] w-[30rem] rounded-full bg-cyan-500/5 blur-[120px]" />

      {/* =====================================================
          STAR FIELD
      ====================================================== */}

      {stars.map((star) => (
        <span
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animation: `starTwinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}

      {/* =====================================================
          SMALL FLOATING PARTICLES
      ====================================================== */}

      {particles.map((particle) => (
        <span
          key={particle.id}
          className="absolute h-1 w-1 rounded-full bg-indigo-300/40"
          style={{
            left: particle.left,
            top: particle.top,
            animation: `spaceParticle ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
          }}
        />
      ))}

      {/* =====================================================
          PLANET 1
      ====================================================== */}

      <div
        className="absolute left-[8%] top-[20%] h-14 w-14 animate-[planetFloatOne_18s_ease-in-out_infinite] rounded-full bg-gradient-to-br from-indigo-300/70 via-indigo-600/40 to-purple-900/30 shadow-[0_0_45px_rgba(99,102,241,0.25)] blur-[0.2px]"
      >
        <div className="absolute left-1/2 top-1/2 h-16 w-4 -translate-x-1/2 -translate-y-1/2 rotate-[-25deg] rounded-full border border-indigo-300/20" />
      </div>

      {/* =====================================================
          PLANET 2
      ====================================================== */}

      <div className="absolute right-[10%] top-[55%] h-10 w-10 animate-[planetFloatTwo_22s_ease-in-out_infinite] rounded-full bg-gradient-to-br from-purple-300/60 via-purple-600/40 to-indigo-950/30 shadow-[0_0_40px_rgba(168,85,247,0.25)]">
        <div className="absolute left-1/2 top-1/2 h-12 w-3 -translate-x-1/2 -translate-y-1/2 rotate-[35deg] rounded-full border border-purple-300/20" />
      </div>

      {/* =====================================================
          PLANET 3
      ====================================================== */}

      <div className="absolute bottom-[15%] left-[12%] h-7 w-7 animate-[planetFloatThree_16s_ease-in-out_infinite] rounded-full bg-gradient-to-br from-cyan-300/60 via-blue-500/40 to-indigo-950/30 shadow-[0_0_35px_rgba(34,211,238,0.2)]" />

      {/* =====================================================
          ORBIT RING 1
      ====================================================== */}

      <div className="absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 animate-[orbitRotate_45s_linear_infinite] rounded-full border border-indigo-400/[0.06] sm:h-[42rem] sm:w-[42rem]" />

      {/* =====================================================
          ORBIT RING 2
      ====================================================== */}

      <div className="absolute left-1/2 top-1/2 h-[38rem] w-[20rem] -translate-x-1/2 -translate-y-1/2 rotate-[35deg] animate-[orbitRotateReverse_60s_linear_infinite] rounded-[50%] border border-purple-400/[0.05] sm:h-[54rem] sm:w-[30rem]" />

      {/* =====================================================
          ORBIT RING 3
      ====================================================== */}

      <div className="absolute left-1/2 top-1/2 h-[18rem] w-[45rem] -translate-x-1/2 -translate-y-1/2 rotate-[-20deg] animate-[orbitRotate_70s_linear_infinite] rounded-[50%] border border-cyan-400/[0.04]" />

      {/* =====================================================
          MOVING COSMIC LIGHT
      ====================================================== */}

      <div className="absolute left-0 top-[30%] h-px w-full overflow-hidden opacity-30">
        <div className="h-full w-48 animate-[cosmicLight_12s_linear_infinite] bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-[0_0_20px_rgba(129,140,248,0.7)]" />
      </div>

      {/* =====================================================
          SECOND MOVING LIGHT
      ====================================================== */}

      <div className="absolute left-0 top-[72%] h-px w-full overflow-hidden opacity-20">
        <div className="h-full w-64 animate-[cosmicLightReverse_18s_linear_infinite] bg-gradient-to-r from-transparent via-purple-400 to-transparent shadow-[0_0_20px_rgba(192,132,252,0.6)]" />
      </div>

      {/* =====================================================
          SHOOTING STAR
      ====================================================== */}

      <div className="absolute right-[20%] top-[18%] h-px w-28 animate-[shootingStar_9s_linear_infinite] rotate-[-35deg] bg-gradient-to-r from-transparent via-white to-transparent opacity-0" />

      {/* =====================================================
          SPACE VIGNETTE
      ====================================================== */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,rgba(0,0,0,0.35)_100%)]" />

      {/* =====================================================
          ANIMATION STYLES
      ====================================================== */}

      <style>
        {`
          @keyframes starTwinkle {
            0%,
            100% {
              opacity: 0.2;
              transform: scale(0.8);
            }

            50% {
              opacity: 1;
              transform: scale(1.5);
            }
          }

          @keyframes spaceParticle {
            0%,
            100% {
              transform: translate3d(0, 0, 0);
              opacity: 0.15;
            }

            25% {
              transform: translate3d(30px, -40px, 0);
              opacity: 0.6;
            }

            50% {
              transform: translate3d(-20px, -80px, 0);
              opacity: 0.3;
            }

            75% {
              transform: translate3d(-50px, -35px, 0);
              opacity: 0.7;
            }
          }

          @keyframes planetFloatOne {
            0%,
            100% {
              transform: translate3d(0, 0, 0);
            }

            25% {
              transform: translate3d(80px, 40px, 0);
            }

            50% {
              transform: translate3d(130px, -30px, 0);
            }

            75% {
              transform: translate3d(40px, -70px, 0);
            }
          }

          @keyframes planetFloatTwo {
            0%,
            100% {
              transform: translate3d(0, 0, 0);
            }

            30% {
              transform: translate3d(-70px, 40px, 0);
            }

            60% {
              transform: translate3d(-120px, -50px, 0);
            }

            80% {
              transform: translate3d(-40px, -90px, 0);
            }
          }

          @keyframes planetFloatThree {
            0%,
            100% {
              transform: translate3d(0, 0, 0);
            }

            40% {
              transform: translate3d(90px, -40px, 0);
            }

            70% {
              transform: translate3d(140px, 40px, 0);
            }
          }

          @keyframes orbitRotate {
            from {
              transform: translate(-50%, -50%) rotate(0deg);
            }

            to {
              transform: translate(-50%, -50%) rotate(360deg);
            }
          }

          @keyframes orbitRotateReverse {
            from {
              transform: translate(-50%, -50%) rotate(360deg);
            }

            to {
              transform: translate(-50%, -50%) rotate(0deg);
            }
          }

          @keyframes cosmicLight {
            0% {
              transform: translateX(-150%);
            }

            100% {
              transform: translateX(700%);
            }
          }

          @keyframes cosmicLightReverse {
            0% {
              transform: translateX(700%);
            }

            100% {
              transform: translateX(-150%);
            }
          }

          @keyframes shootingStar {
            0% {
              transform: translate3d(0, 0, 0) rotate(-35deg);
              opacity: 0;
            }

            10% {
              opacity: 0.8;
            }

            25% {
              transform: translate3d(-280px, 160px, 0) rotate(-35deg);
              opacity: 0;
            }

            100% {
              transform: translate3d(-280px, 160px, 0) rotate(-35deg);
              opacity: 0;
            }
          }

          @media (max-width: 640px) {
            .space-mobile-hide {
              display: none;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        `}
      </style>
    </div>
  );
}

export default GlobalSpaceBackground;