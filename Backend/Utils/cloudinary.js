import cloudinary from "./cloudinary.config.js";
import fs from "fs";

export const uploadOnCloudinary = async (
  localFilePath
) => {
  try {
    if (!localFilePath) return null;

    const response =
      await cloudinary.uploader.upload(
        localFilePath,
        {
          folder: "FoodDash",
          resource_type: "auto",
        }
      );

    // remove temp file
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return {
      url: response.secure_url,
      public_id: response.public_id,
      resource_type: response.resource_type,
    };
  } catch (error) {
    if (
      localFilePath &&
      fs.existsSync(localFilePath)
    ) {
      fs.unlinkSync(localFilePath);
    }

    console.log(
      "Cloudinary Upload Error:",
      error
    );

    return null;
  }
};


export const deleteFromCloudinary = async (
  publicId,
  resourceType = "image"
) => {
  try {
    if (!publicId) return;

    await cloudinary.uploader.destroy(
      publicId,
      {
        resource_type: resourceType,
      }
    );

    return true;
  } catch (error) {
    console.log(
      "Cloudinary Delete Error:",
      error
    );

    return false;
  }
};
