import { Request, Response } from "express";

//[GET] /dashboard
export const index = (req: Request, res: Response) => {
    res.status(200).json({
        message: "Dashboard",
    });
}