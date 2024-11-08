import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/route.js";
import Connection from "./database/db.js";

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // To parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Routes
app.use(router);

// MongoDB connection
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
Connection(username, password);

// Define the port (use environment variable or fallback to 5000)
const PORT = process.env.PORT || 8000;  // Default to 5000 if no environment variable is set

// Start the server
app.listen(PORT, () => console.log(`Server is running successfully on PORT ${PORT}`));
