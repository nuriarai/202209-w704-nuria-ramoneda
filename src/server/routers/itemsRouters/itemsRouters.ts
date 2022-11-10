import express from "express";
import multer from "multer";
import {
  getItems,
  createItem,
} from "../../controllers/itemsControllers/itemsControllers.js";
import path from "path";

// eslint-disable-next-line new-cap
const itemsRouter = express.Router();

const upload = multer({
  dest: path.join("assets/images"),
});

itemsRouter.get("/list", getItems);
itemsRouter.post("/create", upload.single("picture"), createItem);

export default itemsRouter;
