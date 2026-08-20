import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FaLock,
  FaShieldAlt,
  FaArrowRight,
  FaStar,
} from 'react-icons/fa';

import { useAuth } from '../context/AuthContext';

function AdminPin() {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  const inputRef = useRef(null);

  const {
    admin,
    verifyPin,
    logout,
  } = useAuth();

  const navigate = useNavigate();

  /*
  |--------------------------------------------------------------------------
  | AUTO FOCUS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | CHECK ADMIN
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!admin) {
      navigate('/admin/login', {
        replace: true,
      });
    }
  }, [admin, navigate]);

  /*
  |--------------------------------------------------------------------------
  | PIN CHANGE
  |--------------------------------------------------------------------------
  */

  const handlePinChange = (e) => {
    const value = e.target.value;

    if (/^\d{0,4}$/.test(value)) {
      setPin(value);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | VERIFY PIN
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (pin.length !== 4) {
      toast.error('Please enter your 4-digit PIN');
      return;
    }

    setLoading(true);

    try {
      await verifyPin(pin);

      toast.success('PIN verified successfully!');

      navigate('/admin/dashboard', {
        replace: true,
      });
    } catch (err) {
      setPin('');

      const message =
        err.response?.data?.message ||
        'Invalid PIN. Please try again.';

      toast.error(message);

      inputRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | LOGOUT
  |--------------------------------------------------------------------------
  */

  const handleLogout = () => {
    logout();

    navigate('/admin/login', {
      replace: true,
    });
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
            LARGE LEFT ORB
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
            animate-[pinOrbOne_14s_ease-in-out_infinite]
          "
        />

        {/* =================================================
            LARGE RIGHT ORB
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
            animate-[pinOrbTwo_17s_ease-in-out_infinite]
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
            animate-[pinCorePulse_8s_ease-in-out_infinite]
          "
        />

        {/* =================================================
            FLOATING STARS
        ================================================== */}

        <span className="absolute left-[9%] top-[18%] h-1 w-1 rounded-full bg-indigo-500/40 animate-[pinStarOne_8s_ease-in-out_infinite]" />

        <span className="absolute left-[17%] top-[72%] h-1.5 w-1.5 rounded-full bg-purple-500/40 animate-[pinStarTwo_11s_ease-in-out_infinite]" />

        <span className="absolute right-[12%] top-[20%] h-1 w-1 rounded-full bg-blue-500/40 animate-[pinStarThree_9s_ease-in-out_infinite]" />

        <span className="absolute right-[20%] bottom-[20%] h-1.5 w-1.5 rounded-full bg-indigo-500/40 animate-[pinStarFour_12s_ease-in-out_infinite]" />

        <span className="absolute left-[44%] top-[10%] h-1 w-1 rounded-full bg-purple-500/40 animate-[pinStarFive_10s_ease-in-out_infinite]" />

        <span className="absolute left-[34%] bottom-[12%] h-1 w-1 rounded-full bg-blue-500/30 animate-[pinStarSix_13s_ease-in-out_infinite]" />

        {/* =================================================
            STAR ICON PARTICLES
        ================================================== */}

        <div className="absolute left-[12%] top-[38%] animate-[pinParticleOne_14s_ease-in-out_infinite]">
          <FaStar className="text-xs text-indigo-400/30" />
        </div>

        <div className="absolute right-[14%] top-[42%] animate-[pinParticleTwo_17s_ease-in-out_infinite]">
          <FaStar className="text-sm text-purple-400/30" />
        </div>

        <div className="absolute bottom-[22%] left-[28%] animate-[pinParticleThree_15s_ease-in-out_infinite]">
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
              animate-[pinLightMove_9s_linear_infinite]
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
              animate-[pinLightMoveReverse_13s_linear_infinite]
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
          MAIN CONTAINER
      ====================================================== */}

      <div className="relative z-10 w-full max-w-md">

        {/* =================================================
            SECURITY HEADER
        ================================================== */}

        <div className="mb-8 text-center">

          {/* Animated Shield */}

          <div className="relative mx-auto mb-5 h-16 w-16">

            {/* Glow */}

            <div
              className="
                absolute
                inset-0
                rounded-2xl
                bg-indigo-500/20
                blur-xl
                animate-[pinShieldGlow_3s_ease-in-out_infinite]
              "
            />

            {/* Rotating Ring */}

            <div
              className="
                absolute
                -inset-2
                rounded-3xl
                border
                border-indigo-400/20
                animate-[pinRingRotate_8s_linear_infinite]
              "
            />

            {/* Icon */}

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
                  animate-[pinShieldFloat_4s_ease-in-out_infinite]
                "
              />
            </div>

          </div>

          {/* Label */}

          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
            Additional Security
          </p>

          {/* Heading */}

          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Admin Verification
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-500 dark:text-gray-400">
            Enter your 4-digit security PIN to access the admin dashboard.
          </p>

        </div>

        {/* =================================================
            PIN CARD
        ================================================== */}

        <form
          onSubmit={handleSubmit}
          className="
            group/card
            relative
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
              CARD GLOW - TOP
          ================================================== */}

          <div
            className="
              pointer-events-none
              absolute
              -left-24
              -top-24
              h-48
              w-48
              rounded-full
              bg-indigo-500/10
              blur-3xl
              transition-transform
              duration-1000
              group-hover/card:translate-x-10
              group-hover/card:translate-y-10
            "
          />

          {/* =================================================
              CARD GLOW - BOTTOM
          ================================================== */}

          <div
            className="
              pointer-events-none
              absolute
              -bottom-24
              -right-24
              h-48
              w-48
              rounded-full
              bg-purple-500/10
              blur-3xl
              transition-transform
              duration-1000
              group-hover/card:-translate-x-10
              group-hover/card:-translate-y-10
            "
          />

          {/* =================================================
              FLOATING CARD PARTICLES
          ================================================== */}

          <span className="absolute right-[12%] top-[15%] h-1 w-1 rounded-full bg-indigo-400/40 animate-[pinCardParticleOne_8s_ease-in-out_infinite]" />

          <span className="absolute left-[10%] top-[45%] h-1.5 w-1.5 rounded-full bg-purple-400/30 animate-[pinCardParticleTwo_10s_ease-in-out_infinite]" />

          <span className="absolute right-[15%] bottom-[18%] h-1 w-1 rounded-full bg-blue-400/30 animate-[pinCardParticleThree_12s_ease-in-out_infinite]" />

          {/* =================================================
              LOGGED IN USER
          ================================================== */}

          <div className="relative z-10 mb-6 flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-100 hover:shadow-md dark:border-gray-800 dark:bg-gray-950 dark:hover:border-indigo-500/20">

            {/* Lock Icon */}

            <div className="relative">

              <div
                className="
                  absolute
                  inset-0
                  rounded-full
                  bg-indigo-500/20
                  blur-md
                  animate-[pinLockGlow_3s_ease-in-out_infinite]
                "
              />

              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                <FaLock
                  className="
                    animate-[pinLockFloat_4s_ease-in-out_infinite]
                  "
                />
              </div>

            </div>

            {/* User */}

            <div className="min-w-0">

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Signed in as
              </p>

              <p className="truncate text-sm font-bold text-gray-900 dark:text-white">
                {admin?.username || admin?.email || 'Admin'}
              </p>

            </div>

          </div>

          {/* =================================================
              PIN INPUT
          ================================================== */}

          <div className="relative z-10">

            <label
              htmlFor="admin-pin"
              className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              4-Digit PIN
            </label>

            <div className="group/input relative">

              <input
                ref={inputRef}
                id="admin-pin"
                type="password"
                inputMode="numeric"
                autoComplete="off"
                maxLength={4}
                value={pin}
                onChange={handlePinChange}
                placeholder="••••"
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-300
                  bg-white
                  px-4
                  py-4
                  text-center
                  text-3xl
                  font-bold
                  tracking-[0.6em]
                  text-gray-900
                  outline-none
                  transition-all
                  duration-300
                  placeholder:tracking-[0.4em]
                  placeholder:text-gray-300
                  focus:-translate-y-0.5
                  focus:border-indigo-500
                  focus:ring-4
                  focus:ring-indigo-500/10
                  dark:border-gray-700
                  dark:bg-gray-950
                  dark:text-white
                  dark:placeholder:text-gray-700
                  dark:focus:border-indigo-500
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

            <p className="mt-2 text-center text-xs text-gray-400 dark:text-gray-500">
              Enter exactly 4 digits
            </p>

            {/* PIN Progress */}

            <div className="mx-auto mt-4 flex max-w-[180px] justify-center gap-2">

              {[0, 1, 2, 3].map((index) => (
                <span
                  key={index}
                  className={`
                    h-1.5
                    flex-1
                    rounded-full
                    transition-all
                    duration-300
                    ${
                      pin.length > index
                        ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.6)]'
                        : 'bg-gray-200 dark:bg-gray-800'
                    }
                  `}
                />
              ))}

            </div>

          </div>

          {/* =================================================
              VERIFY BUTTON
          ================================================== */}

          <button
            type="submit"
            disabled={loading || pin.length !== 4}
            className="
              group/button
              relative
              z-10
              mt-6
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
              disabled:opacity-50
              disabled:hover:translate-y-0
            "
          >

            {/* Button Shine */}

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

            {/* Button Glow */}

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
                  Verifying...
                </span>
              </>
            ) : (
              <>
                <span className="relative z-10">
                  Verify PIN
                </span>

                <FaArrowRight
                  className="
                    relative
                    z-10
                    text-sm
                    transition-transform
                    duration-300
                    group-hover/button:translate-x-1
                  "
                />
              </>
            )}

          </button>

          {/* =================================================
              LOGOUT
          ================================================== */}

          <button
            type="button"
            onClick={handleLogout}
            className="
              relative
              z-10
              mt-4
              w-full
              rounded-xl
              py-3
              text-sm
              font-semibold
              text-gray-500
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-gray-100
              hover:text-gray-900
              dark:text-gray-400
              dark:hover:bg-gray-800
              dark:hover:text-white
            "
          >
            Use a different account
          </button>

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

          @keyframes pinOrbOne {
            0%,
            100% {
              transform: translate3d(0, 0, 0) scale(1);
            }

            50% {
              transform: translate3d(120px, 70px, 0) scale(1.18);
            }
          }

          @keyframes pinOrbTwo {
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

          @keyframes pinCorePulse {
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

          @keyframes pinLightMove {
            0% {
              transform: translateX(-150%);
            }

            100% {
              transform: translateX(900%);
            }
          }

          @keyframes pinLightMoveReverse {
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

          @keyframes pinStarOne {
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

          @keyframes pinStarTwo {
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

          @keyframes pinStarThree {
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

          @keyframes pinStarFour {
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

          @keyframes pinStarFive {
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

          @keyframes pinStarSix {
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

          @keyframes pinParticleOne {
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

          @keyframes pinParticleTwo {
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

          @keyframes pinParticleThree {
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

          @keyframes pinShieldGlow {
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

          @keyframes pinShieldFloat {
            0%,
            100% {
              transform: translateY(0) rotate(0deg);
            }

            50% {
              transform: translateY(-5px) rotate(4deg);
            }
          }

          @keyframes pinRingRotate {
            0% {
              transform: rotate(0deg) scale(0.95);
            }

            50% {
              transform: rotate(180deg) scale(1.05);
            }

            100% {
              transform: rotate(360deg) scale(0.95);
            }
          }

          /* ==================================================
             CARD PARTICLES
          ================================================== */

          @keyframes pinCardParticleOne {
            0%,
            100% {
              transform: translate3d(0, 0, 0);
              opacity: 0.2;
            }

            50% {
              transform: translate3d(-30px, 50px, 0);
              opacity: 0.9;
            }
          }

          @keyframes pinCardParticleTwo {
            0%,
            100% {
              transform: translate3d(0, 0, 0);
              opacity: 0.2;
            }

            50% {
              transform: translate3d(45px, -60px, 0);
              opacity: 0.8;
            }
          }

          @keyframes pinCardParticleThree {
            0%,
            100% {
              transform: translate3d(0, 0, 0);
              opacity: 0.2;
            }

            50% {
              transform: translate3d(-50px, -40px, 0);
              opacity: 0.8;
            }
          }

          /* ==================================================
             LOCK
          ================================================== */

          @keyframes pinLockGlow {
            0%,
            100% {
              transform: scale(0.9);
              opacity: 0.3;
            }

            50% {
              transform: scale(1.15);
              opacity: 0.8;
            }
          }

          @keyframes pinLockFloat {
            0%,
            100% {
              transform: translateY(0);
            }

            50% {
              transform: translateY(-3px);
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

export default AdminPin;