const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },

    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
    },

    image: {
      type: String,
      default: '',
    },

    techStack: {
      type: [String],
      default: [],
    },

    keyFeatures: {
      type: [String],
      default: [],
    },

    githubLink: {
      type: String,
      default: '',
    },

    liveLink: {
      type: String,
      default: '',
    },

    category: {
      type: String,
      enum: ['Frontend', 'Backend', 'Full Stack', 'Other'],
      default: 'Full Stack',
    },

    featured: {
      type: Boolean,
      default: false,
    },

    featuredType: {
      type: String,
      enum: [
        '',
        'Major Full-Stack Project',
        'AI / React Project',
        'MERN Business Project',
      ],
      default: '',
    },

    /*
    |--------------------------------------------------------------------------
    | Case Study Slug — URL friendly, unique when present
    |--------------------------------------------------------------------------
    |
    | Auto-generated from title in the controller. Used for /projects/:slug.
    | sparse:true so multiple projects without a slug don't clash on the
    | unique index.
    |
    */

    slug: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    /*
    |--------------------------------------------------------------------------
    | Case Study — Problem Statement
    |--------------------------------------------------------------------------
    */

    problem: {
      type: String,
      default: '',
      trim: true,
    },

    /*
    |--------------------------------------------------------------------------
    | Case Study — Solution
    |--------------------------------------------------------------------------
    */

    solution: {
      type: String,
      default: '',
      trim: true,
    },

    /*
    |--------------------------------------------------------------------------
    | Case Study — Tech Decisions
    |--------------------------------------------------------------------------
    |
    | Har entry: "kyun ye tech chuna" jaisa point.
    |
    */

    techDecisions: {
      type: [String],
      default: [],
    },

    /*
    |--------------------------------------------------------------------------
    | Case Study — Challenges Faced
    |--------------------------------------------------------------------------
    */

    challenges: {
      type: [String],
      default: [],
    },

    /*
    |--------------------------------------------------------------------------
    | Case Study — Screenshots
    |--------------------------------------------------------------------------
    |
    | Cloudinary URLs ki list, cover `image` field ke alawa.
    |
    */

    screenshots: {
      type: [String],
      default: [],
    },

    /*
    |--------------------------------------------------------------------------
    | Case Study — Has Detailed Case Study?
    |--------------------------------------------------------------------------
    |
    | true hone par hi Projects card par "View Case Study" link dikhega.
    |
    */

    hasCaseStudy: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Project', projectSchema);