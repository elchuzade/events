const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ProfileSchema = new Schema(
  {
    user: {
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
    whatsapp: {
      type: String
    },
    pastEvents: [
      {
        id: {
          type: String,
        },
        title: {
          type: String
        },
        category: {
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
        }
      }
    ],
    futureEvents: [
      {
        id: {
          type: String,
        },
        title: {
          type: String
        },
        category: {
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
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports = Profile = mongoose.model('profile', ProfileSchema);