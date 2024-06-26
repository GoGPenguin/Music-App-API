import { Request, Response } from "express";
import { Singer } from "../../models/singer.model";
import { convertToSlug } from "../../../../helper/convertToSlug";

// [GET] /api/v1/singers
export const index = async (req: Request, res: Response) => {
  const { searchKey, currentPage, perPage } = req.query;
  const currentPageValue = parseInt(currentPage as string) || 1;
  const perPageValue = parseInt(perPage as string) || null;
  let query = {};
  if (searchKey) {
    query = {
      name: new RegExp(searchKey as string, "i"),
    };
  }

  try {
    const singers = await Singer.find({
      ...query,
      status: "active",
      deleted: false,
    })
      .skip((currentPageValue - 1) * perPageValue)
      .limit(perPageValue);

    res.status(200).json({ singers: singers });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

// [GET] /api/v1/singers/detail/:idSinger
export const detail = async (req: Request, res: Response) => {
  const { idSinger } = req.params;
  if (!idSinger) {
    return res.status(400).json({
      message: "Missing required fields",
    });
  }

  try {
    const singer = await Singer.findOne({
      _id: idSinger,
      status: "active",
      deleted: false,
    });

    if (!singer) {
      return res.status(404).json({
        message: "Singer not found",
      });
    }

    res.status(200).json({ singer });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

// [POST] /api/v1/singers/create
export const create = async (req: Request, res: Response) => {
  const { fullName, avatar } = req.body;
  if (!fullName || !avatar) {
    return res.status(400).json({
      message: "Missing required fields",
    });
  }

  try {
    const singer = new Singer({
      fullName,
      avatar,
      slug: convertToSlug(fullName),
    });

    await singer.save();

    res.status(201).json({ singer });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

// [PATCH] /api/v1/singers/edit/:idSinger
export const edit = async (req: Request, res: Response) => {
  const { idSinger } = req.params;
  const { fullName, avatar } = req.body;
  if (!idSinger || !fullName || !avatar) {
    return res.status(400).json({
      message: "Missing required fields",
    });
  }

  try {
    const singer = await Singer.findOne({
      _id: idSinger,
      status: "active",
      deleted: false,
    });

    if (!singer) {
      return res.status(404).json({
        message: "Singer not found",
      });
    }

    singer.fullName = fullName;
    singer.avatar = avatar;
    singer.slug = convertToSlug(fullName);

    await singer.save();

    res.status(200).json({ singer });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

// [DELETE] /api/v1/singers/delete/:idSinger
export const deleteSinger = async (req: Request, res: Response) => {
  const { idSinger } = req.params;
  if (!idSinger) {
    return res.status(400).json({
      message: "Missing required fields",
    });
  }

  try {
    const singer = await Singer.findOne({
      _id: idSinger,
      status: "active",
      deleted: false,
    });

    if (!singer) {
      return res.status(404).json({
        message: "Singer not found",
      });
    }

    singer.deleted = true;

    await singer.save();

    res.status(200).json({
      message: "Singer deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};
