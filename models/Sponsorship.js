const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const SponsorshipSchema = new Schema(
  {
    profile: { type: Schema.Types.ObjectId, ref: 'profile' },
    title: { type: String, required: true },
    intro: { type: String },
    count: { type: Number, required: true },
    maxCount: { type: Number, required: true },
    price: { type: Number, required: true },
    currency: { type: String }
  },
  { timestamps: true }
);

module.exports = Sponsorship = mongoose.model('sponsorship', SponsorshipSchema);
