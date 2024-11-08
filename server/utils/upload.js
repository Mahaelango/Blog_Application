import express from "express";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Use GridFsStorage to save files to MongoDB
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

const storage = new GridFsStorage({
  url: `mongodb+srv://${username}:${password}@blog-app.a6pkt.mongodb.net/?retryWrites=true&w=majority&appName=blog-app`,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (request, file) => {
    const match = ["image/png", "image/jpg", "image/jpeg"];
    if (match.indexOf(file.mimetype) === -1) {
      return new Error("Invalid file type. Only PNG, JPG, and JPEG are allowed.");
    }

    return {
      bucketName: "photos",  // GridFS bucket name
      filename: `${Date.now()}-blog-${file.originalname}`, // Unique filename
    };
  },
});

const upload = multer({ storage });

export default upload; 
