import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";
import { db, dbUsersTokens } from "../db.js";

export async function signIn(req, res) {
  try {
    const { _id } = req.user;

    const token = uuid();
    await dbUsersTokens.insertOne({
      id: _id,
      token,
      lastStatus: Date.now(),
    });

    res.status(200).send(token);
  } catch (err) {
    console.log(err);
    return res.status(401).send(err.details.map((detail) => detail.message));
  }
}

export async function signUp(req, res) {
  try {
    const user = req.user;

    const hashPassword = bcrypt.hashSync(user.password, 10);
    await db.collection("users").insertOne({ ...user, password: hashPassword });
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.send(err.details);
  }
}

export async function updateToken(req, res) {
  try {
    const { lastStatus } = req.body;
    const token = req.token;
    await dbUsersTokens.updateOne({ token }, { $set: { lastStatus } });
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
  }
}

export async function deleteInactiveTokens() {
  try {
    const tokens = await dbUsersTokens.find().toArray();
    const filteredTokens = tokens.filter(
      (t) => Date.now() - t.lastStatus >= 10000
    );
    filteredTokens.map((t) => dbUsersTokens.deleteOne({ _id: t._id }));
  } catch (err) {
    console.log(err);
  }
}
