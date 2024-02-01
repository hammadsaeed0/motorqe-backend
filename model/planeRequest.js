import mongoose from "mongoose";
const Schema = mongoose.Schema;


const packageRequestSchema = new Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    packageType: {
      type: String,
      enum: ["silver", "gold", "platinum"],
      required: true,
      default:"silver"
    },
    approved: {
      type: Boolean,
      default: false // Setting the default value to false
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  export const PackageRequest = mongoose.model("PackageRequest", packageRequestSchema);
  