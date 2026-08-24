import { useEffect, useState } from 'react';

import API from '../../utils/axios';

function Footer() {
  /*
  |--------------------------------------------------------------------------
  | STATE
  |--------------------------------------------------------------------------
  */

  const [portfolio, setPortfolio] =
    useState(null);

  const [resumeLoading, setResumeLoading] =
    useState(false);

  const [resumeError, setResumeError] =
    useState('');

  /*
  |--------------------------------------------------------------------------
  | CURRENT YEAR
  |--------------------------------------------------------------------------
  */

  const currentYear =
  new Date().getFullYear();

const handleSectionClick = (
  event,
  sectionId
) => {
  event.preventDefault();

  const target =
    document.getElementById(sectionId);

  if (target) {
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  } else {
    window.location.hash = sectionId;
  }
};

  /*
  |--------------------------------------------------------------------------
  | FETCH PORTFOLIO
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response =
          await API.get('/portfolio');

        setPortfolio(
          response.data?.data || null
        );
      } catch (error) {
        console.error(
          'Footer portfolio fetch error:',
          error
        );

        setPortfolio(null);
      }
    };

    fetchPortfolio();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | PORTFOLIO VISIBILITY
  |--------------------------------------------------------------------------
  */

  const portfolioSettings =
    portfolio?.settings || {};

  const portfolioVisibility =
    portfolioSettings?.portfolioVisibility ||
    'public';

  const isPrivate =
    portfolio?.isPrivate === true ||
    portfolioVisibility === 'private';

  /*
  |--------------------------------------------------------------------------
  | RESUME AVAILABILITY
  |--------------------------------------------------------------------------
  */

  // FIX: `resume.url` has a schema default ('/resume.pdf') that is
  // truthy even before any resume is ever uploaded. Only
  // `resume.fileName` (the Cloudinary public_id) is reliable proof
  // that a real resume file exists.
  const hasResume =
    Boolean(
      portfolio?.resume?.fileName
    );

  /*
  |--------------------------------------------------------------------------
  | PUBLIC RESUME ENDPOINT
  |--------------------------------------------------------------------------
  |
  | Resume direct /uploads URL se nahi khulega.
  |
  | Backend public endpoint visibility check karega.
  |
  |--------------------------------------------------------------------------
  */

  const publicResumeEndpoint =
    '/portfolio/upload/public-resume';

  /*
  |--------------------------------------------------------------------------
  | FETCH RESUME AS BLOB
  |--------------------------------------------------------------------------
  */

  const getResumeBlob = async () => {
    try {
      setResumeLoading(true);

      setResumeError('');

      /*
      |--------------------------------------------------------------------------
      | ✅ FIX: withCredentials: false
      |--------------------------------------------------------------------------
      |
      | This is a PUBLIC endpoint that redirects to Cloudinary.
      | Cloudinary's raw-file responses use a wildcard
      | Access-Control-Allow-Origin: *, which browsers reject
      | whenever the request's credentials mode is 'include' — even
      | though the file itself loads fine. No auth is needed here
      | anyway (public resume), so credentials are unnecessary.
      |
      |--------------------------------------------------------------------------
      */

      const response =
        await API.get(
          publicResumeEndpoint,
          {
            responseType: 'blob',
            withCredentials: false,
          }
        );

      if (
        !response.data ||
        response.data.size === 0
      ) {
        throw new Error(
          'Resume file is empty or unavailable.'
        );
      }

      return response.data;
    } catch (error) {
      console.error(
        'Resume fetch error:',
        error
      );

      let message =
        'Unable to load resume.';

      /*
      |--------------------------------------------------------------------------
      | BACKEND ERROR RESPONSE
      |--------------------------------------------------------------------------
      */

      if (
        error?.response?.data instanceof Blob
      ) {
        try {
          const text =
            await error.response.data.text();

          const parsed =
            JSON.parse(text);

          if (parsed?.message) {
            message =
              parsed.message;
          }
        } catch (parseError) {
          console.error(
            'Resume error parsing failed:',
            parseError
          );
        }
      } else if (
        error?.response?.data?.message
      ) {
        message =
          error.response.data.message;
      } else if (
        error?.message
      ) {
        message =
          error.message;
      }

      setResumeError(message);

      return null;
    } finally {
      setResumeLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | VIEW RESUME
  |--------------------------------------------------------------------------
  */

  const handleViewResume = async () => {
    if (isPrivate) {
      setResumeError(
        'Resume is currently private.'
      );

      return;
    }

    const blob =
      await getResumeBlob();

    if (!blob) {
      return;
    }

    const blobUrl =
      window.URL.createObjectURL(
        blob
      );

    const newWindow =
      window.open(
        blobUrl,
        '_blank',
        'noopener,noreferrer'
      );

    if (!newWindow) {
      setResumeError(
        'Unable to open resume. Please allow popups for this website.'
      );
    }

    setTimeout(() => {
      window.URL.revokeObjectURL(
        blobUrl
      );
    }, 60000);
  };

  /*
  |--------------------------------------------------------------------------
  | DOWNLOAD RESUME
  |--------------------------------------------------------------------------
  */

  const handleDownloadResume =
    async () => {
      if (isPrivate) {
        setResumeError(
          'Resume is currently private.'
        );

        return;
      }

      const blob =
        await getResumeBlob();

      if (!blob) {
        return;
      }

      const blobUrl =
        window.URL.createObjectURL(
          blob
        );

      const link =
        document.createElement('a');

      link.href =
        blobUrl;

      link.download =
        'Vivek-Kumar-Rana-Resume.pdf';

      document.body.appendChild(
        link
      );

      link.click();

      document.body.removeChild(
        link
      );

      setTimeout(() => {
        window.URL.revokeObjectURL(
          blobUrl
        );
      }, 1000);
    };

  /*
  |--------------------------------------------------------------------------
  | PORTFOLIO DATA
  |--------------------------------------------------------------------------
  */

  const github =
    portfolio?.socialLinks?.github ||
    'https://github.com/realvivekrana';

  const linkedin =
    portfolio?.socialLinks?.linkedin ||
    '';

  const email =
    portfolio?.contact?.email ||
    '';

  const phone =
    portfolio?.contact?.phone ||
    '';

  const location =
    portfolio?.contact?.location ||
    '';

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */


  // FOOTER
  // ============================================================

  return (
    <footer
      id="footer"
      className="
        relative
        z-10
        overflow-hidden
        border-t
        border-gray-200/80
        bg-white
        dark:border-white/10
        dark:bg-gray-950
      "
    >
      {/* Decorative background */}
      <div
        className="
          pointer-events-none
          absolute
          -left-32
          -top-32
          h-72
          w-72
          rounded-full
          bg-indigo-500/10
          blur-3xl
          dark:bg-indigo-500/10
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-32
          top-20
          h-80
          w-80
          rounded-full
          bg-purple-500/10
          blur-3xl
          dark:bg-purple-500/10
        "
      />

      <div
        className="
          relative
          mx-auto
          w-full
          max-w-7xl
          px-5
          py-14
          sm:px-6
          lg:px-8
        "
      >
        {/* ======================================================
            TOP CTA
        ======================================================= */}

        <div
          className="
            mb-12
            overflow-hidden
            rounded-3xl
            border
            border-gray-200
            bg-gradient-to-br
            from-gray-50
            via-white
            to-indigo-50
            p-6
            shadow-sm
            dark:border-white/10
            dark:from-white/[0.06]
            dark:via-white/[0.03]
            dark:to-indigo-500/[0.08]
            sm:p-8
          "
        >
          <div
            className="
              flex
              flex-col
              gap-6
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            <div className="max-w-2xl">
              <span
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-indigo-200
                  bg-indigo-50
                  px-3
                  py-1
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-indigo-600
                  dark:border-indigo-400/20
                  dark:bg-indigo-500/10
                  dark:text-indigo-300
                "
              >
                <span
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-indigo-500
                  "
                />
                Open to opportunities
              </span>

              <h2
                className="
                  mt-4
                  text-2xl
                  font-bold
                  tracking-tight
                  text-gray-900
                  dark:text-white
                  sm:text-3xl
                "
              >
                Let&apos;s build something
                meaningful together.
              </h2>

              <p
                className="
                  mt-3
                  max-w-xl
                  text-sm
                  leading-6
                  text-gray-600
                  dark:text-gray-400
                  sm:text-base
                "
              >
                Have a project, opportunity or
                idea in mind? Feel free to get in
                touch and let&apos;s talk.
              </p>
            </div>

            <a
              href="#contact"
              onClick={(event) =>
                handleSectionClick(
                  event,
                  'contact'
                )
              }
              className="
                inline-flex
                shrink-0
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-gray-900
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                shadow-lg
                shadow-gray-900/10
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-indigo-600
                hover:shadow-indigo-500/20
                dark:bg-white
                dark:text-gray-900
                dark:hover:bg-indigo-400
                dark:hover:text-white
              "
            >
              Get in touch
              <span
                className="
                  text-base
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              >
                →
              </span>
            </a>
          </div>
        </div>

        {/* ======================================================
            MAIN FOOTER GRID
        ======================================================= */}

        <div
          className="
            grid
            grid-cols-1
            gap-10
            sm:grid-cols-2
            lg:grid-cols-4
            lg:gap-12
          "
        >
          {/* BRAND */}

          <div>
            <div
              className="
                inline-flex
                items-center
                gap-3
              "
            >
              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-2xl
                  bg-gradient-to-br
                  from-indigo-600
                  to-purple-600
                  text-sm
                  font-black
                  text-white
                  shadow-lg
                  shadow-indigo-500/20
                "
              >
                VR
              </div>

              <div>
                <h3
                  className="
                    text-base
                    font-bold
                    text-gray-900
                    dark:text-white
                  "
                >
                  Vivek Kumar Rana
                </h3>

                <p
                  className="
                    mt-0.5
                    text-xs
                    font-medium
                    text-indigo-600
                    dark:text-indigo-400
                  "
                >
                  MERN Stack Developer
                </p>
              </div>
            </div>

            <p
              className="
                mt-5
                max-w-sm
                text-sm
                leading-6
                text-gray-600
                dark:text-gray-400
              "
            >
              Building modern, scalable and
              user-friendly web applications
              with clean code and thoughtful
              experiences.
            </p>

            {/* SOCIALS */}

            <div
              className="
                mt-6
                flex
                flex-wrap
                gap-3
              "
            >
              {github && (
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="
                    group
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    text-xs
                    font-bold
                    text-gray-700
                    shadow-sm
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-gray-900
                    hover:bg-gray-900
                    hover:text-white
                    dark:border-white/10
                    dark:bg-white/[0.04]
                    dark:text-gray-300
                    dark:hover:border-white
                    dark:hover:bg-white
                    dark:hover:text-gray-900
                  "
                >
                  GH
                </a>
              )}

              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    text-xs
                    font-bold
                    text-gray-700
                    shadow-sm
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-blue-600
                    hover:bg-blue-600
                    hover:text-white
                    dark:border-white/10
                    dark:bg-white/[0.04]
                    dark:text-gray-300
                    dark:hover:border-blue-500
                    dark:hover:bg-blue-500
                  "
                >
                  IN
                </a>
              )}

              {email && (
                <a
                  href={`mailto:${email}`}
                  aria-label="Email"
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    text-sm
                    font-bold
                    text-gray-700
                    shadow-sm
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-indigo-600
                    hover:bg-indigo-600
                    hover:text-white
                    dark:border-white/10
                    dark:bg-white/[0.04]
                    dark:text-gray-300
                    dark:hover:border-indigo-500
                    dark:hover:bg-indigo-500
                  "
                >
                  @
                </a>
              )}
            </div>
          </div>

          {/* QUICK LINKS */}

          <div>
            <h3
              className="
                text-sm
                font-bold
                text-gray-900
                dark:text-white
              "
            >
              Quick Links
            </h3>

            <div
              className="
                mt-4
                h-1
                w-8
                rounded-full
                bg-gradient-to-r
                from-indigo-500
                to-purple-500
              "
            />

            <ul className="mt-5 space-y-3">
              {[
                ['Home', 'home'],
                ['About', 'about'],
                ['Skills', 'skills'],
                ['Projects', 'projects'],
                ['Contact', 'contact'],
              ].map(([label, id]) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={(event) =>
                      handleSectionClick(
                        event,
                        id
                      )
                    }
                    className="
                      group
                      inline-flex
                      items-center
                      gap-2
                      text-sm
                      text-gray-600
                      transition-all
                      duration-200
                      hover:translate-x-1
                      hover:text-indigo-600
                      dark:text-gray-400
                      dark:hover:text-indigo-400
                    "
                  >
                    <span
                      className="
                        text-indigo-500
                        opacity-0
                        transition-opacity
                        duration-200
                        group-hover:opacity-100
                      "
                    >
                      →
                    </span>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}

          <div>
            <h3
              className="
                text-sm
                font-bold
                text-gray-900
                dark:text-white
              "
            >
              Contact
            </h3>

            <div
              className="
                mt-4
                h-1
                w-8
                rounded-full
                bg-gradient-to-r
                from-indigo-500
                to-purple-500
              "
            />

            <div className="mt-5 space-y-4">
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="
                    group
                    block
                    rounded-xl
                    border
                    border-transparent
                    p-2
                    -ml-2
                    transition-all
                    duration-200
                    hover:border-gray-200
                    hover:bg-gray-50
                    dark:hover:border-white/10
                    dark:hover:bg-white/[0.03]
                  "
                >
                  <p
                    className="
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-gray-400
                    "
                  >
                    Email
                  </p>

                  <p
                    className="
                      mt-1
                      break-all
                      text-sm
                      text-gray-700
                      group-hover:text-indigo-600
                      dark:text-gray-300
                      dark:group-hover:text-indigo-400
                    "
                  >
                    {email}
                  </p>
                </a>
              )}

              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="
                    group
                    block
                    rounded-xl
                    border
                    border-transparent
                    p-2
                    -ml-2
                    transition-all
                    duration-200
                    hover:border-gray-200
                    hover:bg-gray-50
                    dark:hover:border-white/10
                    dark:hover:bg-white/[0.03]
                  "
                >
                  <p
                    className="
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-gray-400
                    "
                  >
                    Phone
                  </p>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-gray-700
                      group-hover:text-indigo-600
                      dark:text-gray-300
                      dark:group-hover:text-indigo-400
                    "
                  >
                    {phone}
                  </p>
                </a>
              )}

              {location && (
                <div
                  className="
                    rounded-xl
                    p-2
                    -ml-2
                  "
                >
                  <p
                    className="
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-gray-400
                    "
                  >
                    Location
                  </p>

                  <p
                    className="
                      mt-1
                      text-sm
                      leading-5
                      text-gray-700
                      dark:text-gray-300
                    "
                  >
                    {location}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RESUME */}

          <div>
            <h3
              className="
                text-sm
                font-bold
                text-gray-900
                dark:text-white
              "
            >
              Resume
            </h3>

            <div
              className="
                mt-4
                h-1
                w-8
                rounded-full
                bg-gradient-to-r
                from-indigo-500
                to-purple-500
              "
            />

            <div className="mt-5">
              {isPrivate ? (
                <div
                  className="
                    rounded-2xl
                    border
                    border-red-200
                    bg-red-50
                    p-5
                    dark:border-red-500/20
                    dark:bg-red-500/10
                  "
                >
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      bg-red-100
                      text-lg
                      dark:bg-red-500/10
                    "
                  >
                    🔒
                  </div>

                  <h4
                    className="
                      mt-4
                      text-sm
                      font-bold
                      text-red-700
                      dark:text-red-400
                    "
                  >
                    Resume is Private
                  </h4>

                  <p
                    className="
                      mt-2
                      text-xs
                      leading-5
                      text-red-600/80
                      dark:text-red-400/80
                    "
                  >
                    Resume viewing and downloading
                    are currently disabled.
                  </p>
                </div>
              ) : hasResume ? (
                <div
                  className="
                    relative
                    overflow-hidden
                    rounded-2xl
                    border
                    border-indigo-200
                    bg-gradient-to-br
                    from-indigo-50
                    to-purple-50
                    p-5
                    dark:border-indigo-500/20
                    dark:from-indigo-500/10
                    dark:to-purple-500/10
                  "
                >
                  <div
                    className="
                      pointer-events-none
                      absolute
                      -right-8
                      -top-8
                      h-24
                      w-24
                      rounded-full
                      bg-indigo-500/10
                      blur-2xl
                    "
                  />

                  <div
                    className="
                      relative
                      flex
                      items-center
                      gap-3
                    "
                  >
                    <div
                      className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-indigo-600
                        text-lg
                        text-white
                        shadow-lg
                        shadow-indigo-500/20
                      "
                    >
                      CV
                    </div>

                    <div>
                      <p
                        className="
                          text-sm
                          font-bold
                          text-gray-900
                          dark:text-white
                        "
                      >
                        My Resume
                      </p>

                      <p
                        className="
                          mt-0.5
                          text-xs
                          text-gray-500
                          dark:text-gray-400
                        "
                      >
                        Available to view
                        and download
                      </p>
                    </div>
                  </div>

                  <div
                    className="
                      relative
                      mt-5
                      grid
                      grid-cols-2
                      gap-2
                    "
                  >
                    <button
                      type="button"
                      onClick={
                        handleViewResume
                      }
                      disabled={resumeLoading}
                      className="
                        inline-flex
                        min-h-10
                        items-center
                        justify-center
                        gap-1.5
                        rounded-xl
                        bg-gray-900
                        px-3
                        py-2.5
                        text-xs
                        font-bold
                        text-white
                        transition-all
                        duration-300
                        hover:-translate-y-0.5
                        hover:bg-indigo-600
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                        dark:bg-white
                        dark:text-gray-900
                        dark:hover:bg-indigo-400
                        dark:hover:text-white
                      "
                    >
                      <span>↗</span>
                      {resumeLoading
                        ? 'Loading'
                        : 'View'}
                    </button>

                    <button
                      type="button"
                      onClick={
                        handleDownloadResume
                      }
                      disabled={resumeLoading}
                      className="
                        inline-flex
                        min-h-10
                        items-center
                        justify-center
                        gap-1.5
                        rounded-xl
                        border
                        border-indigo-200
                        bg-white/80
                        px-3
                        py-2.5
                        text-xs
                        font-bold
                        text-indigo-700
                        backdrop-blur-sm
                        transition-all
                        duration-300
                        hover:-translate-y-0.5
                        hover:border-indigo-400
                        hover:bg-indigo-50
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                        dark:border-indigo-400/20
                        dark:bg-gray-900/60
                        dark:text-indigo-300
                        dark:hover:border-indigo-400
                        dark:hover:bg-indigo-500/10
                      "
                    >
                      <span>↓</span>
                      {resumeLoading
                        ? 'Wait'
                        : 'Download'}
                    </button>
                  </div>

                  {resumeError && (
                    <p
                      className="
                        relative
                        mt-3
                        rounded-lg
                        border
                        border-red-200
                        bg-red-50
                        px-3
                        py-2
                        text-xs
                        leading-5
                        text-red-600
                        dark:border-red-500/20
                        dark:bg-red-500/10
                        dark:text-red-400
                      "
                    >
                      {resumeError}
                    </p>
                  )}
                </div>
              ) : (
                <div
                  className="
                    rounded-2xl
                    border
                    border-gray-200
                    bg-gray-50
                    p-5
                    dark:border-white/10
                    dark:bg-white/[0.03]
                  "
                >
                  <p
                    className="
                      text-sm
                      font-semibold
                      text-gray-700
                      dark:text-gray-300
                    "
                  >
                    Resume unavailable
                  </p>

                  <p
                    className="
                      mt-2
                      text-xs
                      leading-5
                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    Please check back later.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ======================================================
            BOTTOM BAR
        ======================================================= */}

        <div
          className="
            mt-12
            flex
            flex-col
            gap-4
            border-t
            border-gray-200
            pt-7
            dark:border-white/10
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <p
            className="
              text-center
              text-xs
              text-gray-500
              dark:text-gray-500
              sm:text-left
            "
          >
            © {currentYear} Vivek Kumar
            Rana. All rights reserved.
          </p>

          <div
            className="
              flex
              items-center
              justify-center
              gap-2
              text-xs
              text-gray-500
              dark:text-gray-500
              sm:justify-end
            "
          >
            <span>
              Built with
            </span>

            <span
              className="
                font-semibold
                text-gray-700
                dark:text-gray-300
              "
            >
              React
            </span>

            <span>•</span>

            <span
              className="
                font-semibold
                text-gray-700
                dark:text-gray-300
              "
            >
              MERN Stack
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
