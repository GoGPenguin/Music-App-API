import { Request, Response } from "express";
import { User } from "../../models/user.model";
import { Manager } from "../../models/manager.model";
import { bcryptPassword } from "../../../../helper/bcryptPassword";

// [GET] /api/v1/admin/users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({
      deleted: false,
    }).select("-password");

    return res.status(200).json({
      users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// [POST] /api/v1/admin/create
export const create = async (req: Request, res: Response) => {
  try {
    const { username, password, fullName } = req.body;

    const existManager = await Manager.findOne({
      username,
      deleted: false,
    });

    if (existManager) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    const hashedPassword = await bcryptPassword(password);

    const manager = new Manager({
      username,
      password: hashedPassword,
      fullName,
    });

    await manager.save();

    return res.status(201).json({
      message: "Manager created successfully",
      username: manager.username,
      fullName: manager.fullName,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// [PUT] /api/v1/admin/update
export const update = async (req: Request, res: Response) => {
  try {
    const { password, fullName } = req.body;

    const manager = await Manager.findOne({
      _id: req["user"].id,
      deleted: false,
    });

    if (!manager) {
      return res.status(404).json({
        message: "Manager not found",
      });
    }

    if (password) manager.password = await bcryptPassword(password);
    if (fullName) manager.fullName = fullName;

    await manager.save();

    return res.status(200).json({
      message: "Manager updated successfully",
      username: manager.username,
      fullName: manager.fullName,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

