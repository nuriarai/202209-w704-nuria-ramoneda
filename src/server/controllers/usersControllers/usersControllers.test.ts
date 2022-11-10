import type { Credentials } from "../../types";
import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../../../database/models/User.js";
import { loginUser, registerUser } from "./usersControllers";
import CustomError from "../../../CustomError/CustomError";

beforeEach(() => {
  jest.clearAllMocks();
});

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const next = jest.fn();

describe("Given a register controller", () => {
  const registerBody: Credentials = {
    username: "xavi",
    password: "12345",
  };

  describe("When it receives a username 'xavi' and a password '12345'", () => {
    test("Then it should invoke its method status with 201 and its method json with the received user id and the username", async () => {
      const expectedStatus = 201;

      const req: Partial<Request> = {
        body: registerBody,
      };

      User.create = jest.fn().mockResolvedValueOnce(registerBody);

      await registerUser(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalled();
    });
  });
});

describe("Given a loginUser controller", () => {
  const loginBody: Credentials = {
    username: "xavi",
    password: "12345",
  };

  const req: Partial<Request> = {
    body: loginBody,
  };

  describe("When it receives a request with an invalid username", () => {
    test("Then it should invoke the next function with a username error", async () => {
      User.findOne = jest.fn().mockResolvedValueOnce(null);
      const usernameError = new CustomError(
        "Username not found",

        "Wrong credentials",
        401
      );

      await loginUser(req as Request, res as Response, next as NextFunction);

      expect(next).toBeCalledWith(usernameError);
    });
  });

  describe("When it receives a valid username 'xavi' and the wrong password", () => {
    test("Then it should invoke the next function with a password error", async () => {
      User.findOne = jest.fn().mockResolvedValueOnce(loginBody);
      const passwordError = new CustomError(
        "Password is incorrect",

        "Wrong credentials",
        401
      );

      bcrypt.compare = jest.fn().mockResolvedValueOnce(false);

      await loginUser(req as Request, res as Response, next as NextFunction);

      expect(next).toBeCalledWith(passwordError);
    });
  });

  describe("when it receives a valid username 'xavi' and a valid password '12345'", () => {
    test("Then it should invoke the response method with a 200 status and its json method with a valid token", async () => {
      const expectedStatus = 200;
      User.findOne = jest.fn().mockResolvedValueOnce(loginBody);
      bcrypt.compare = jest.fn().mockResolvedValueOnce(true);

      await loginUser(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalled();
    });
  });
});
