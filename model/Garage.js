import mongoose from "mongoose";
const Schema = mongoose.Schema;

const GarageSchema = Schema({
    garageOwnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    carId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car'
    },
    typeofListing: {
        type: String,
        enum: ['features', 'standard'],
    },
    garageName: {
        type: String
    },
    address: {
        type: String
    },
    workingDays: {
        type: String
    },
    workingHours: {
        type: String
    },
    mobileGarage: {
        type: String
    },
    pickupDelivery: {
        type: String
    },
   
    availableDays: {
        type: String
    },
    availableDatesFrom: {
        type: String
    },
    logo: {
        fileName: String, 
        filePath: String,
    },
    about: {
        type: String,
    },
    
    location: {
        type: String,
    },
    category: {
        type: String
    },      
    services:[
        {
            servceName:{    
                type:String,
            },
            servicePrice:{
                type:String,
            }
        }
    ],
    date: Date,
    status: {
        type: String,
    }
});

export const Garage = mongoose.model("Garage", GarageSchema);


