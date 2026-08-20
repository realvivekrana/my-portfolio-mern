import { useEffect, useRef } from 'react';

function AnimatedBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const handleMouseMove = (event) => {
      const { innerWidth, innerHeight } = window;

      const x =
        (event.clientX / innerWidth - 0.5) * 30;

      const y =
        (event.clientY / innerHeight - 0.5) * 30;

      container.style.setProperty(
        '--mouse-x',
        `${x}px`
      );

      container.style.setProperty(
        '--mouse-y',
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

  const particles = Array.from(
    {
      length: 28,
    },
    (_, index) => index
  );

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* =====================================================
          BACKGROUND GLOW
      ====================================================== */}

      <div
        className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-indigo-400/10 blur-3xl transition-transform duration-[2000ms] ease-out dark:bg-indigo-500/15"
        style={{
          transform:
            'translate3d(var(--mouse-x, 0px), var(--mouse-y, 0px), 0)',
        }}
      />

      <div
        className="absolute -right-40 top-[30%] h-[28rem] w-[28rem] rounded-full bg-purple-400/10 blur-3xl transition-transform duration-[2500ms] ease-out dark:bg-purple-500/15"
        style={{
          transform:
            'translate3d(calc(var(--mouse-x, 0px) * -0.7), calc(var(--mouse-y, 0px) * -0.7), 0)',
        }}
      />

      <div
        className="absolute bottom-[-120px] left-[30%] h-96 w-96 rounded-full bg-blue-400/10 blur-3xl dark:bg-blue-500/10"
      />

      {/* =====================================================
          LARGE MOVING ORB 1
      ====================================================== */}

      <div className="absolute left-[8%] top-[18%] h-3 w-3 animate-[floatOne_12s_ease-in-out_infinite] rounded-full bg-indigo-500/70 shadow-[0_0_30px_rgba(99,102,241,0.8)] dark:bg-indigo-400 dark:shadow-[0_0_35px_rgba(129,140,248,0.9)]" />

      {/* =====================================================
          LARGE MOVING ORB 2
      ====================================================== */}

      <div className="absolute right-[15%] top-[35%] h-2.5 w-2.5 animate-[floatTwo_15s_ease-in-out_infinite] rounded-full bg-purple-500/70 shadow-[0_0_28px_rgba(168,85,247,0.8)] dark:bg-purple-400 dark:shadow-[0_0_35px_rgba(192,132,252,0.9)]" />

      {/* =====================================================
          LARGE MOVING ORB 3
      ====================================================== */}

      <div className="absolute bottom-[22%] left-[25%] h-3 w-3 animate-[floatThree_18s_ease-in-out_infinite] rounded-full bg-blue-500/60 shadow-[0_0_30px_rgba(59,130,246,0.7)] dark:bg-blue-400 dark:shadow-[0_0_35px_rgba(96,165,250,0.8)]" />

      {/* =====================================================
          SMALL PARTICLES
      ====================================================== */}

      {particles.map((particle) => (
        <span
          key={particle}
          className="absolute h-1.5 w-1.5 rounded-full bg-indigo-500/30 dark:bg-indigo-300/40"
          style={{
            left: `${(particle * 37) % 100}%`,
            top: `${(particle * 53) % 100}%`,
            animation: `particleFloat ${
              8 + (particle % 7) * 2
            }s ease-in-out ${
              particle * 0.35
            }s infinite`,
          }}
        />
      ))}

      {/* =====================================================
          PURPLE PARTICLES
      ====================================================== */}

      {Array.from(
        {
          length: 12,
        },
        (_, index) => (
          <span
            key={`purple-${index}`}
            className="absolute h-1 w-1 rounded-full bg-purple-500/25 dark:bg-purple-300/35"
            style={{
              left: `${(index * 61) % 100}%`,
              top: `${(index * 43) % 100}%`,
              animation: `particleFloatReverse ${
                12 + (index % 5) * 2
              }s ease-in-out ${
                index * 0.5
              }s infinite`,
            }}
          />
        )
      )}

      {/* =====================================================
          MOVING LIGHT STREAK 1
      ====================================================== */}

      <div className="absolute left-0 top-[25%] h-px w-full overflow-hidden opacity-40 dark:opacity-50">
        <div className="h-full w-40 animate-[lightMove_9s_linear_infinite] bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_15px_rgba(99,102,241,0.7)]" />
      </div>

      {/* =====================================================
          MOVING LIGHT STREAK 2
      ====================================================== */}

      <div className="absolute left-0 top-[65%] h-px w-full overflow-hidden opacity-30 dark:opacity-40">
        <div className="h-full w-56 animate-[lightMoveReverse_14s_linear_infinite] bg-gradient-to-r from-transparent via-purple-500 to-transparent shadow-[0_0_15px_rgba(168,85,247,0.6)]" />
      </div>

      {/* =====================================================
          FLOATING RING 1
      ====================================================== */}

      <div className="absolute left-[18%] top-[55%] h-24 w-24 animate-[slowRotate_20s_linear_infinite] rounded-full border border-indigo-400/10 dark:border-indigo-400/15" />

      {/* =====================================================
          FLOATING RING 2
      ====================================================== */}

      <div className="absolute right-[12%] top-[70%] h-32 w-32 animate-[slowRotateReverse_25s_linear_infinite] rounded-full border border-purple-400/10 dark:border-purple-400/15" />

      {/* =====================================================
          GRID
      ====================================================== */}

      <div
        className="absolute inset-0 opacity-[0.035] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(99,102,241,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.7) 1px, transparent 1px)',
          backgroundSize:
            '70px 70px',
          maskImage:
            'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
        }}
      />

      {/* =====================================================
          ANIMATION STYLES
      ====================================================== */}

      <style>
        {`
          @keyframes floatOne {
            0%,
            100% {
              transform: translate3d(0, 0, 0);
            }

            25% {
              transform: translate3d(120px, 60px, 0);
            }

            50% {
              transform: translate3d(220px, -40px, 0);
            }

            75% {
              transform: translate3d(80px, -100px, 0);
            }
          }

          @keyframes floatTwo {
            0%,
            100% {
              transform: translate3d(0, 0, 0);
            }

            25% {
              transform: translate3d(-100px, 70px, 0);
            }

            50% {
              transform: translate3d(-220px, -50px, 0);
            }

            75% {
              transform: translate3d(-80px, -120px, 0);
            }
          }

          @keyframes floatThree {
            0%,
            100% {
              transform: translate3d(0, 0, 0);
            }

            25% {
              transform: translate3d(100px, -50px, 0);
            }

            50% {
              transform: translate3d(180px, 70px, 0);
            }

            75% {
              transform: translate3d(60px, 120px, 0);
            }
          }

          @keyframes particleFloat {
            0%,
            100% {
              transform: translate3d(0, 0, 0) scale(1);
              opacity: 0.2;
            }

            25% {
              transform: translate3d(35px, -50px, 0) scale(1.3);
              opacity: 0.8;
            }

            50% {
              transform: translate3d(-25px, -100px, 0) scale(0.8);
              opacity: 0.35;
            }

            75% {
              transform: translate3d(-60px, -35px, 0) scale(1.2);
              opacity: 0.7;
            }
          }

          @keyframes particleFloatReverse {
            0%,
            100% {
              transform: translate3d(0, 0, 0);
              opacity: 0.15;
            }

            30% {
              transform: translate3d(-40px, 45px, 0);
              opacity: 0.6;
            }

            60% {
              transform: translate3d(50px, 90px, 0);
              opacity: 0.25;
            }

            80% {
              transform: translate3d(80px, 20px, 0);
              opacity: 0.55;
            }
          }

          @keyframes lightMove {
            0% {
              transform: translateX(-120%);
            }

            100% {
              transform: translateX(700%);
            }
          }

          @keyframes lightMoveReverse {
            0% {
              transform: translateX(700%);
            }

            100% {
              transform: translateX(-120%);
            }
          }

          @keyframes slowRotate {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }

          @keyframes slowRotateReverse {
            from {
              transform: rotate(360deg);
            }

            to {
              transform: rotate(0deg);
            }
          }

          @media (max-width: 640px) {
            .animated-background-particle {
              transform: scale(0.7);
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

export default AnimatedBackground;