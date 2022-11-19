import dayjs from "dayjs";
import { db, dbUsers, dbUsersTokens } from "../db.js";
import { entrySchema, exitSchema } from "../models/dataSchemas.js";

export async function entryPost(req, res) {
  const token = req.headers.authorization.replace("Bearer ", "");
  const { value, description } = req.body;

  try {
    const foundedToken = await dbUsersTokens.findOne({ token });
    const { name } = await dbUsers.findOne({ _id: foundedToken.id });

    if (!foundedToken) {
      return res.sendStatus(404);
    }

    const dataEntry = {
      name,
      value,
      description,
      typeof: "Entry",
      date: dayjs().format("DD/MM/YYYY"),
    };

    const validate = await entrySchema.validateAsync(dataEntry);

    await db.collection("userEntries").insertOne(validate);
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(401);
  }
}

export async function exitPost(req, res) {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    const { value, description } = req.body;

    const tokenFounded = await dbUsersTokens.findOne({ token });
    const { name } = await dbUsers.findOne({ _id: tokenFounded.id });

    if (!tokenFounded) {
      return res.sendStatus(404);
    }

    const exitData = {
      name,
      value,
      description,
      typeof: "Exit",
      date: dayjs().format("DD/MM/YYYY"),
    };

    const validate = await exitSchema.validateAsync(exitData);
    await db.collection("userExits").insertOne(validate);
    res.sendStatus(201);
  } catch (err) {
    res.send(err.details.map((detail) => detail.message));
  }
}

export async function getEntry(req, res) {
  const token = req.headers.authorization.replace("Bearer ", "");

  try {
    const tokenFounded = await dbUsersTokens.findOne({ token });

    if (!tokenFounded) {
      return res.sendStatus(404);
    }

    const { name } = await dbUsers.findOne({ _id: tokenFounded.id });

    const entries = await db.collection("userEntries").find({ name }).toArray();
    res.status(200).send(entries);
  } catch (error) {
    console.log(error);
    res.sendStatus(401);
  }
}

export async function getExit(req, res) {
  const token = req.headers.authorization.replace("Bearer ", "");

  try {
    const tokenFounded = await dbUsersTokens.findOne({ token });

    if (!tokenFounded) {
      return res.sendStatus(404);
    }

    const { name } = await dbUsers.findOne({ _id: tokenFounded.id });

    const exits = await db.collection("userExits").find({ name }).toArray();
    res.status(200).send(exits);
  } catch (error) {
    console.log(error);
    res.sendStatus(401);
  }
}
