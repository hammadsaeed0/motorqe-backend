

import express from "express";
const router = express.Router();
import {addToFavorites,removeFromFavorites} from "../controller/Favourits.js"



router.post('/addFav/:userId/:carListingId', addToFavorites);
router.delete('/removeFav/:userId/:carListingId', removeFromFavorites);

export default router;