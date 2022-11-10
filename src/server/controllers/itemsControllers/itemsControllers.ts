import fs from "fs/promises";
import path from "path";
import type { Request, RequestHandler, Response } from "express";
import type { ItemStructure } from "../../../database/models/Item.js";
import { Item } from "../../../database/models/Item.js";
import type { CustomRequest } from "../../types";

export const getItems = async (req: CustomRequest, res: Response) => {
  const { userId } = req;

  const items = await Item.find({ owner: userId });

  res.status(200).json({ items });
};

export const createItem: RequestHandler = async (
  req: Request<Record<string, unknown>, Record<string, unknown>, ItemStructure>,
  res
) => {
  const { madeIn, name, owner } = req.body;

  console.log(req.file);

  await fs.rename(
    path.join("assets", "images", req.file.filename),
    path.join("assets", "images", req.file.originalname)
  );

  const newItem = await Item.create({
    owner,
    madeIn,
    name,
    picture: req.file.originalname,
  });
  res.status(201).json({ newItem });
};
