import { nanoid } from "nanoid";
import multer from "multer";
import fs from "fs"

const uploadPath = "uploads/document/";
const uniqueId = nanoid(10);


if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

export const documentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, uniqueId + "-" + file.originalname);
  },
});