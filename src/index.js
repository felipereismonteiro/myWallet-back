import { MongoClient } from "mongodb";
import { v4 } from "uuid";
import joi from "joi";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

await mongoClient.connect();
db = mongoClient.db("myWallet");

app.post("/sign-in", async (req, res) => {
    res.send("Entrou");
});

app.post("/sign-up", async (req, res) => {
    res.send("foi sim");
});

app.listen(5000, () => console.log("Server on port:5000"));
