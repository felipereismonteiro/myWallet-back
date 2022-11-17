import { MongoClient } from "mongodb";
import Joi from "joi";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import {
  signIn,
  signUp,
  updateToken,
  deleteInactiveTokens,
} from "./controllers/authControllers.js";
import { entryPost, exitPost, getEntry, getExit } from "./controllers/dataControllers.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const mongoClient = new MongoClient(process.env.MONGO_URI);
export let db;

await mongoClient.connect();
db = mongoClient.db("myWallet");

export const dbUsers = db.collection("users");
export const dbUsersTokens = db.collection("usersTokens");

export const signInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.required(),
});

export const signUpSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.required(),
});

export const exitSchema = Joi.object({
  name: Joi.string().required(),
  value: Joi.number().required(),
  description: Joi.string().required(),
  typeof: Joi.string().required(),
  date: Joi.string().min(3).required(),
});

export const entrySchema = Joi.object({
  name: Joi.string().required(),
  value: Joi.number().required(),
  description: Joi.string().required(),
  typeof: Joi.string().required(),
  date: Joi.string().min(3).required(),
});

app.post("/sign-in", signIn);

app.post("/sign-up", signUp);

app.put("/update", updateToken);

setInterval(deleteInactiveTokens, 10000);

app.post("/entry", entryPost);

app.post("/exit", exitPost);

app.get("/entry", getEntry);

app.get("/exit", getExit);

app.listen(5000, () => console.log("Server on port:5000"));
