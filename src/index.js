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
      return res.status(401).send("Wrong password!!!");
    }

    const token = uuid();
    await db
      .collection("usersTokens")
      .insertOne({ id: founded._id, token, lastStatus: Date.now()});

    res.status(200).send(token);
  } catch (err) {
    console.log(err);
    return res.status(401).send(err.details.map((detail) => detail.message));
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
    } else if (validate.password.length === 0) {
      return res.status(400).send("Password is needed!!!");
    }

    const hashPassword = bcrypt.hashSync(req.body.password, 10);
    await db
      .collection("users")
      .insertOne({ ...validate, password: hashPassword });
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.send(err.details);
  }
});

app.put("/update", async (req, res) => {
  const {lastStatus} = req.body;
  const {authorization} = req.headers;
  const token = authorization.replace("Bearer ", "")
  const founded = await db.collection("usersTokens").findOne({token})

  console.log(founded);

  if(!founded) {
    return res.sendStatus(401);
  }

  try {
    await db.collection("usersTokens").updateOne({token}, {$set: {lastStatus}})
    res.sendStatus(200);
  } catch(err) {
    console.log(err);
  }
});

setInterval(async () => {
  const tokens = await db.collection("usersTokens").find().toArray();
  const filteredTokens = tokens.filter(t => Date.now() - t.lastStatus >= 10000);

  try { 
    filteredTokens.map(t => db.collection("usersTokens").deleteOne({_id: t._id}))
  } catch(err) {
    console.log(err);
  }

}, 15000);

app.listen(5000, () => console.log("Server on port:5000"));
