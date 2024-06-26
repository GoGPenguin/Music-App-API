import { Request, Response } from "express";
import { Manager } from "../../models/manager.model";
import {
  comparePassword,
} from "../../../../helper/bcryptPassword";
import { createToken } from "../../../../helper/jwtHandle";


// [POST] /admin/login
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const existManager = await Manager.findOne({
      username,
      deleted: false,
    });

    if (!existManager) {
      return res.status(404).json({
        message: "Manager not found",
      });
    }

    const isMatch = await comparePassword(password, existManager.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Password is incorrect",
      });
    }

    const token = createToken(
      {
        id: existManager._id,
        username: existManager.username,
        fullName: existManager.fullName,
      },
      "admin"
    );
    res.cookie("token", token, { maxAge: 3600000, httpOnly: true });

    return res.status(200).json({
      message: "Login successfully",
      accessToken: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// [GET] /admin/logout
export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token");

    return res.status(200).json({
      message: "Logout successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


