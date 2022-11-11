import "../../../loadEnvironment.js";
import { MongoMemoryServer } from "mongodb-memory-server";
import connectDb from "../../../database/index.js";
import mongoose from "mongoose";
import app from "../../app.js";
import request from "supertest";
import type { RegisterData } from "../../types.js";
import User from "../../../database/models/User.js";

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectDb(server.getUri());
  // Await mongoose.connect(server.getUri());
});

beforeEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await server.stop();
});

describe("Given a POST register endpoint ", () => {
  describe("When it receives a request with the username 'Joan' & the password '1234'", () => {
    test("Then it should respond with a 201 status code and the user Joana  ", async () => {
      const statusExpected = 201;
      const registerData: RegisterData = {
        username: "Joana",
        password: "12345",
        email: "joana@joana.cat",
      };

      const response = await request(app)
        .post("/users/register")
        .send(registerData)
        .expect(statusExpected);

      expect(response.body).toHaveProperty("user");
      expect(response.body.user).toHaveProperty(
        "username",
        registerData.username
      );
      expect(response.body.user).toHaveProperty("id");
      expect(response.body.user).toHaveProperty("email");
    });
  });

  describe("When it receives a request with a username empty or username is incorrect", () => {
    test("Then it should respond with a 400 status code and a 'Wrong credentials' message", async () => {
      const statusExpected = 400;
      const messageExpected = "Wrong credentials";
      const registerData: RegisterData = {
        username: "",
        password: "12345",
        email: "joana@joana.cat",
      };

      const response = await request(app)
        .post("/users/register")
        .send(registerData)
        .expect(statusExpected);

      expect(response.body).toHaveProperty("error", messageExpected);
    });
  });
});
