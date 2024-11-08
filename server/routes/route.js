import express from "express";
import { signupUser, loginUser } from "../controller/user-controller.js";
import { uploadImage } from "../controller/image-controller.js";
import upload from "../utils/upload.js";


const router = express.Router();

// User Routes
router.post("/signup", signupUser);
router.post("/login", loginUser);

// File Upload Route
router.post("/file/upload", upload.single("file"), uploadImage);

  
export default router;
