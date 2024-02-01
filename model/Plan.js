import mongoose from "mongoose";

const Schema = mongoose.Schema;

const planSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  carLimit: {
    type: Number,
    default: 0, // Default value for plans without a car limit
  },
  photoLimit: {
    type: Number,
    required: true,
  },
  featuredAdDuration: {
    type: Number, // Duration in days for a featured ad
    default: 0, // Default value for plans without a featured ad
  },
  listingDuration: {
    type: Number, // Duration in days for an active listing
    required: true,
  },
  boosters: {
    type: Number,
    default: 0, // Default value for plans without boosters
  },
  interior360: {
    type: Boolean,
    default: false, // Default value for plans without interior 360 feature
  },
  deleteAfterDays: {
    type: Number,
    default: 0, // Default value for plans without automatic deletion
  },
});

export const Plan = mongoose.model("Plan", planSchema);
