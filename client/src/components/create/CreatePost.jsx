import React, { useState, useContext } from "react";
import { DataContext } from "../../context/DataProvider.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, FormControl, styled, InputBase, Button, TextareaAutosize } from "@mui/material";
import { AddAPhoto as Add } from "@mui/icons-material";

const Container = styled(Box)(({ theme }) => ({
  margin: "50px 100px",
}));

const StyledFormControl = styled(FormControl)`
  margin-top: 10px;
  display: flex;
  flex-direction: row;
`;

const InputTextField = styled(InputBase)`
  flex: 1;
  margin: 0 30px;
  font-size: 25px;
`;

const Textarea = styled(TextareaAutosize)`
  width: 100%;
  border: none;
  margin-top: 50px;
  font-size: 18px;
  &:focus-visible {
    outline: none;
  }
`;

const initialPost = {
  title: "",
  description: "",
  picture: "",
  username: "",
  categories: "",
  createdDate: new Date(),
};

export const CreatePost = () => {
  const [post, setPost] = useState(initialPost);
  const [file, setFile] = useState(null); // File state for image
  const [imageUrl, setImageUrl] = useState(""); // State to store image URL after upload

  const { account } = useContext(DataContext);
  const navigate = useNavigate();

  // Handle file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle input change for text fields
  const handleChange = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  // Handle image upload and setting imageUrl state
  const handleImageUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const response = await axios.post("http://localhost:8000/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setImageUrl(response.data.url); // Set the image URL after upload
        setPost((prevPost) => ({
          ...prevPost,
          picture: response.data.url, // Save the image URL to post data
        }));
      } else {
        console.error("Error uploading file");
      }
    } catch (error) {
      console.error("Error during file upload", error);
    }
  };

  // Handle post submission
  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/posts", post);
      if (response.data.success) {
        console.log("Post created successfully!");
        navigate("/"); // Navigate to home page after post creation
      } else {
        console.error("Error creating post:", response.data.message);
      }
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  };

  return (
    <Container>
      <img
        src={imageUrl || "https://images.unsplash.com/photo-1543128639-4cb7e6eeef1b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bGFwdG9wJTIwc2V0dXB8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80"}
        alt="banner"
      />
      <StyledFormControl>
        <label htmlFor="fileInput">
          <Add fontSize="large" color="action" />
        </label>
        <input
          type="file"
          id="fileInput"
          style={{ display: "none" }}
          onChange={handleFileChange} // Set file on change
        />
        <Button variant="contained" onClick={handleImageUpload}>
          Upload Image
        </Button>
        <InputTextField
          placeholder="Title"
          onChange={handleChange}
          name="title"
        />
        <Button variant="contained" onClick={handleSubmit}>
          Publish
        </Button>
      </StyledFormControl>
      <Textarea
        minRows={5}
        placeholder="Tell Your Story..."
        onChange={handleChange}
        name="description"
      />
    </Container>
  );
};

export default CreatePost;
