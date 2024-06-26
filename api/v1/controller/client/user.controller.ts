import { Request, Response } from "express";
import { User } from "../../models/user.model";
import {
  bcryptPassword,
  comparePassword,
} from "../../../../helper/bcryptPassword";
import { createToken } from "../../../../helper/jwtHandle";

// [POST] /api/v1/users/register
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, fullName } = req.body;

    const existUser = await User.findOne({
      email,
      deleted: false,
    });

    if (existUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcryptPassword(password);

    const user = new User({
      email,
      password: hashedPassword,
      fullName,
    });

    await user.save();

    return res.status(201).json({
      message: "User created successfully",
      email: user.email,
      fullName: user.fullName,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// [POST] /api/v1/users/login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const existUser = await User.findOne({
      email,
      deleted: false,
    });

    if (!existUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await comparePassword(password, existUser.password);
    console.log(isMatch);

    if (!isMatch) {
      return res.status(400).json({
        message: "Password is incorrect",
      });
    }

    const token = createToken({
      id: existUser._id,
      email: existUser.email,
      fullName: existUser.fullName,
    }, "client");

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

// [GET] /api/v1/users/detail
export const detail = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({
      _id: req["user"].id,
      deleted: false,
    }).select("-password -deleted -createdAt -updatedAt -__v");

    return res.status(200).json({
      message: "User detail",
      user,
      token: req["token"],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// [GET] /api/v1/users/logout
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

// [PUT] /api/v1/users/update
export const update = async (req: Request, res: Response) => {
  try {
    const { fullName, password } = req.body;
    const avatar = req.body.avatar ? req.body.avatar : null;

    const user = await User.findOne({
      _id: req["user"].id,
      deleted: false,
    });

    if (fullName) {
      user.fullName = fullName;
    }

    if (password) {
      const hashedPassword = await bcryptPassword(password);
      user.password = hashedPassword;
    }

    if (avatar) {
      user.avatar = avatar;
    }

    const updatedUser = {
      fullName: user.fullName,
      avatar: user.avatar,
    };

    await user.save();
    return res.status(200).json({
      message: "Update user successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
