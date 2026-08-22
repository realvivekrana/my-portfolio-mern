import { useState } from 'react';
import API from '../../utils/axios';

import {
  FaEnvelope,
  FaLinkedinIn,
  FaGithub,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaCheckCircle,
  FaExclamationCircle,
  FaStar,
  FaReact,
  FaNodeJs,
  FaDatabase,
} from 'react-icons/fa';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [status, setStatus] = useState('idle');

  /*
  |--------------------------------------------------------------------------
  | FORM CHANGE
  |--------------------------------------------------------------------------
  */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (status !== 'idle') {
      setStatus('idle');
    }
  };

  /*
  |--------------------------------------------------------------------------
  | FORM SUBMIT
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      setStatus('error');
      return;
    }

    setStatus('sending');

    try {
      const response = await API.post('/contact', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
      });

      if (response.data?.success) {
        setStatus('success');

        setFormData({
          name: '',
          email: '',
          message: '',
        });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Contact form submission failed:', error);
      setStatus('error');
    }
  };

  /*
  |--------------------------------------------------------------------------
  | RETURN
  |--------------------------------------------------------------------------
  */

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-gray-50 px-6 py-24 text-gray-900 transition-colors duration-500 dark:bg-gray-900 dark:text-white"
    >

      {/* =====================================================
          LIVE COSMIC BACKGROUND
      ====================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >

        {/* =================================================
            LARGE GLOW ORB - LEFT
        ================================================== */}

        <div
          className="
            absolute
            -left-32
            top-20
            h-72
            w-72
            rounded-full
            bg-indigo-300/20
            blur-3xl
            dark:bg-indigo-600/10
            animate-[contactOrbOne_14s_ease-in-out_infinite]
          "
        />

        {/* =================================================
            LARGE GLOW ORB - RIGHT
        ================================================== */}

        <div
          className="
            absolute
            -right-32
            top-1/3
            h-80
            w-80
            rounded-full
            bg-purple-300/20
            blur-3xl
            dark:bg-purple-600/10
            animate-[contactOrbTwo_17s_ease-in-out_infinite]
          "
        />

        {/* =================================================
            BLUE ORB
        ================================================== */}

        <div
          className="
            absolute
            bottom-10
            left-1/3
            h-64
            w-64
            rounded-full
            bg-blue-300/10
            blur-3xl
            dark:bg-blue-500/10
            animate-[contactOrbThree_20s_ease-in-out_infinite]
          "
        />

        {/* =================================================
            CENTRAL COSMIC GLOW
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
            bg-indigo-400/5
            blur-[120px]
            dark:bg-indigo-500/5
            animate-[contactCorePulse_8s_ease-in-out_infinite]
          "
        />

        {/* =================================================
            MOVING LIGHT
        ================================================== */}

        <div className="absolute left-0 top-[32%] h-px w-full overflow-hidden opacity-30 dark:opacity-40">
          <div
            className="
              h-full
              w-32
              bg-gradient-to-r
              from-transparent
              via-indigo-500
              to-transparent
              shadow-[0_0_15px_rgba(99,102,241,0.7)]
              animate-[contactLightMove_10s_linear_infinite]
            "
          />
        </div>

        {/* =================================================
            SECOND MOVING LIGHT
        ================================================== */}

        <div className="absolute left-0 top-[72%] h-px w-full overflow-hidden opacity-20 dark:opacity-30">
          <div
            className="
              h-full
              w-24
              bg-gradient-to-r
              from-transparent
              via-purple-500
              to-transparent
              shadow-[0_0_15px_rgba(168,85,247,0.7)]
              animate-[contactLightMoveReverse_14s_linear_infinite]
            "
          />
        </div>

        {/* =================================================
            FLOATING STARS
        ================================================== */}

        <span className="absolute left-[8%] top-[18%] h-1 w-1 rounded-full bg-indigo-400/50 animate-[contactStarOne_8s_ease-in-out_infinite]" />

        <span className="absolute left-[20%] top-[70%] h-1.5 w-1.5 rounded-full bg-purple-400/50 animate-[contactStarTwo_11s_ease-in-out_infinite]" />

        <span className="absolute right-[15%] top-[22%] h-1 w-1 rounded-full bg-blue-400/50 animate-[contactStarThree_9s_ease-in-out_infinite]" />

        <span className="absolute right-[28%] top-[65%] h-1.5 w-1.5 rounded-full bg-indigo-400/40 animate-[contactStarFour_12s_ease-in-out_infinite]" />

        <span className="absolute left-[45%] top-[12%] h-1 w-1 rounded-full bg-purple-400/50 animate-[contactStarFive_10s_ease-in-out_infinite]" />

        <span className="absolute bottom-[12%] left-[12%] h-1 w-1 rounded-full bg-cyan-400/40 animate-[contactStarSix_13s_ease-in-out_infinite]" />

        {/* =================================================
            FLOATING COSMIC PARTICLES
        ================================================== */}

        <div className="absolute left-[10%] top-[35%] animate-[contactParticleOne_15s_ease-in-out_infinite]">
          <FaStar className="text-xs text-indigo-400/30" />
        </div>

        <div className="absolute right-[10%] top-[45%] animate-[contactParticleTwo_18s_ease-in-out_infinite]">
          <FaStar className="text-sm text-purple-400/30" />
        </div>

        <div className="absolute left-[32%] bottom-[18%] animate-[contactParticleThree_16s_ease-in-out_infinite]">
          <FaStar className="text-xs text-blue-400/30" />
        </div>

        {/* =================================================
            GRID
        ================================================== */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.025]
            dark:opacity-[0.035]
          "
          style={{
            backgroundImage:
              'linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

      </div>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="relative z-10 mx-auto max-w-6xl">

        {/* =================================================
            SECTION HEADER
        ================================================== */}

        <div className="mb-16 text-center">

          <p className="mb-3 flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
            <FaEnvelope className="text-sm animate-[contactIconPulse_3s_ease-in-out_infinite]" />

            Get In Touch
          </p>

          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
            Let's{' '}

            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-purple-400 dark:to-blue-400">
              Connect
            </span>
          </h2>

          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_18px_rgba(99,102,241,0.4)]" />

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg dark:text-gray-400">
            Have a project, opportunity or just want to talk about
            development? Feel free to reach out.
          </p>

        </div>

        {/* =================================================
            CONTACT CONTENT
        ================================================== */}

        <div className="grid overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl shadow-indigo-500/5 dark:border-gray-800 dark:bg-gray-950 dark:shadow-indigo-500/10 lg:grid-cols-2">

          {/* =================================================
              LEFT SIDE
          ================================================== */}

          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 p-8 text-white sm:p-10 lg:p-12">

            {/* =================================================
                LEFT SIDE COSMIC ORBS
            ================================================== */}

            <div
              className="
                pointer-events-none
                absolute
                -right-20
                -top-20
                h-64
                w-64
                rounded-full
                border
                border-white/10
                animate-[contactRingOne_12s_ease-in-out_infinite]
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -bottom-32
                -left-20
                h-80
                w-80
                rounded-full
                border
                border-white/10
                animate-[contactRingTwo_16s_ease-in-out_infinite]
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                left-1/2
                top-1/2
                h-40
                w-40
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-white/5
                blur-3xl
                animate-[contactInnerGlow_7s_ease-in-out_infinite]
              "
            />

            {/* =================================================
                FLOATING PARTICLES INSIDE CARD
            ================================================== */}

            <span className="absolute left-[12%] top-[20%] h-1.5 w-1.5 rounded-full bg-white/30 animate-[contactCardParticleOne_7s_ease-in-out_infinite]" />

            <span className="absolute right-[18%] top-[35%] h-1 w-1 rounded-full bg-white/40 animate-[contactCardParticleTwo_9s_ease-in-out_infinite]" />

            <span className="absolute left-[25%] bottom-[25%] h-1 w-1 rounded-full bg-white/30 animate-[contactCardParticleThree_8s_ease-in-out_infinite]" />

            <span className="absolute right-[10%] bottom-[15%] h-1.5 w-1.5 rounded-full bg-white/20 animate-[contactCardParticleFour_11s_ease-in-out_infinite]" />

            <div className="relative">

              {/* =================================================
                  BADGE
              ================================================== */}

              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] backdrop-blur-sm">
                <span className="mr-2 h-1.5 w-1.5 animate-pulse rounded-full bg-green-300" />

                Open to Opportunities
              </span>

              {/* =================================================
                  HEADING
              ================================================== */}

              <h3 className="mt-7 max-w-md text-3xl font-extrabold leading-tight sm:text-4xl">
                Let's build something great together.
              </h3>

              <p className="mt-5 max-w-md text-sm leading-7 text-indigo-100 sm:text-base">
                I'm always interested in connecting with developers,
                recruiters, companies and people working on interesting
                technology projects.
              </p>

              {/* =================================================
                  CONTACT INFORMATION
              ================================================== */}

              <div className="mt-10 space-y-5">

                {/* =================================================
                    EMAIL
                ================================================== */}

                <a
                  href="mailto:vivekranaworks@gmail.com"
                  className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white/15 hover:shadow-[0_10px_35px_rgba(0,0,0,0.15)]"
                >

                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <FaEnvelope />
                  </span>

                  <span className="min-w-0">

                    <span className="block text-xs font-semibold uppercase tracking-wider text-indigo-200">
                      Email
                    </span>

                    <span className="mt-1 block truncate text-sm font-semibold text-white">
                      vivekranaworks@gmail.com
                    </span>

                  </span>

                </a>

                {/* =================================================
                    LINKEDIN
                ================================================== */}

                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white/15 hover:shadow-[0_10px_35px_rgba(0,0,0,0.15)]"
                >

                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <FaLinkedinIn />
                  </span>

                  <span>

                    <span className="block text-xs font-semibold uppercase tracking-wider text-indigo-200">
                      LinkedIn
                    </span>

                    <span className="mt-1 block text-sm font-semibold text-white">
                      Connect with me
                    </span>

                  </span>

                </a>

                {/* =================================================
                    GITHUB
                ================================================== */}

                <a
                  href="https://github.com/realvivekrana"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white/15 hover:shadow-[0_10px_35px_rgba(0,0,0,0.15)]"
                >

                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <FaGithub />
                  </span>

                  <span>

                    <span className="block text-xs font-semibold uppercase tracking-wider text-indigo-200">
                      GitHub
                    </span>

                    <span className="mt-1 block text-sm font-semibold text-white">
                      Explore my work
                    </span>

                  </span>

                </a>

                {/* =================================================
                    LOCATION
                ================================================== */}

                <div className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white/15">

                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-lg transition-transform duration-300 group-hover:scale-110">
                    <FaMapMarkerAlt />
                  </span>

                  <span>

                    <span className="block text-xs font-semibold uppercase tracking-wider text-indigo-200">
                      Location
                    </span>

                    <span className="mt-1 block text-sm font-semibold text-white">
                      Pune, India
                    </span>

                  </span>

                </div>

              </div>

              {/* =================================================
                  AVAILABILITY
              ================================================== */}

              <div className="mt-8 flex items-center gap-3">

                <span className="relative flex h-3 w-3">

                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-300 opacity-75" />

                  <span className="relative inline-flex h-3 w-3 rounded-full bg-green-400 shadow-[0_0_15px_rgba(74,222,128,0.8)]" />

                </span>

                <span className="text-sm font-medium text-indigo-100">
                  Currently open to opportunities
                </span>

              </div>

            </div>
          </div>

          {/* =================================================
              RIGHT SIDE - FORM
          ================================================== */}

          <div className="relative p-8 sm:p-10 lg:p-12">

            {/* =================================================
                FORM BACKGROUND PARTICLES
            ================================================== */}

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden"
            >

              <span className="absolute right-[10%] top-[15%] h-1 w-1 rounded-full bg-indigo-400/30 animate-[contactFormParticleOne_8s_ease-in-out_infinite]" />

              <span className="absolute left-[12%] top-[45%] h-1.5 w-1.5 rounded-full bg-purple-400/20 animate-[contactFormParticleTwo_10s_ease-in-out_infinite]" />

              <span className="absolute right-[18%] bottom-[18%] h-1 w-1 rounded-full bg-blue-400/30 animate-[contactFormParticleThree_12s_ease-in-out_infinite]" />

            </div>

            <div className="relative z-10">

              <div className="mb-8">

                <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600 dark:text-indigo-400">
                  Send a Message
                </p>

                <h3 className="mt-2 text-2xl font-extrabold text-gray-900 dark:text-white">
                  Tell me about your idea
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                  Fill out the form and I'll get back to you as soon as
                  possible.
                </p>

              </div>

              {/* =================================================
                  SUCCESS MESSAGE
              ================================================== */}

              {status === 'success' && (
                <div className="mb-6 animate-[fadeIn_0.4s_ease-out] rounded-2xl border border-green-200 bg-green-50 p-5 dark:border-green-500/20 dark:bg-green-500/5">

                  <div className="flex items-start gap-4">

                    <div className="flex h-10 w-10 shrink-0 animate-[scaleIn_0.4s_ease-out] items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400">
                      <FaCheckCircle />
                    </div>

                    <div>

                      <h4 className="font-bold text-green-700 dark:text-green-400">
                        Message sent successfully!
                      </h4>

                      <p className="mt-1 text-sm leading-6 text-green-600/80 dark:text-green-400/70">
                        Thank you for reaching out. I'll get back to you soon.
                      </p>

                    </div>

                  </div>

                </div>
              )}

              {/* =================================================
                  ERROR MESSAGE
              ================================================== */}

              {status === 'error' && (
                <div className="mb-6 animate-[fadeIn_0.3s_ease-out] rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-500/20 dark:bg-red-500/5">

                  <div className="flex items-start gap-4">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                      <FaExclamationCircle />
                    </div>

                    <div>

                      <h4 className="font-bold text-red-700 dark:text-red-400">
                        Please complete all fields.
                      </h4>

                      <p className="mt-1 text-sm text-red-600/80 dark:text-red-400/70">
                        Name, email and message are required.
                      </p>

                    </div>

                  </div>

                </div>
              )}

              {/* =================================================
                  FORM
              ================================================== */}

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* =================================================
                    NAME
                ================================================== */}

                <div>

                  <label
                    htmlFor="contact-name"
                    className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Name
                  </label>

                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    autoComplete="name"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition-all duration-300 placeholder:text-gray-400 focus:-translate-y-0.5 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-600 dark:focus:border-indigo-500 dark:focus:bg-gray-900"
                  />

                </div>

                {/* =================================================
                    EMAIL
                ================================================== */}

                <div>

                  <label
                    htmlFor="contact-email"
                    className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Email
                  </label>

                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition-all duration-300 placeholder:text-gray-400 focus:-translate-y-0.5 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-600 dark:focus:border-indigo-500 dark:focus:bg-gray-900"
                  />

                </div>

                {/* =================================================
                    MESSAGE
                ================================================== */}

                <div>

                  <label
                    htmlFor="contact-message"
                    className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Message
                  </label>

                  <textarea
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    placeholder="Tell me a little about your project or opportunity..."
                    className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm leading-6 text-gray-900 outline-none transition-all duration-300 placeholder:text-gray-400 focus:-translate-y-0.5 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-600 dark:focus:border-indigo-500 dark:focus:bg-gray-900"
                  />

                </div>

                {/* =================================================
                    SUBMIT
                ================================================== */}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/20 disabled:cursor-not-allowed disabled:opacity-70"
                >

                  {/* Button Shine */}

                  <span className="absolute inset-y-0 -left-20 w-16 -skew-x-12 bg-white/20 transition-transform duration-700 group-hover:translate-x-[500%]" />

                  {status === 'sending' ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="relative z-10 text-xs transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />

                      <span className="relative z-10">
                        Send Message
                      </span>
                    </>
                  )}

                </button>

              </form>

            </div>
          </div>

        </div>

        {/* =================================================
            BOTTOM CTA
        ================================================== */}

        <div className="mt-10 text-center">

          <p className="text-sm text-gray-500 dark:text-gray-500">

            Prefer email?{' '}

            <a
              href="mailto:vivekranaworks@gmail.com"
              className="font-semibold text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Send me a direct message
            </a>

          </p>

        </div>

      </div>

      {/* =====================================================
          CONTACT ANIMATION STYLES
      ====================================================== */}

      <style>
        {`
          /* ==================================================
             LARGE ORBS
          ================================================== */

          @keyframes contactOrbOne {
            0%,
            100% {
              transform: translate3d(0, 0, 0) scale(1);
            }

            50% {
              transform: translate3d(120px, 60px, 0) scale(1.18);
            }
          }

          @keyframes contactOrbTwo {
            0%,
            100% {
              transform: translate3d(0, 0, 0) scale(1);
            }

            50% {
              transform: translate3d(-110px, -80px, 0) scale(1.15);
            }
          }

          @keyframes contactOrbThree {
            0%,
            100% {
              transform: translate3d(0, 0, 0) scale(1);
            }

            50% {
              transform: translate3d(80px, -70px, 0) scale(1.2);
            }
          }

          @keyframes contactCorePulse {
            0%,
            100% {
              opacity: 0.25;
              transform: translate(-50%, -50%) scale(0.85);
            }

            50% {
              opacity: 0.7;
              transform: translate(-50%, -50%) scale(1.15);
            }
          }

          /* ==================================================
             MOVING LIGHTS
          ================================================== */

          @keyframes contactLightMove {
            0% {
              transform: translateX(-150%);
            }

            100% {
              transform: translateX(900%);
            }
          }

          @keyframes contactLightMoveReverse {
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

          @keyframes contactStarOne {
            0%,
            100% {
              transform: translate3d(0, 0, 0) scale(0.6);
              opacity: 0.2;
            }

            50% {
              transform: translate3d(40px, -50px, 0) scale(1.5);
              opacity: 0.9;
            }
          }

          @keyframes contactStarTwo {
            0%,
            100% {
              transform: translate3d(0, 0, 0);
              opacity: 0.2;
            }

            50% {
              transform: translate3d(-45px, -80px, 0) scale(1.5);
              opacity: 0.8;
            }
          }

          @keyframes contactStarThree {
            0%,
            100% {
              transform: translate3d(0, 0, 0) scale(0.5);
              opacity: 0.2;
            }

            50% {
              transform: translate3d(-50px, 60px, 0) scale(1.4);
              opacity: 0.9;
            }
          }

          @keyframes contactStarFour {
            0%,
            100% {
              transform: translate3d(0, 0, 0);
              opacity: 0.2;
            }

            50% {
              transform: translate3d(60px, -45px, 0);
              opacity: 0.8;
            }
          }

          @keyframes contactStarFive {
            0%,
            100% {
              transform: translate3d(0, 0, 0) scale(0.5);
              opacity: 0.2;
            }

            50% {
              transform: translate3d(-35px, 70px, 0) scale(1.5);
              opacity: 0.9;
            }
          }

          @keyframes contactStarSix {
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
             COSMIC PARTICLES
          ================================================== */

          @keyframes contactParticleOne {
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

          @keyframes contactParticleTwo {
            0%,
            100% {
              transform: translate3d(0, 0, 0) rotate(0deg);
              opacity: 0.2;
            }

            50% {
              transform: translate3d(-60px, 80px, 0) rotate(-180deg);
              opacity: 0.8;
            }
          }

          @keyframes contactParticleThree {
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
             LEFT CARD RINGS
          ================================================== */

          @keyframes contactRingOne {
            0%,
            100% {
              transform: rotate(0deg) scale(1);
            }

            50% {
              transform: rotate(180deg) scale(1.12);
            }
          }

          @keyframes contactRingTwo {
            0%,
            100% {
              transform: rotate(0deg) scale(1);
            }

            50% {
              transform: rotate(-180deg) scale(1.08);
            }
          }

          @keyframes contactInnerGlow {
            0%,
            100% {
              transform: translate(-50%, -50%) scale(0.8);
              opacity: 0.2;
            }

            50% {
              transform: translate(-50%, -50%) scale(1.2);
              opacity: 0.7;
            }
          }

          /* ==================================================
             CARD PARTICLES
          ================================================== */

          @keyframes contactCardParticleOne {
            0%,
            100% {
              transform: translate3d(0, 0, 0);
              opacity: 0.2;
            }

            50% {
              transform: translate3d(35px, -55px, 0);
              opacity: 0.9;
            }
          }

          @keyframes contactCardParticleTwo {
            0%,
            100% {
              transform: translate3d(0, 0, 0);
              opacity: 0.2;
            }

            50% {
              transform: translate3d(-40px, 50px, 0);
              opacity: 0.9;
            }
          }

          @keyframes contactCardParticleThree {
            0%,
            100% {
              transform: translate3d(0, 0, 0);
              opacity: 0.2;
            }

            50% {
              transform: translate3d(45px, -40px, 0);
              opacity: 0.8;
            }
          }

          @keyframes contactCardParticleFour {
            0%,
            100% {
              transform: translate3d(0, 0, 0);
              opacity: 0.2;
            }

            50% {
              transform: translate3d(-30px, -60px, 0);
              opacity: 0.8;
            }
          }

          /* ==================================================
             FORM PARTICLES
          ================================================== */

          @keyframes contactFormParticleOne {
            0%,
            100% {
              transform: translate3d(0, 0, 0);
              opacity: 0.2;
            }

            50% {
              transform: translate3d(-30px, 50px, 0);
              opacity: 0.8;
            }
          }

          @keyframes contactFormParticleTwo {
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

          @keyframes contactFormParticleThree {
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
             HEADER ICON
          ================================================== */

          @keyframes contactIconPulse {
            0%,
            100% {
              transform: scale(1) rotate(0deg);
              opacity: 0.7;
            }

            50% {
              transform: scale(1.2) rotate(8deg);
              opacity: 1;
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
    </section>
  );
}

export default Contact;