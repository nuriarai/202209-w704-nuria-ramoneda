import type { Request, RequestHandler, Response } from "express";
import type { ItemStructure } from "../../../database/models/Item.js";
import { Item } from "../../../database/models/Item.js";
import type { CustomRequest } from "../../types";

export const getItems = async (req: CustomRequest, res: Response) => {
  const { userId } = req;

  const items = await Item.find({ owner: userId });

  res.status(200).json({ items });
};

export const createItem: RequestHandler = (
  req: Request<Record<string, unknown>, Record<string, unknown>, ItemStructure>,
  res
) => {
  debugger;
  const { madeIn, name, picture, owner } = req.body;
  const newItem = Item.create({ name });
  res.status(201).json({ newItem });
};
