import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    // upload the file on cloudinary
    const response = await cloudinary.uploader.upload(
      localFilePath,
      { resource_type: "auto" },
      function (error, result) {
        console.log("File is uploaded on cloudinary", result); // file has been uploaded successfully
      }
    );

    console.log(response, response.url);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved temperory file as the upload operation got failed
    console.log("AN ERROR OCCURED WHIEL UPLOADING FILE :: ", error);
    return null;
  }
};

export { uploadOnCloudinary };
