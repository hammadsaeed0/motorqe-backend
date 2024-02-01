import { User } from "../model/User.js";
import cloudinary from "cloudinary";
import bcrypt from "bcrypt";
import multer from "multer";
import { Contact } from "../model/Contact.js";
import { Plan } from "../model/Plan.js";
import { CarListing } from "../model/Car.js";
const upload = multer({ dest: "uploads/" });

cloudinary.v2.config({
  cloud_name: "dirfoibin",
  api_key: "315619779683284",
  api_secret: "_N7-dED0mIjUUa3y5d5vv2qJ3Ww",
});

// Register API
export const registerUser = async (req, res) => {
  const {
    username,
    email,
    phone,
    password,
    type,
    companyName,
    firstName,
    lastName,
    tradeLicenseNumber,
  } = req.body;

  try {
    // Check if the user already exists
    let existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new User({
      username,
      email,
      phone,
      password: hashedPassword,
      type,
    });

    // If user type is 'dealer', add additional fields
    if (type === "dealer") {
      // Check if all required fields for dealer are provided
      if (!companyName || !firstName || !lastName || !tradeLicenseNumber) {
        return res.status(400).json({
          success: false,
          message: "Required fields for dealer registration are missing",
        });
      }

      newUser.companyName = companyName;
      newUser.firstName = firstName;
      newUser.lastName = lastName;
      newUser.tradeLicenseNumber = tradeLicenseNumber;
    }

    // Save the user to the database
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      newUser,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Login API
export const loginUser = async (req, res) => {
  const { emailOrPhone, password } = req.body;

  try {
    // Find user by email or phone
    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });

    // If user not found
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // If authentication successful, return success response
    res.status(200).json({ success: true, message: "Login successful", user });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Contact us API
export const submitContactForm = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  try {
    // Create a new contact form submission
    const newContact = new Contact({
      name,
      email,
      phone,
      subject,
      message,
    });

    // Save the contact form submission to the database
    await newContact.save();

    res
      .status(201)
      .json({ success: true, message: "Contact form submitted successfully" });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Create a new plan
export const createPlan = async (req, res) => {
  const {
    name,
    price,
    carLimit,
    photoLimit,
    featuredAdDuration,
    listingDuration,
    boosters,
    interior360,
    deleteAfterDays,
  } = req.body;

  try {
    // Check if the maximum number of plans (3) has already been reached
    const planCount = await Plan.countDocuments();
    if (planCount >= 3) {
      return res.status(400).json({
        success: false,
        message: "Maximum number of plans already created",
      });
    }

    // Check if a plan with the same name already exists
    const existingPlan = await Plan.findOne({ name });
    if (existingPlan) {
      return res.status(400).json({
        success: false,
        message: "A plan with the same name already exists",
      });
    }

    const newPlan = new Plan({
      name,
      price,
      carLimit,
      photoLimit,
      featuredAdDuration,
      listingDuration,
      boosters,
      interior360,
      deleteAfterDays,
    });
    await newPlan.save();
    res
      .status(201)
      .json({ success: true, message: "Plan created successfully", newPlan });
  } catch (error) {
    console.error("Error creating plan:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all plans
export const getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    res.status(200).json({ success: true, plans });
  } catch (error) {
    console.error("Error getting plans:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Single plan by ID
export const getPlanById = async (req, res) => {
  const { id } = req.params;

  try {
    const plan = await Plan.findById(id);
    if (!plan) {
      return res
        .status(404)
        .json({ success: false, message: "Plan not found" });
    }
    res.status(200).json({ success: true, plan });
  } catch (error) {
    console.error("Error getting plan by ID:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update a plan by ID
export const updatePlanById = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedPlan = await Plan.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedPlan) {
      return res
        .status(404)
        .json({ success: false, message: "Plan not found" });
    }
    res.status(200).json({
      success: true,
      message: "Plan updated successfully",
      updatedPlan,
    });
  } catch (error) {
    console.error("Error updating plan by ID:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete a plan by ID
export const deletePlanById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPlan = await Plan.findByIdAndDelete(id);
    if (!deletedPlan) {
      return res.status(404).json({ message: "Plan not found" });
    }
    res.status(200).json({ message: "Plan deleted successfully" });
  } catch (error) {
    console.error("Error deleting plan by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create Listing
export const createCarListing = async (req, res) => {
  const {
    user_id,
    title,
    type_of_ad,
    make,
    model,
    year,
    vehicle_condition,
    mileage,
    vehicle_category,
    specifications,
    cylinder,
    engine_size,
    wheel_drive,
    gear_box,
    exterior_colour,
    interior_colour,
    fuel_type,
    registration_date,
    warranty,
    warranty_date,
    inspected,
    inspection_report,
    price_QR,
    price_range,
    negotiable,
    description,
    vehicle_location,
    spare_parts,
    email_address,
    mobile_no,
    contact_name,
    tyres,
    contact_details,
    car_images,
    whatsapp_no,
  } = req.body;

  // Check if title is provided
  if (!title) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide title of Listing" });
  }

  // Check if type_of_ad is provided
  if (!type_of_ad) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide type of ad" });
  }

  if (!make) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide make" });
  }

  // Check if model is provided
  if (!model) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide model" });
  }

  // Check if year is provided
  if (!year) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide year" });
  }

  // Check if vehicle_condition is provided
  if (!vehicle_condition) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide vehicle condition" });
  }

  // Check if mileage is provided
  if (!mileage) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide mileage" });
  }

  // Check if vehicle_category is provided
  if (!vehicle_category) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide vehicle category" });
  }

  // Check if contact_details is provided
  if (!contact_details) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide contact details" });
  }

  // Check if car_images is provided and not empty
  if (!car_images || car_images.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please provide at least one car image",
    });
  }

  try {
    // Check if user exists
    const user = await User.findById(user_id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if user has an associated plan
    if (!user.plan) {
      return res.status(400).json({
        success: false,
        message: "User needs to select a plan before creating a listing",
      });
    }

    // Check if the plan associated with the user exists
    const plan = await Plan.findById(user.plan);
    if (!plan) {
      return res.status(400).json({
        success: false,
        message: "User's associated plan not found",
      });
    }
    if (car_images.length > plan.photoLimit) {
      return res.status(400).json({
        success: false,
        message: `Exceeded maximum photo limit (${plan.photoLimit}) for the selected plan`,
      });
    }

    // Check if the number of car listings exceeds the car limit specified by the plan
    const userCarListingsCount = await CarListing.countDocuments({
      user: user_id,
    });
    if (userCarListingsCount >= plan.carLimit) {
      return res.status(400).json({
        success: false,
        message: `Exceeded maximum car listing limit (${plan.carLimit}) for the selected plan`,
      });
    }

    // // Check if the user has exceeded the maximum number of listings allowed by the plan
    // const userListingCount = await CarListing.countDocuments({ user: user_id });
    // if (userListingCount >= userPlan.listingLimit) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "Exceeded maximum listing limit" });
    // }

    // // Check if the number of images exceeds the limit allowed by the plan
    // if (userPlan.imageLimit && car_images.length > userPlan.imageLimit) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "Exceeded maximum image limit" });
    // }

    // Create a new car listing instance
    const newCarListing = new CarListing({
      user: user_id,
      title,
      type_of_ad,
      make,
      model,
      year,
      vehicle_condition,
      mileage,
      vehicle_category,
      specifications,
      cylinder,
      engine_size,
      wheel_drive,
      gear_box,
      exterior_colour,
      interior_colour,
      fuel_type,
      registration_date,
      warranty,
      warranty_date,
      inspected,
      inspection_report,
      price_QR,
      price_range,
      negotiable,
      description,
      vehicle_location,
      spare_parts,
      tyres,
      contact_details,
      car_images,
      email_address,
      mobile_no,
      contact_name,
      whatsapp_no,
    });

    // Save the car listing to the database
    await newCarListing.save();

    res.status(201).json({
      success: true,
      message: "Car listing created successfully",
      carListing: newCarListing,
    });
  } catch (error) {
    console.error("Error creating car listing:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Select Plan
export const selectPlan = async (req, res) => {
  const { user_id, plan_id } = req.body;

  try {
    // Check if the user exists
    const user = await User.findById(user_id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if the plan exists
    const plan = await Plan.findById(plan_id);
    if (!plan) {
      return res
        .status(404)
        .json({ success: false, message: "Plan not found" });
    }

    // Check if the user already has a plan
    if (user.plan) {
      // Update the user's existing plan with the selected plan
      user.plan = plan_id;
    } else {
      // Assign the selected plan to the user
      user.plan = plan_id;
    }

    // Save the updated user object
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Plan selected successfully", user });
  } catch (error) {
    console.error("Error selecting plan:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update Car
export const updateCarListing = async (req, res) => {
  const listingId = req.params.id;
  const {
    title,
    type_of_ad,
    make,
    model,
    year,
    vehicle_condition,
    mileage,
    vehicle_category,
    specifications,
    cylinder,
    engine_size,
    wheel_drive,
    gear_box,
    exterior_colour,
    interior_colour,
    fuel_type,
    registration_date,
    warranty,
    warranty_date,
    inspected,
    inspection_report,
    price_QR,
    price_range,
    negotiable,
    description,
    vehicle_location,
    spare_parts,
    email_address,
    mobile_no,
    whatsapp_no,
    contact_name,
    tyres,
    contact_details,
    car_images,
  } = req.body;

  try {
    // Check if the listing exists
    let listing = await CarListing.findById(listingId);
    if (!listing) {
      return res
        .status(404)
        .json({ success: false, message: "Listing not found" });
    }

    // Update listing fields
    if (title) listing.title = title;
    if (type_of_ad) listing.type_of_ad = type_of_ad;
    if (make) listing.make = make;
    if (model) listing.model = model;
    if (year) listing.year = year;
    if (vehicle_condition) listing.vehicle_condition = vehicle_condition;
    if (mileage) listing.mileage = mileage;
    if (vehicle_category) listing.vehicle_category = vehicle_category;
    if (specifications) listing.specifications = specifications;
    if (cylinder) listing.cylinder = cylinder;
    if (engine_size) listing.engine_size = engine_size;
    if (wheel_drive) listing.wheel_drive = wheel_drive;
    if (gear_box) listing.gear_box = gear_box;
    if (exterior_colour) listing.exterior_colour = exterior_colour;
    if (interior_colour) listing.interior_colour = interior_colour;
    if (fuel_type) listing.fuel_type = fuel_type;
    if (registration_date) listing.registration_date = registration_date;
    if (warranty) listing.warranty = warranty;
    if (warranty_date) listing.warranty_date = warranty_date;
    if (inspected) listing.inspected = inspected;
    if (inspection_report) listing.inspection_report = inspection_report;
    if (price_QR) listing.price_QR = price_QR;
    if (price_range) listing.price_range = price_range;
    if (negotiable) listing.negotiable = negotiable;
    if (description) listing.description = description;
    if (vehicle_location) listing.vehicle_location = vehicle_location;
    if (spare_parts) listing.spare_parts = spare_parts;
    if (tyres) listing.tyres = tyres;
    if (contact_details) listing.contact_details = contact_details;
    if (car_images) listing.car_images = car_images;
    if (mobile_no) listing.mobile_no = mobile_no;
    if (contact_name) listing.contact_name = contact_name;
    if (email_address) listing.email_address = email_address;
    if (whatsapp_no) listing.whatsapp_no = whatsapp_no;

    await listing.save();

    res.status(200).json({
      success: true,
      message: "Listing updated successfully",
      carListing: listing,
    });
  } catch (error) {
    console.error("Error updating car listing:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete Car Listing
export const deleteCarListing = async (req, res) => {
  const listingId = req.params.id;
  try {
    // Attempt to delete the listing
    const result = await CarListing.deleteOne({ _id: listingId });

    // Check if the deletion was successful
    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Listing not found" });
    }

    // If deletion was successful, return success response
    res
      .status(200)
      .json({ success: true, message: "Listing deleted successfully" });
  } catch (error) {
    console.error("Error deleting car listing:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get All Car
export const getAllCarListings = async (req, res) => {
  try {
    const listings = await CarListing.find();
    res.status(200).json({ success: true, carListings: listings });
  } catch (error) {
    console.error("Error fetching car listings:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get Single Listing
export const getCarListingById = async (req, res) => {
  const listingId = req.params.id;

  try {
    const listing = await CarListing.findById(listingId);
    if (!listing) {
      return res
        .status(404)
        .json({ success: false, message: "Listing not found" });
    }
    res.status(200).json({ success: true, carListing: listing });
  } catch (error) {
    console.error("Error fetching car listing:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Add Favorite API Endpoint
export const addFavorite = async (req, res) => {
  const userId = req.params.id; // Assuming the user ID is available in the request object
  const { listingId } = req.body;

  try {
    // Check if the user is trying to favorite their own listing
    const listing = await CarListing.findById(listingId);
    if (!listing) {
      return res
        .status(404)
        .json({ success: false, message: "Listing not found" });
    }

    if (listing.user.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot favorite your own listing",
      });
    }

    // Check if the listing is already in the user's favorites
    const user = await User.findById(userId);
    if (user.favorite_listings.includes(listingId)) {
      return res.status(400).json({
        success: false,
        message: "This listing is already in your favorites",
      });
    }

    // Add the listing to the user's favorites
    user.favorite_listings.push(listingId);
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Listing added to favorites", user });
  } catch (error) {
    console.error("Error adding favorite:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Remove Favorite API Endpoint
export const removeFavorite = async (req, res) => {
  const userId = req.params.id; // Assuming the user ID is available in the request object
  const { listingId } = req.body;

  try {
    // Find the user and update the favorite_listings array
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { favorite_listings: listingId } },
      { new: true }
    );
    res
      .status(200)
      .json({ success: true, message: "Listing removed from favorites", user });
  } catch (error) {
    console.error("Error removing favorite:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllFavoriteListings = async (req, res) => {
  const userId = req.params.id; // Assuming the user ID is available in the request object

  try {
    // Find the user and populate the favorite_listings array to get details of the listings
    const user = await User.findById(userId).populate("favorite_listings");
    res
      .status(200)
      .json({ success: true, favorite_listings: user.favorite_listings });
  } catch (error) {
    console.error("Error fetching favorite listings:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Add User Images
export const uploadImage = async (req, res, next) => {
  let images = [];
  if (req.files && req.files.avatars) {
    if (!Array.isArray(req.files.avatars)) {
      images.push(req.files.avatars);
    } else {
      images = req.files.avatars;
    }
  }
  let responce = [];
  for (const image of images) {
    try {
      const result = await cloudinary.v2.uploader.upload(image.tempFilePath);
      const publidId = result.public_id;
      const url = result.url;
      let data = {
        publidId,
        url,
      };
      //  console.log(data);
      responce.push(data);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Error uploading images" });
    }
  }
  // console.log("-->1",responce);
  //     res.json{responce , result}
  res.send(responce);
};
