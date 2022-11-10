import express from "express";
import morgan from "morgan";
import auth from "./middlewares/auth.js";
import { generalError, notFoundError } from "./middlewares/errors.js";
import itemsRouter from "./routers/itemsRouters/itemsRouters.js";
import usersRouter from "./routers/usersRouters/usersRouters.js";

const app = express();

app.disable("x-powered-by");

app.use(morgan("dev"));

app.use(express.json());

app.use("/users", usersRouter);
app.use("/items", auth, itemsRouter);

app.use(notFoundError);
app.use(generalError);

export default app;
