const mongoose = require('mongoose');

/*
|--------------------------------------------------------------------------
| Portfolio Content Schema
|--------------------------------------------------------------------------
| This model stores the main editable portfolio information.
|
| Admin Dashboard
|       ↓
| MongoDB
|       ↓
| Public Portfolio
|
| The document uses a fixed "key" so we always have one main
| portfolio configuration document.
|--------------------------------------------------------------------------
*/

const portfolioContentSchema = new mongoose.Schema(
  {
    /*
    |--------------------------------------------------------------------------
    | Unique Configuration Key
    |--------------------------------------------------------------------------
    */

    key: {
      type: String,
      required: true,
      unique: true,
      default: 'main',
      trim: true,
    },

    /*
    |--------------------------------------------------------------------------
    | HERO SECTION
    |--------------------------------------------------------------------------
    */

    hero: {
      name: {
        type: String,
        default: 'Vivek Rana',
        trim: true,
      },

      role: {
        type: String,
        default: 'MERN Stack Developer',
        trim: true,
      },

      tagline: {
        type: String,
        default:
          'I build scalable, responsive and user-focused web applications using modern JavaScript technologies.',
        trim: true,
      },

      profileImage: {
        type: String,
        default: '',
        trim: true,
      },

      availability: {
        type: String,
        default: 'Open to Work',
        trim: true,
      },

      githubUrl: {
        type: String,
        default: 'https://github.com/realvivekrana',
        trim: true,
      },

      linkedinUrl: {
        type: String,
        default: 'https://www.linkedin.com/in/mrvivekrana/',
        trim: true,
      },
    },

    /*
    |--------------------------------------------------------------------------
    | ABOUT SECTION
    |--------------------------------------------------------------------------
    */

    about: {
      shortDescription: {
        type: String,
        default:
          "I'm a MERN Stack Developer focused on building modern, scalable and user-friendly web applications. I enjoy turning complex problems into clean and intuitive digital experiences.",
        trim: true,
      },

      introduction: {
        type: String,
        default: '',
        trim: true,
      },

      specialization: {
        type: String,
        default:
          'Frontend development with React.js along with backend development using Node.js, Express.js and MongoDB.',
        trim: true,
      },

      careerGoal: {
        type: String,
        default:
          'My goal is to grow as a strong software engineer by working on real-world products, solving meaningful problems and continuously improving my development skills.',
        trim: true,
      },

      currentRole: {
        role: {
          type: String,
          default: 'Frontend Developer Intern',
          trim: true,
        },

        company: {
          type: String,
          default: 'Athenura',
          trim: true,
        },

        duration: {
          type: String,
          default: 'Feb 2026 – Present',
          trim: true,
        },

        description: {
          type: String,
          default:
            'Working with React.js to develop modern user interfaces, reusable components and production-focused web experiences.',
          trim: true,
        },
      },
    },

    /*
    |--------------------------------------------------------------------------
    | CONTACT INFORMATION
    |--------------------------------------------------------------------------
    */

    contact: {
      email: {
        type: String,
        default: '',
        trim: true,
      },

      phone: {
        type: String,
        default: '',
        trim: true,
      },

      location: {
        type: String,
        default: 'Pune, India',
        trim: true,
      },
    },

    /*
    |--------------------------------------------------------------------------
    | SOCIAL LINKS
    |--------------------------------------------------------------------------
    */

    socialLinks: {
      github: {
        type: String,
        default: 'https://github.com/realvivekrana',
        trim: true,
      },

      linkedin: {
        type: String,
        default: 'https://www.linkedin.com/in/mrvivekrana/',
        trim: true,
      },

      email: {
        type: String,
        default: '',
        trim: true,
      },
    },

    /*
    |--------------------------------------------------------------------------
    | RESUME
    |--------------------------------------------------------------------------
    */

    resume: {
      url: {
        type: String,
        default: '/resume.pdf',
        trim: true,
      },

      fileName: {
        type: String,
        default: 'Vivek-Rana-Resume.pdf',
        trim: true,
      },

      originalName: {
        type: String,
        default: 'resume.pdf',
        trim: true,
      },

      uploadedAt: {
        type: Date,
        default: null,
      },
    },

    /*
    |--------------------------------------------------------------------------
    | SEO
    |--------------------------------------------------------------------------
    */

    seo: {
      title: {
        type: String,
        default: 'Vivek Rana | MERN Stack Developer',
        trim: true,
      },

      description: {
        type: String,
        default:
          'Vivek Rana is a MERN Stack Developer focused on building modern, scalable and user-friendly web applications.',
        trim: true,
      },

      keywords: {
        type: [String],
        default: [
          'Vivek Rana',
          'MERN Stack Developer',
          'React Developer',
          'Node.js Developer',
          'Full Stack Developer',
        ],
      },

      ogImage: {
        type: String,
        default: '',
        trim: true,
      },
    },

    /*
    |--------------------------------------------------------------------------
    | SITE SETTINGS
    |--------------------------------------------------------------------------
    */

    settings: {
      showAvailabilityBadge: {
        type: Boolean,
        default: true,
      },

      showGithub: {
        type: Boolean,
        default: true,
      },

      showLinkedin: {
        type: Boolean,
        default: true,
      },

      showResume: {
        type: Boolean,
        default: true,
      },

      showAdminAccess: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  'PortfolioContent',
  portfolioContentSchema
);