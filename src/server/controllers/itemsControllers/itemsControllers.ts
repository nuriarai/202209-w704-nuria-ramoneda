import fs from "fs/promises";
import path from "path";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { ItemStructure } from "../../../database/models/Item.js";
import { Item } from "../../../database/models/Item.js";
import CustomError from "../../../CustomError/CustomError.js";

export const getItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const items = await Item.find();

    res.status(200).json({ items });
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      "Error getting de list of items",
      500
    );
    next(customError);
  }
};

export const createItem: RequestHandler = async (
  req: Request<Record<string, unknown>, Record<string, unknown>, ItemStructure>,
  res: Response,
  next: NextFunction
) => {
  const { madeIn, name, owner } = req.body;

  const timestamp = Date.now();
  const fileSplitted = req.file.originalname.split(".");
  const newFilename = `${fileSplitted.shift()}_${timestamp}.${fileSplitted.pop()}`;

  try {
    await fs.rename(
      path.join("assets", "images", req.file.filename),
      path.join("assets", "images", newFilename)
    );

    const newItem = await Item.create({
      owner,
      madeIn,
      name,
      picture: newFilename,
    });

    res.status(201).json({ newItem, picture: `assets/images/${newFilename}` });
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      "Error on item creation",
      500
    );
    next(customError);
  }
};

export const deleteItem: RequestHandler = async (
  req: Request<Record<string, unknown>, Record<string, unknown>, ItemStructure>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const item = await Item.findById(id);

  try {
    if (item.picture) {
      await fs.unlink(path.join("assets", "images", item.picture));
    }

    await Item.deleteOne({ id });

    res.status(201).json();
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      "Error with image",
      500
    );
    next(customError);
  }
};
