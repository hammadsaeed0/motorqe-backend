import express from "express";
import {
  addFavorite,
  createCarListing,
  createPlan,
  deleteCarListing,
  deletePlanById,
  getAllCarListings,
  getAllFavoriteListings,
  getAllPlans,
  getCarListingById,
  getPlanById,
  loginUser,
  registerUser,
  removeFavorite,
  selectPlan,
  submitContactForm,
  updateCarListing,
  updatePlanById,
  uploadImage,
} from "../controller/userController.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.route("/registerUser").post(registerUser);
router.route("/loginUser").post(loginUser);
router.route("/submitContactForm").post(submitContactForm);
router.route("/plans").post(createPlan);
router.route("/plans").get(getAllPlans);
router.route("/plans/:id").delete(deletePlanById);
router.route("/plans/:id").put(updatePlanById);
router.route("/plans/:id").get(getPlanById);
router.route("/createCar").post(createCarListing);
router.route("/selectPlan").post(selectPlan);
router.route("/carListings/:id").post(updateCarListing);
router.route("/carListings/:id").delete(deleteCarListing);
router.route("/carListings").get(getAllCarListings);
router.route("/carListings/:id").get(getCarListingById);
router.route("/favorite/:id").post(addFavorite);
router.route("/favorite/:id").delete(removeFavorite);
router.route("/favorite/:id").get(getAllFavoriteListings);
router.route("/uploadImage", upload.array("avatars")).post(uploadImage);

export default router;
