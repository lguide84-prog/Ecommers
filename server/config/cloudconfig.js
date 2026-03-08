import {v2 as cloudinary} from "cloudinary";

const connectCloudinary = async() => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });
    console.log("Cloudinary connected successfully");
    console.log("Cloud name:", process.env.CLOUD_NAME);
  } catch (error) {
    console.error("Cloudinary connection error:", error);
  }
}

export default connectCloudinary;