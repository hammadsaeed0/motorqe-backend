
import express from "express";
const router = express.Router();
import { getAllCarListings } from "../../controller/AdminControllers/CarListings.js";

router.get('/all-cars',getAllCarListings)



export default router;