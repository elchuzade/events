const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const EventSchema = new Schema(
  {
    user: {
      type: String,
      required: true
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
    category: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    intro: {
      type: String
    },
    description: {
      type: String
    },
    location: {
      type: String
    },
    city: {
      type: String
    },
    country: {
      type: String
    },
    date: {
      type: Date
    },
    time: {
      type: String
    },
    sits: {
      type: Number
    },
    price: {
      type: Number
    },
    currency: {
      type: String
    },
    guests: [
      {
        name: {
          type: String
        },
        title: {
          type: String
        },
        intro: {
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
    organizers: [
      {
        profile: {
          type: Schema.Types.ObjectId,
          ref: 'profile'
        },
        message: {
          type: String
        },
        status: {
          type: String
        }
      }
    ],
    sponsors: [
      {
        profile: {
          type: Schema.Types.ObjectId,
          ref: 'profile'
        },
        message: {
          type: String
        },
        status: {
          type: String
        }
      }
    ],
    sponsorships: [
      {
        sponsorship: {
          type: Schema.Types.ObjectId,
          ref: 'sponsorship'
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports = Event = mongoose.model('event', EventSchema);
