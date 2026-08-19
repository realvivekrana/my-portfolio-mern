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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Project', projectSchema);