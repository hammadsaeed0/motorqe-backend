import mongoose from "mongoose";

const Schema = mongoose.Schema;

const carListingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  type_of_ad: {
    type: String,
    enum: ["Featured", "Standard"],
    required: true,
  },
  make: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  vehicle_condition: {
    type: String,
    required: true,
  },
  mileage: {
    type: Number,
    required: true,
  },
  vehicle_category: {
    type: String,
    required: true,
  },
  specifications: [String],
  cylinder: Number,
  engine_size: String,
  wheel_drive: String,
  gear_box: String,
  exterior_colour: String,
  interior_colour: String,
  fuel_type: String,
  registration_date: Date,
  warranty: Boolean,
  warranty_date: {
    type: Date,
    required: function () {
      return this.warranty === true; // Required if warranty is true
    },
  },
  inspected: Boolean,
  inspection_report: String,
  price_QR: String,
  price_range: String,
  negotiable: Boolean,
  description: String,
  vehicle_location: String,
  longitude: Number,
  latitude: Number,
  engine_oil: String,
  engine_oil_filter: String,
  gearbox_oil: String,
  ac_filter: String,
  air_filter: String,
  fuel_filter: String,
  spark_plugs: String,
  front_brake_pads: String,
  rear_brake_pads: String,
  front_brake_discs: String,
  rear_brake_discs: String,
  battery: String,
  front_tire_size: String,
  front_tire_price: Number,
  rear_tire_size: String,
  rear_tire_price: Number,
  contact_name: {
    type: String,
    required: true,
  },
  mobile_no: {
    type: String,
    required: true,
  },
  whatsapp_no: String,
  email_address: {
    type: String,
    required: true,
  },
  car_images: {
    type: [String],
    required: true,
  },
});

export const CarListing = mongoose.model("CarListing", carListingSchema);
