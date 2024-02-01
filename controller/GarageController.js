import multer from "multer";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { Garage } from "../model/Garage.js";
import ErrorHandler from "../utils/errorHandler.js";
import cloudinary from "cloudinary";
import bcrypt from "bcrypt";

// Configure Multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const CreateGarage = catchAsyncError(async (req, res) => {
    try {
        // Destructuring the request body to get individual parameters
        const {
            garageOwnerId,
            userId,
            carId,
            typeofListing,
            garageName,
            address,
            workingDays,
            workingHours,
            mobileGarage,
            pickupDelivery,
            availableDays,
            availableDatesFrom,
            about,
            location,
            category,
            servicePrice,
            serviceName,
            status  
        } = req.body;

        // Checking if file is uploaded 
        if (!req.file) {
            return res.status(400).json({ error: 'File upload required' });
        }

        // Access the uploaded file from req.file.buffer
        const { fileName, path } = req.file;
        const logo = {
            fileName: fileName,
            filePath: path,
        };
        
        // Creating a new Garage instance with the logo
        const newGarage = await Garage.create({
            garageOwnerId,
            userId,
            carId,
            typeofListing,
            garageName,
            address,
            workingDays,
            workingHours,
            mobileGarage,
            pickupDelivery,
            availableDays,
            availableDatesFrom,
            logo,
            about,
            location,
            category,
            services: { servicePrice, serviceName },
            date: new Date(),
            status
        });

        // Saving the garage instance to the database
        // await newGarage.save();

        // Responding with the created garage
        res.status(201).json(newGarage);
    } catch (error) {
        // Handling errors and sending a response with the error message
        res.status(400).json({ error: error.message });
    }
});



export const getAllGarages = async (req, res) => {
    try {
        // Fetch all documents from the Garage collection
        const garages = await Garage.find();

        // Send the fetched data as a response
        res.status(200).json(garages);
    } catch (error) {
        // Handle errors and send an error response
        res.status(500).json({ error: error.message });
    }
};
// export const uploadImage = async (req, res, next) => {
//     let images = [];
//     if (req.files && req.files.avatars) {
//         if (!Array.isArray(req.files.avatars)) {
//             images.push(req.files.avatars);
//         } else {
//             images = req.files.avatars;
//         }
//     }
//     let response = [];
//     for (const image of images) {
//         try {
//             const result = await cloudinary.v2.uploader.upload(image.tempFilePath);
//             const publicId = result.public_id;
//             const url = result.url;
//             let data = {
//                 publicId,
//                 url,
//             };
//             response.push(data);
//         } catch (error) {
//             console.log(error);
//             return res.status(500).json({ error: "Error uploading images" });
//         }
//     }
//     res.send(response);
// };
