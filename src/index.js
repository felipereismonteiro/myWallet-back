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
import { entryPost } from "./controllers/dataControllers.js";
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

app.post("/sign-in", signIn);

app.post("/sign-up", signUp);

app.put("/update", updateToken);

setInterval(deleteInactiveTokens, 15000);

app.post("/entry", entryPost);

app.post("/exit");

app.listen(5000, () => console.log("Server on port:5000"));
