import { MongoClient } from "mongodb";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";
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

const dbUsers = db.collection("users");

const signInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.required(),
});

const signUpSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.required(),
});

app.post("/sign-in", async (req, res) => {
  const user = req.body;

  try {
    const { email, password } = await signInSchema.validateAsync(user, {
      abortEarly: false,
    });
    const founded = await dbUsers.findOne({ email });

    if (!founded) {
      return res.status(404).send("Email not found");
    } else if (!bcrypt.compareSync(password, founded.password)) {
      return res.status(401).send("Password doesn`t match");
    }

    const token = uuid();
    await db
      .collection("usersTokens")
      .insertOne({ id: founded._id, token, lastStatus: Date.now() });

    res.status(200).send("logged");
  } catch (err) {
    console.log(err);
    return res.send(err.details.map((detail) => detail.message));
  }
});

app.post("/sign-up", async (req, res) => {
  const user = req.body;

  try {
    const validate = await signUpSchema.validateAsync(user, {
      abortEarly: false,
    });
    const userFounded = await db
      .collection("users")
      .findOne({ $or: [{ name: user.name }, { email: user.email }] });

    if (userFounded) {
      return res.status(401).send("Usuario ja cadastrado!");
    }

    const hashPassword = bcrypt.hashSync(req.body.password, 10);
    await db
      .collection("users")
      .insertOne({ ...validate, password: hashPassword });
    res.sendStatus(201);
  } catch (err) {
    res.send(err.details.map((detail) => detail.message));
  }
});

app.listen(5000, () => console.log("Server on port:5000"));
