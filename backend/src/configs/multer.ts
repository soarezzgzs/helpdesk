import multer from "multer";
import path from "path";
import crypto from "crypto";

export const uploadConfig = {
  storage: multer.diskStorage({
    destination: path.resolve("uploads"),

    filename(req, file, callback) {
      const hash = crypto.randomBytes(8).toString("hex");

      callback(
        null,
        `${hash}-${file.originalname}`
      );
    }
  })
};