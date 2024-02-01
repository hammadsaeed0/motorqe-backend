import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["seller", "dealer"],
    required: true,
  },
  companyName: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  tradeLicenseNumber: {
    type: String,
  },
  plan: {
    type: Schema.Types.ObjectId,
    ref: "Plan", // Assuming your Plan model is named "Plan"
  },
  packageRequested: {
    type: Boolean,
    default: false
  },
  packageType: {
    type: String,
    enum: ["silver", "platinum", "golden"],
    default: "golden"
  },
  favorite_listings: [{
    type: Schema.Types.ObjectId,
    ref: 'CarListing'
  }],
});

export const User = mongoose.model("User", userSchema);