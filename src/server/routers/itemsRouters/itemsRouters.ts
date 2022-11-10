import express from "express";
import getItems from "../../controllers/itemsControllers/itemsControllers.js";

// eslint-disable-next-line new-cap
const itemsRouter = express.Router();

itemsRouter.get("/list", getItems);

export default itemsRouter;
