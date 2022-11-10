import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import CustomError from "../../../CustomError/CustomError.js";
import User from "../../../database/models/User.js";
import type { Credentials, RegisterData } from "../../types";
import environtment from "../../../loadEnvironment.js";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password, username } = req.body as RegisterData;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashedPassword,
      email,
    });

    res.status(201).json({ user: { id: newUser._id, username, email } });
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      "Something went wrong",
      500
    );
    next(customError);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body as Credentials;

  const user = await User.findOne({ username });

  if (!user) {
    const error = new CustomError(
      "Username not found",
      "Wrong credentials",
      401
    );
    next(error);
    return;
  }

  if (!(await bcrypt.compare(password, user.password))) {
    const error = new CustomError(
      "Password is incorrect",
      "Wrong credentials",
      401
    );
    next(error);
    return;
  }

  const tokenPayload = {
    id: user._id,
    username,
  };

  const token = jwt.sign(tokenPayload, environtment.jwtSecret, {
    expiresIn: "2d",
  });

  res.status(200).json({ accessToken: token });
};
