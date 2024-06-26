import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../../../../helper/jwtHandle";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let bearer = null
  if (req.headers.authorization) {
    bearer = req.headers.authorization.split(" ")[1];
  }

  const token = req.cookies.token || bearer;

  const user = await verifyToken(token, "admin");
  if (!user) {
    return res.status(401).json({
      message: "User is not authenticated!",
    });
  }
  req["user"] = user;
  req["token"] = token;

  next();
};
