import { Request, Response } from "express";

//[GET] /upload
export const index = (req: Request, res: Response) => {
    res.status(200).json({
        location: req.body.file,
    });
}