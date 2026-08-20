const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    /*
    |--------------------------------------------------------------------------
    | Certificate Title
    |--------------------------------------------------------------------------
    */

    title: {
      type: String,
      required: [true, 'Certificate title is required'],
      trim: true,
    },

    /*
    |--------------------------------------------------------------------------
    | Issuing Organization
    |--------------------------------------------------------------------------
    */

    issuer: {
      type: String,
      required: [true, 'Certificate issuer is required'],
      trim: true,
    },

    /*
    |--------------------------------------------------------------------------
    | Issue Date
    |--------------------------------------------------------------------------
    */

    issueDate: {
      type: String,
      default: '',
      trim: true,
    },

    /*
    |--------------------------------------------------------------------------
    | Certificate Description
    |--------------------------------------------------------------------------
    */

    description: {
      type: String,
      default: '',
      trim: true,
    },

    /*
    |--------------------------------------------------------------------------
    | Certificate Image
    |--------------------------------------------------------------------------
    |
    | Uploaded certificate image ka URL.
    |
    */

    image: {
      type: String,
      default: '',
    },

    /*
    |--------------------------------------------------------------------------
    | Certificate Verification URL
    |--------------------------------------------------------------------------
    */

    credentialUrl: {
      type: String,
      default: '',
      trim: true,
    },

    /*
    |--------------------------------------------------------------------------
    | Skills
    |--------------------------------------------------------------------------
    */

    skills: {
      type: [String],
      default: [],
    },

    /*
    |--------------------------------------------------------------------------
    | Featured Certificate
    |--------------------------------------------------------------------------
    */

    featured: {
      type: Boolean,
      default: false,
    },

    /*
    |--------------------------------------------------------------------------
    | Display Order
    |--------------------------------------------------------------------------
    |
    | Admin future mein certificates ka order control kar sakega.
    |
    */

    displayOrder: {
      type: Number,
      default: 0,
    },

    /*
    |--------------------------------------------------------------------------
    | Visibility
    |--------------------------------------------------------------------------
    |
    | false karne par certificate portfolio par show nahi hoga.
    |
    */

    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  'Certificate',
  certificateSchema
);