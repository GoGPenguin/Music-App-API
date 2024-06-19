import { Request, Response, NextFunction } from "express";
import { uploadToCloudinary } from "../../../helper/uploadToCloudDinary";

export const uploadSingle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await uploadToCloudinary(req["file"].buffer);
    req.body[req["file"].fieldname] = result;
  } catch (error) {
    console.error("Error uploading to cloudinary:", error);
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
  next();
};

export const uploadMultiple = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    for (const key in req["files"]) {
      req.body[key] = [];

      const array = req["files"][key];
      for (const item of array) {
        const result = await uploadToCloudinary(item.buffer);
        req.body[key].push(result);
      }
    }
  } catch (error) {
    console.error("Error uploading to cloudinary:", error);
    return res.status(500).json({
      code: 500,
      message: error.message || "Internal server error",
    });
  }
  next();
};
