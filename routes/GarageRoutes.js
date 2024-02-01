import express from "express";
import multer from "multer";
const storage = multer.memoryStorage();
const router = express.Router();
import { CreateGarage,getAllGarages } from "../controller/GarageController.js";
import { documentStorage } from "../utils/upload.utils.js";
const upload = multer({ storage: documentStorage });



router.post('/add-appointment', upload.single('file'), CreateGarage);
router.get('/get-all-garage',getAllGarages)

export default router;