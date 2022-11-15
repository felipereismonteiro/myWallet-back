import { MongoClient } from "mongodb";
import { v4 as uuid } from "uuid";
import bcrypt from 'bcrypt';
import Joi from "joi";
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

const signInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.required(),
});

const signUpSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.required()
});

app.post("/sign-in", async (req, res) => {
  res.send("Entrou");
});

app.post("/sign-up", async (req, res) => {
  const user = req.body;
  const hashPassword = bcrypt.hashSync(req.body.password, 10);

  try {
    const validate = await signUpSchema.validateAsync(user, {abortEarly: false});
    const userFounded = await db.collection("users").find({$or: [{name: user.name}, {email: user.email}]}).toArray();

    if(userFounded.length > 0) {
      return res.status(401).send("Usuario ja cadastrado!");
    }

    await db.collection("users").insertOne({...validate, password: hashPassword})

    res.send("foi sim");
  } catch(err) {
    res.send(err.details.map(detail => detail.message));
  }
  

  
});

app.listen(5000, () => console.log("Server on port:5000"));
