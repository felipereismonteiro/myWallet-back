import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);
export let db;

await mongoClient.connect();
db = mongoClient.db("myWallet");

export const dbUsers = db.collection("users");
export const dbUsersTokens = db.collection("usersTokens");