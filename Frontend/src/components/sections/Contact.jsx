import { useState } from 'react';
import {
  FaEnvelope,
  FaLinkedinIn,
  FaGithub,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaCheckCircle,
  FaExclamationCircle,
} from 'react-icons/fa';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [status, setStatus] = useState('idle');

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

    /*
      Temporary frontend success flow.

      Backend contact API ko connect karne ke baad
      isi function ke andar API request add ki ja sakti hai.
    */
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setStatus('success');

    setFormData({
      name: '',
      email: '',
      message: '',
    });
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-gray-50 px-6 py-24 transition-colors duration-500 dark:bg-gray-900"
    >
      {/* Background Decoration */}
      <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-indigo-200/20 blur-3xl dark:bg-indigo-600/5" />

      <div className="pointer-events-none absolute -right-40 bottom-20 h-80 w-80 rounded-full bg-purple-200/20 blur-3xl dark:bg-purple-600/5" />

      <div className="relative mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <p className="mb-3 flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
            <FaEnvelope className="text-sm" />
            Get In Touch
          </p>

          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
            Let's{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400">
              Connect
            </span>
          </h2>

          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg dark:text-gray-400">
            Have a project, opportunity or just want to talk about
            development? Feel free to reach out.
          </p>
        </div>

        {/* Contact Content */}
        <div className="grid overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-950 lg:grid-cols-2">
          {/* Left Side */}
          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 p-8 text-white sm:p-10 lg:p-12">
            {/* Decorative Circles */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/10" />

            <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full border border-white/10" />

            <div className="relative">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] backdrop-blur-sm">
                Open to Opportunities
              </span>

              <h3 className="mt-7 max-w-md text-3xl font-extrabold leading-tight sm:text-4xl">
                Let's build something great together.
              </h3>

              <p className="mt-5 max-w-md text-sm leading-7 text-indigo-100 sm:text-base">
                I'm always interested in connecting with developers,
                recruiters, companies and people working on interesting
                technology projects.
              </p>

              {/* Contact Information */}
              <div className="mt-10 space-y-5">
                {/* Email */}
                <a
                  href="mailto:your-email@example.com"
                  className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white/15"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-lg">
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

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white/15"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-lg">
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

                {/* GitHub */}
                <a
                  href="https://github.com/realvivekrana"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white/15"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-lg">
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

                {/* Location */}
                <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-lg">
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

              {/* Availability */}
              <div className="mt-8 flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-300 opacity-75" />

                  <span className="relative inline-flex h-3 w-3 rounded-full bg-green-400" />
                </span>

                <span className="text-sm font-medium text-indigo-100">
                  Currently open to opportunities
                </span>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="p-8 sm:p-10 lg:p-12">
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

            {/* Success Message */}
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

            {/* Error Message */}
            {status === 'error' && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-500/20 dark:bg-red-500/5">
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
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
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-600 dark:focus:border-indigo-500 dark:focus:bg-gray-900"
                />
              </div>

              {/* Email */}
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
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-600 dark:focus:border-indigo-500 dark:focus:bg-gray-900"
                />
              </div>

              {/* Message */}
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
                  className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm leading-6 text-gray-900 outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-600 dark:focus:border-indigo-500 dark:focus:bg-gray-900"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={status === 'sending'}
                className="group inline-flex w-full items-center justify-center gap-3 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/20 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === 'sending' ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                    Sending...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="text-xs transition-transform duration-300 group-hover:translate-x-1" />

                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Prefer email?{' '}
            <a
              href="mailto:your-email@example.com"
              className="font-semibold text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Send me a direct message
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Contact;