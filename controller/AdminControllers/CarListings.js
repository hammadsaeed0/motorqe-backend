import { CarListing } from "../../model/Car.js";

export const getAllCarListings = async (req, res) => {
    try {
      const listings = await CarListing.find();
      res.status(200).json({ success: true, carListings: listings });
    } catch (error) {
      console.error("Error fetching car listings:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };