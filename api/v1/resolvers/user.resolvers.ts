import { User } from "../../v1/models/user.model";
import {
  bcryptPassword,
  comparePassword,
} from "../../../helper/bcryptPassword";

export const resolversUser = {
  Query: {
    getUserInfo: async (_, args, context) => {
      try {
        if (!context["user"]) {
          return {
            code: 400,
            message: "User is not authenticated!",
          };
        }

        const user = await User.findOne({
          token: context["user"].token,
          deleted: false,
        });

        if (!user) {
          return {
            code: 400,
            message: "User not found!",
          };
        }

        return {
          code: 200,
          message: "User found!",
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          token: user.token,
        };
      } catch (error) {
        return {
          code: 500,
          message: error.message,
        };
      }
    },
  },

  Mutation: {
    createUser: async (_, { user }) => {
      try {
        const userExist = await User.findOne({
          email: user.email,
        });

        if (userExist) {
          return {
            code: 400,
            message: "Email already exist!",
          };
        }

        user.password = await bcryptPassword(user.password);
        const newUser = new User(user);

        const data = await newUser.save();

        return {
          code: 200,
          message: "User created successfully!",
          id: data._id,
          fullName: data.fullName,
          email: data.email,
          token: data.token,
        };
      } catch (error) {
        return {
          code: 500,
          message: error.message,
        };
      }
    },

    loginUser: async (_, { loginInput }) => {
      try {
        const user = await User.findOne({
          email: loginInput.email,
          deleted: false,
        });

        if (!user) {
          return {
            code: 400,
            message: "Email not found!",
          };
        }

        const isPasswordCorrect = await comparePassword(
          loginInput.password,
          user.password
        );

        if (isPasswordCorrect) {
          return {
            code: 200,
            message: "Login successful!",
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            token: user.token,
          };
        }

        return {
          code: 400,
          message: "Password is incorrect!",
        };
      } catch (error) {
        return {
          code: 500,
          message: error.message,
        };
      }
    },
  },
};
