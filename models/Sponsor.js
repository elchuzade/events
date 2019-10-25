const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const SponsorSchema = new Schema(
  {
    user: {
      type: String,
      required: true
    },
    name: {
      type: String
    },
    avatar: {
      location: {
        type: String
      },
      key: {
        type: String
      },
      bucket: {
        type: String
      },
      originalname: {
        type: String
      },
      mimetype: {
        type: String
      },
      size: {
        type: Number
      },
      fieldName: {
        type: String
      }
    },
    title: {
      type: String
    },
    intro: {
      type: String
    },
    city: {
      type: String
    },
    country: {
      type: String
    },
    email: {
      type: String
    },
    facebook: {
      type: String
    },
    twitter: {
      type: String
    },
    instagram: {
      type: String
    },
    linkedin: {
      type: String
    },
    phone: {
      type: String
    },
    offers: [
      {
        name: {
          type: String
        },
        amount: {
          type: Number
        },
        info: {
          type: String
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports = Sponsor = mongoose.model('sponsor', SponsorSchema);
