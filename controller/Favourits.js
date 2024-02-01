import { User } from "../model/User.js";
import { CarListing } from "../model/Car.js";

// Function to add a car to user's favorites
export const addToFavorites = async (userId, carListingId) => {
    try {
        // Add car listing ID to user's favorite_listings array
        await User.findByIdAndUpdate(userId, { $push: { favorite_listings: carListingId } });
        // Add user ID to car listing's favorited_by_users array
        await CarListing.findByIdAndUpdate(carListingId, { $push: { favorited_by_users: userId } });
        return true;
    } catch (error) {
        console.error('Error adding car to favorites:', error);
        return false;
    }
};

// Function to remove a car from user's favorites
export const removeFromFavorites = async (userId, carListingId) => {
    try {
        // Remove car listing ID from user's favorite_listings array
        await User.findByIdAndUpdate(userId, { $pull: { favorite_listings: carListingId } });
        // Remove user ID from car listing's favorited_by_users array
        await CarListing.findByIdAndUpdate(carListingId, { $pull: { favorited_by_users: userId } });
        return true;
    } catch (error) {
        console.error('Error removing car from favorites:', error);
        return false;
    }
};
