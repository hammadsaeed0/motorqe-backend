import path from "path";
import {fileURLToPath} from "url"
import express from "express";
import { connectDB } from "./config/database.js";
const app = express();
import { APP_PORT } from "./config/index.js";
import router from "./routes/userRoutes.js";
import packages from "./routes/PlaneRoutes.js";
import ErrorMiddleware from "./middleware/Error.js";
import bodyParser from "body-parser";
import cors from "cors";
import fileupload from "express-fileupload";
import garageRoutes from "./routes/GarageRoutes.js";
import adminCarListing from './routes/AdminRoutes/CardListings.js'
import favouritRoutes from './routes/FavouritRoutes.js'
connectDB();
// Use Middlewares
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(
  express.urlencoded({
    extended: true,
  })
);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(
  fileupload({
    useTempFiles: true,
  })
);
// Import User Routes
app.use("/v1", router);
app.use('/v1/garage',garageRoutes)
app.use('/v1/packages',packages)
app.use('/v1/admin',adminCarListing)
app.use('/v1/users',favouritRoutes)
app.listen(APP_PORT, () => {
  console.log(`Server is Running ${APP_PORT}`);
});
app.use(ErrorMiddleware);