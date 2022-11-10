import express from "express";
import {
  getItems,
  createItem,
} from "../../controllers/itemsControllers/itemsControllers.js";

// eslint-disable-next-line new-cap
const itemsRouter = express.Router();

itemsRouter.get("/list", getItems);
itemsRouter.post("/create", createItem);

export default itemsRouter;
