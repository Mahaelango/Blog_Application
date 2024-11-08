import { request, response } from "express";

const url = "http://localhost:8000"; // Modify this URL based on your setup

export const uploadImage = (request, response) => {
  if (!request.file) {
    return response.status(400).json({ msg: "No file uploaded" });
  }

  const imageUrl = `${url}/file/${request.file.filename}`;  // Construct the image URL

  // Return the image URL in the response
  return response.status(200).json({ imageUrl });
};
