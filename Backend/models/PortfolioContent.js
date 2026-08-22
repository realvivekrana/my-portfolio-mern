const mongoose = require('mongoose');

/*
|--------------------------------------------------------------------------
| Portfolio Content Schema
|--------------------------------------------------------------------------
| This model stores all editable portfolio information.
|
| Admin Dashboard
|       ↓
| Portfolio API
|       ↓
| MongoDB
|       ↓
| Public Portfolio
|
| We keep one main portfolio document using the "key" field.
|--------------------------------------------------------------------------
*/

const portfolioContentSchema = new mongoose.Schema(
  {
    /*
    |--------------------------------------------------------------------------
    | MAIN CONFIGURATION KEY
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
    | PROFILE / HERO
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
        default:
          'https://www.linkedin.com/in/mrvivekrana/',
        trim: true,
      },
    },

    /*
    |--------------------------------------------------------------------------
    | ABOUT
    |--------------------------------------------------------------------------
    */

    about: {
      shortDescription: {
        type: String,
        default:
          "I'm a MERN Stack Developer focused on building modern, scalable and user-friendly web applications.",
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
        default:
          'https://www.linkedin.com/in/mrvivekrana/',
        trim: true,
      },

      email: {
        type: String,
        default: '',
        trim: true,
      },

      twitter: {
        type: String,
        default: '',
        trim: true,
      },

      instagram: {
        type: String,
        default: '',
        trim: true,
      },

      youtube: {
        type: String,
        default: '',
        trim: true,
      },

      website: {
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
        default:
          'Vivek Rana | MERN Stack Developer',
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
    | EXPERIENCE
    |--------------------------------------------------------------------------
    */

    experience: {
      type: [
        {
          role: {
            type: String,
            trim: true,
            default: '',
          },

          company: {
            type: String,
            trim: true,
            default: '',
          },

          duration: {
            type: String,
            trim: true,
            default: '',
          },

          type: {
            type: String,
            trim: true,
            default: 'Full-time',
          },

          location: {
            type: String,
            trim: true,
            default: '',
          },

          description: {
            type: String,
            trim: true,
            default: '',
          },

          responsibilities: {
            type: [
              {
                icon: {
                  type: String,
                  trim: true,
                  default: 'code',
                },

                text: {
                  type: String,
                  trim: true,
                  default: '',
                },
              },
            ],

            default: [],
          },

          technologies: {
            type: [String],
            default: [],
          },

          displayOrder: {
            type: Number,
            default: 0,
          },

          isVisible: {
            type: Boolean,
            default: true,
          },
        },
      ],

      /*
      |--------------------------------------------------------------------------
      | DEFAULT EXPERIENCE
      |--------------------------------------------------------------------------
      */

      default: [
        {
          role: 'Frontend Developer Intern',

          company: 'Athenura',

          duration: 'Feb 2026 – Present',

          type: 'Internship',

          location: 'Remote',

          description:
            'Working on modern web interfaces and production-focused frontend experiences using React.js and modern UI development practices.',

          responsibilities: [
            {
              icon: 'code',
              text:
                'Developed responsive and user-friendly React interfaces for modern web applications.',
            },

            {
              icon: 'layer',
              text:
                'Built reusable and scalable UI components to maintain consistency across the application.',
            },

            {
              icon: 'rocket',
              text:
                'Worked on improving website performance, usability and overall frontend experience.',
            },

            {
              icon: 'users',
              text:
                'Collaborated with the development team to deliver production features and solve frontend challenges.',
            },
          ],

          technologies: [
            'React.js',
            'JavaScript',
            'HTML5',
            'CSS3',
            'Tailwind CSS',
            'Git',
            'GitHub',
          ],

          displayOrder: 0,

          isVisible: true,
        },
      ],
    },

    /*
    |--------------------------------------------------------------------------
    | EDUCATION
    |--------------------------------------------------------------------------
    */

    education: {
      type: [
        {
          degree: {
            type: String,
            trim: true,
            default: '',
          },

          institution: {
            type: String,
            trim: true,
            default: '',
          },

          duration: {
            type: String,
            trim: true,
            default: '',
          },

          status: {
            type: String,
            trim: true,
            default: '',
          },

          description: {
            type: String,
            trim: true,
            default: '',
          },

          highlights: {
            type: [String],
            default: [],
          },

          icon: {
            type: String,
            trim: true,
            default: 'book',
          },

          displayOrder: {
            type: Number,
            default: 0,
          },

          isVisible: {
            type: Boolean,
            default: true,
          },
        },
      ],

      /*
      |--------------------------------------------------------------------------
      | DEFAULT EDUCATION
      |--------------------------------------------------------------------------
      */

      default: [
        {
          degree:
            'MCA — Artificial Intelligence & Machine Learning',

          institution:
            'Amity University Online',

          duration: 'Current',

          status: 'Postgraduate',

          description:
            'Pursuing a Master of Computer Applications with a specialization in Artificial Intelligence and Machine Learning, while strengthening my software development and problem-solving skills.',

          highlights: [
            'Artificial Intelligence & Machine Learning',
            'Advanced Computer Applications',
            'Software Development',
          ],

          icon: 'brain',

          displayOrder: 0,

          isVisible: true,
        },

        {
          degree:
            'Bachelor of Computer Applications',

          institution:
            'Vinoba Bhave University',

          duration: '2021 – 2024',

          status: 'Completed',

          description:
            'Completed my Bachelor of Computer Applications with a strong foundation in programming, computer science fundamentals and software development.',

          highlights: [
            'Computer Applications',
            'Programming Fundamentals',
            'Software Development',
          ],

          icon: 'book',

          displayOrder: 1,

          isVisible: true,
        },
      ],
    },

    /*
    |--------------------------------------------------------------------------
    | VISIBILITY / SITE SETTINGS
    |--------------------------------------------------------------------------
    */

    settings: {
      /*
      |--------------------------------------------------------------------------
      | PORTFOLIO VISIBILITY
      |--------------------------------------------------------------------------
      |
      | Public:
      | Portfolio normal visitors ko visible rahega.
      |
      | Private:
      | Portfolio public visitors ke liye hidden rahega.
      |
      |--------------------------------------------------------------------------
      */

      portfolioVisibility: {
        type: String,
        enum: ['public', 'private'],
        default: 'public',
      },

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

/*
|--------------------------------------------------------------------------
| EXPORT MODEL
|--------------------------------------------------------------------------
*/

module.exports = mongoose.model(
  'PortfolioContent',
  portfolioContentSchema
);