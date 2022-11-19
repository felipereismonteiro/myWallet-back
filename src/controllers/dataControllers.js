import { db, dbUsers, dbUsersTokens } from "../db.js";

export async function entryPost(req, res) {
  try {
    const user = req.user;
    await db.collection("userEntries").insertOne(user);
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(401);
  }
}

export async function exitPost(req, res) {
  try {
    const user = req.user;
    await db.collection("userExits").insertOne(user);
    res.sendStatus(201);
  } catch (err) {
    res.send(err.details.map((detail) => detail.message));
  }
}

export async function getEntry(req, res) {
  try {
    const name = req.name;
    const entries = await db.collection("userEntries").find({ name }).toArray();
    res.status(200).send(entries);
  } catch (error) {
    console.log(error);
    res.sendStatus(401);
  }
}

export async function getExit(req, res) {
  try {
    const name = req.name;
    const exits = await db.collection("userExits").find({ name }).toArray();
    res.status(200).send(exits);
  } catch (error) {
    console.log(error);
    res.sendStatus(401);
  }
}
