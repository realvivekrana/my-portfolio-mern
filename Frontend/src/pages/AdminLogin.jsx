import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FaLock,
  FaShieldAlt,
  FaArrowLeft,
  FaStar,
} from 'react-icons/fa';

import { useAuth } from '../context/AuthContext';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  /*
  |--------------------------------------------------------------------------
  | LOGIN
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    setLoading(true);

    try {
      await login(email, password);

      toast.success('Login successful!');

      navigate('/admin/pin');
    } catch (err) {
      const message =
        err.response?.data?.message ||
        'Login failed. Please try again.';

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | BACK TO PORTFOLIO
  |--------------------------------------------------------------------------
  */

  const handleBackToPortfolio = () => {
    navigate('/');
  };

  /*
  |--------------------------------------------------------------------------
  | RETURN
  |--------------------------------------------------------------------------
  */

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-50 px-6 py-10 transition-colors duration-500 dark:bg-gray-950">

      {/* =====================================================
          LIVE ANIMATED BACKGROUND
      ====================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >

        {/* =================================================
            LARGE LEFT GLOW
        ================================================== */}

        <div
          className="
            absolute
            -left-40
            top-10
            h-80
            w-80
            rounded-full
            bg-indigo-300/20
            blur-3xl
            dark:bg-indigo-600/10
            animate-[loginOrbOne_14s_ease-in-out_infinite]
          "
        />

        {/* =================================================
            LARGE RIGHT GLOW
        ================================================== */}

        <div
          className="
            absolute
            -right-40
            bottom-0
            h-96
            w-96
            rounded-full
            bg-purple-300/20
            blur-3xl
            dark:bg-purple-600/10
            animate-[loginOrbTwo_17s_ease-in-out_infinite]
          "
        />

        {/* =================================================
            CENTER GLOW
        ================================================== */}

        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-96
            w-96
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-blue-300/10
            blur-[120px]
            dark:bg-blue-500/5
            animate-[loginCorePulse_8s_ease-in-out_infinite]
          "
        />

        {/* =================================================
            FLOATING STARS
        ================================================== */}

        <span className="absolute left-[10%] top-[18%] h-1 w-1 rounded-full bg-indigo-500/40 animate-[loginStarOne_8s_ease-in-out_infinite]" />

        <span className="absolute left-[18%] top-[72%] h-1.5 w-1.5 rounded-full bg-purple-500/40 animate-[loginStarTwo_11s_ease-in-out_infinite]" />

        <span className="absolute right-[12%] top-[20%] h-1 w-1 rounded-full bg-blue-500/40 animate-[loginStarThree_9s_ease-in-out_infinite]" />

        <span className="absolute right-[20%] bottom-[20%] h-1.5 w-1.5 rounded-full bg-indigo-500/40 animate-[loginStarFour_12s_ease-in-out_infinite]" />

        <span className="absolute left-[45%] top-[10%] h-1 w-1 rounded-full bg-purple-500/40 animate-[loginStarFive_10s_ease-in-out_infinite]" />

        <span className="absolute left-[35%] bottom-[12%] h-1 w-1 rounded-full bg-blue-500/30 animate-[loginStarSix_13s_ease-in-out_infinite]" />

        {/* =================================================
            STAR ICON PARTICLES
        ================================================== */}

        <div className="absolute left-[12%] top-[38%] animate-[loginParticleOne_14s_ease-in-out_infinite]">
          <FaStar className="text-xs text-indigo-400/30" />
        </div>

        <div className="absolute right-[14%] top-[42%] animate-[loginParticleTwo_17s_ease-in-out_infinite]">
          <FaStar className="text-sm text-purple-400/30" />
        </div>

        <div className="absolute bottom-[22%] left-[28%] animate-[loginParticleThree_15s_ease-in-out_infinite]">
          <FaStar className="text-xs text-blue-400/30" />
        </div>

        {/* =================================================
            MOVING LIGHT
        ================================================== */}

        <div className="absolute left-0 top-[28%] h-px w-full overflow-hidden opacity-30 dark:opacity-40">
          <div
            className="
              h-full
              w-28
              bg-gradient-to-r
              from-transparent
              via-indigo-500
              to-transparent
              shadow-[0_0_20px_rgba(99,102,241,0.7)]
              animate-[loginLightMove_9s_linear_infinite]
            "
          />
        </div>

        {/* =================================================
            SECOND MOVING LIGHT
        ================================================== */}

        <div className="absolute left-0 top-[76%] h-px w-full overflow-hidden opacity-20 dark:opacity-30">
          <div
            className="
              h-full
              w-24
              bg-gradient-to-r
              from-transparent
              via-purple-500
              to-transparent
              shadow-[0_0_20px_rgba(168,85,247,0.7)]
              animate-[loginLightMoveReverse_13s_linear_infinite]
            "
          />
        </div>

        {/* =================================================
            COSMIC GRID
        ================================================== */}

        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

      </div>

      {/* =====================================================
          MAIN LOGIN CONTAINER
      ====================================================== */}

      <div className="relative z-10 w-full max-w-md">

        {/* =================================================
            BACK TO PORTFOLIO
        ================================================== */}

        <button
          type="button"
          onClick={handleBackToPortfolio}
          className="
            group
            mb-6
            inline-flex
            items-center
            gap-2
            text-sm
            font-medium
            text-gray-500
            transition-all
            duration-300
            hover:-translate-x-0.5
            hover:text-indigo-600
            dark:text-gray-400
            dark:hover:text-indigo-400
          "
        >
          <FaArrowLeft
            className="
              transition-transform
              duration-300
              group-hover:-translate-x-1
            "
          />

          Back to Portfolio
        </button>

        {/* =================================================
            HEADER
        ================================================== */}

        <div className="mb-8 text-center">

          {/* Shield */}

          <div className="relative mx-auto mb-5 h-16 w-16">

            {/* Outer Glow */}

            <div
              className="
                absolute
                inset-0
                rounded-2xl
                bg-indigo-500/20
                blur-xl
                animate-[loginShieldGlow_3s_ease-in-out_infinite]
              "
            />

            {/* Icon Box */}

            <div
              className="
                relative
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                border
                border-indigo-200
                bg-indigo-100
                text-indigo-600
                shadow-lg
                shadow-indigo-500/10
                transition-transform
                duration-500
                hover:scale-110
                dark:border-indigo-500/20
                dark:bg-indigo-500/10
                dark:text-indigo-400
              "
            >
              <FaShieldAlt
                className="
                  text-2xl
                  animate-[loginShieldFloat_4s_ease-in-out_infinite]
                "
              />
            </div>

          </div>

          {/* Heading */}

          <h1 className="mb-2 text-3xl font-extrabold text-gray-900 dark:text-white">
            Admin Login
          </h1>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            Sign in to manage your portfolio
          </p>

        </div>

        {/* =================================================
            LOGIN FORM
        ================================================== */}

        <form
          onSubmit={handleSubmit}
          className="
            group/form
            relative
            space-y-6
            overflow-hidden
            rounded-3xl
            border
            border-gray-200
            bg-white/90
            p-7
            shadow-xl
            shadow-indigo-500/5
            backdrop-blur-xl
            transition-all
            duration-500
            hover:border-indigo-200
            hover:shadow-2xl
            hover:shadow-indigo-500/10
            dark:border-gray-800
            dark:bg-gray-900/90
            dark:hover:border-indigo-500/20
            dark:hover:shadow-indigo-500/10
            sm:p-8
          "
        >

          {/* =================================================
              FORM TOP LIGHT
          ================================================== */}

          <div
            className="
              pointer-events-none
              absolute
              -left-20
              -top-20
              h-40
              w-40
              rounded-full
              bg-indigo-500/10
              blur-3xl
              transition-transform
              duration-1000
              group-hover/form:translate-x-8
              group-hover/form:translate-y-8
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-20
              -right-20
              h-40
              w-40
              rounded-full
              bg-purple-500/10
              blur-3xl
              transition-transform
              duration-1000
              group-hover/form:-translate-x-8
              group-hover/form:-translate-y-8
            "
          />

          {/* =================================================
              EMAIL
          ================================================== */}

          <div className="relative z-10">

            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Email
            </label>

            <div className="group/input relative">

              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="admin@example.com"
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-300
                  bg-white
                  px-4
                  py-3
                  text-gray-900
                  outline-none
                  transition-all
                  duration-300
                  placeholder:text-gray-400
                  focus:-translate-y-0.5
                  focus:border-indigo-500
                  focus:bg-white
                  focus:ring-4
                  focus:ring-indigo-500/10
                  dark:border-gray-700
                  dark:bg-gray-950
                  dark:text-white
                  dark:focus:border-indigo-500
                  dark:focus:ring-indigo-500/10
                "
              />

              {/* Input Glow */}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  -z-10
                  rounded-xl
                  bg-indigo-500/20
                  opacity-0
                  blur-md
                  transition-opacity
                  duration-300
                  group-focus-within/input:opacity-100
                "
              />

            </div>

          </div>

          {/* =================================================
              PASSWORD
          ================================================== */}

          <div className="relative z-10">

            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Password
            </label>

            <div className="group/input relative">

              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••"
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-300
                  bg-white
                  px-4
                  py-3
                  text-gray-900
                  outline-none
                  transition-all
                  duration-300
                  placeholder:text-gray-400
                  focus:-translate-y-0.5
                  focus:border-indigo-500
                  focus:bg-white
                  focus:ring-4
                  focus:ring-indigo-500/10
                  dark:border-gray-700
                  dark:bg-gray-950
                  dark:text-white
                  dark:focus:border-indigo-500
                  dark:focus:ring-indigo-500/10
                "
              />

              {/* Input Glow */}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  -z-10
                  rounded-xl
                  bg-purple-500/20
                  opacity-0
                  blur-md
                  transition-opacity
                  duration-300
                  group-focus-within/input:opacity-100
                "
              />

            </div>

          </div>

          {/* =================================================
              SIGN IN BUTTON
          ================================================== */}

          <button
            type="submit"
            disabled={loading}
            className="
              group/button
              relative
              z-10
              flex
              w-full
              items-center
              justify-center
              gap-2
              overflow-hidden
              rounded-xl
              bg-indigo-600
              py-3.5
              font-semibold
              text-white
              shadow-lg
              shadow-indigo-600/20
              transition-all
              duration-300
              hover:-translate-y-1
              hover:bg-indigo-700
              hover:shadow-xl
              hover:shadow-indigo-600/30
              disabled:cursor-not-allowed
              disabled:opacity-60
              disabled:hover:translate-y-0
            "
          >

            {/* =================================================
                BUTTON SHINE
            ================================================== */}

            <span
              className="
                absolute
                inset-y-0
                -left-24
                w-16
                -skew-x-12
                bg-white/25
                transition-transform
                duration-700
                group-hover/button:translate-x-[500%]
              "
            />

            {/* =================================================
                BUTTON GLOW
            ================================================== */}

            <span
              className="
                absolute
                inset-0
                rounded-xl
                bg-indigo-400/20
                opacity-0
                blur-xl
                transition-opacity
                duration-300
                group-hover/button:opacity-100
              "
            />

            {loading ? (
              <>
                <span className="relative z-10 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                <span className="relative z-10">
                  Signing in...
                </span>
              </>
            ) : (
              <>
                <FaLock
                  className="
                    relative
                    z-10
                    text-sm
                    transition-transform
                    duration-300
                    group-hover/button:rotate-12
                  "
                />

                <span className="relative z-10">
                  Sign In
                </span>
              </>
            )}

          </button>

          {/* =================================================
              PROTECTED AREA
          ================================================== */}

          <div className="relative z-10 flex items-center justify-center gap-2">

            <span className="relative flex h-2 w-2">

              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />

              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />

            </span>

            <p className="text-center text-xs text-gray-400 dark:text-gray-500">
              Protected admin area
            </p>

          </div>

        </form>
      </div>

      {/* =====================================================
          ANIMATION STYLES
      ====================================================== */}

      <style>
        {`
          /* ==================================================
             LARGE ORBS
          ================================================== */

          @keyframes loginOrbOne {
            0%,
            100% {
              transform: translate3d(0, 0, 0) scale(1);
            }

            50% {
              transform: translate3d(120px, 70px, 0) scale(1.18);
            }
          }

          @keyframes loginOrbTwo {
            0%,
            100% {
              transform: translate3d(0, 0, 0) scale(1);
            }

            50% {
              transform: translate3d(-120px, -80px, 0) scale(1.15);
            }
          }

          /* ==================================================
             CENTER GLOW
          ================================================== */

          @keyframes loginCorePulse {
            0%,
            100% {
              opacity: 0.2;
              transform: translate(-50%, -50%) scale(0.8);
            }

            50% {
              opacity: 0.65;
              transform: translate(-50%, -50%) scale(1.15);
            }
          }

          /* ==================================================
             MOVING LIGHTS
          ================================================== */

          @keyframes loginLightMove {
            0% {
              transform: translateX(-150%);
            }

            100% {
              transform: translateX(900%);
            }
          }

          @keyframes loginLightMoveReverse {
            0% {
              transform: translateX(900%);
            }

            100% {
              transform: translateX(-150%);
            }
          }

          /* ==================================================
             STARS
          ================================================== */

          @keyframes loginStarOne {
            0%,
            100% {
              transform: translate3d(0, 0, 0) scale(0.5);
              opacity: 0.2;
            }

            50% {
              transform: translate3d(50px, -60px, 0) scale(1.5);
              opacity: 0.9;
            }
          }

          @keyframes loginStarTwo {
            0%,
            100% {
              transform: translate3d(0, 0, 0);
              opacity: 0.2;
            }

            50% {
              transform: translate3d(-40px, -80px, 0) scale(1.5);
              opacity: 0.8;
            }
          }

          @keyframes loginStarThree {
            0%,
            100% {
              transform: translate3d(0, 0, 0) scale(0.5);
              opacity: 0.2;
            }

            50% {
              transform: translate3d(-60px, 60px, 0) scale(1.5);
              opacity: 0.9;
            }
          }

          @keyframes loginStarFour {
            0%,
            100% {
              transform: translate3d(0, 0, 0);
              opacity: 0.2;
            }

            50% {
              transform: translate3d(60px, -50px, 0) scale(1.4);
              opacity: 0.8;
            }
          }

          @keyframes loginStarFive {
            0%,
            100% {
              transform: translate3d(0, 0, 0);
              opacity: 0.2;
            }

            50% {
              transform: translate3d(-40px, 70px, 0) scale(1.5);
              opacity: 0.9;
            }
          }

          @keyframes loginStarSix {
            0%,
            100% {
              transform: translate3d(0, 0, 0);
              opacity: 0.2;
            }

            50% {
              transform: translate3d(45px, -55px, 0) scale(1.4);
              opacity: 0.8;
            }
          }

          /* ==================================================
             PARTICLES
          ================================================== */

          @keyframes loginParticleOne {
            0%,
            100% {
              transform: translate3d(0, 0, 0) rotate(0deg);
              opacity: 0.2;
            }

            50% {
              transform: translate3d(50px, -70px, 0) rotate(180deg);
              opacity: 0.8;
            }
          }

          @keyframes loginParticleTwo {
            0%,
            100% {
              transform: translate3d(0, 0, 0) rotate(0deg);
              opacity: 0.2;
            }

            50% {
              transform: translate3d(-60px, 70px, 0) rotate(-180deg);
              opacity: 0.8;
            }
          }

          @keyframes loginParticleThree {
            0%,
            100% {
              transform: translate3d(0, 0, 0) rotate(0deg);
              opacity: 0.2;
            }

            50% {
              transform: translate3d(70px, -50px, 0) rotate(180deg);
              opacity: 0.8;
            }
          }

          /* ==================================================
             SHIELD
          ================================================== */

          @keyframes loginShieldGlow {
            0%,
            100% {
              transform: scale(0.9);
              opacity: 0.3;
            }

            50% {
              transform: scale(1.2);
              opacity: 0.8;
            }
          }

          @keyframes loginShieldFloat {
            0%,
            100% {
              transform: translateY(0) rotate(0deg);
            }

            50% {
              transform: translateY(-5px) rotate(4deg);
            }
          }

          /* ==================================================
             ACCESSIBILITY
          ================================================== */

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

export default AdminLogin;