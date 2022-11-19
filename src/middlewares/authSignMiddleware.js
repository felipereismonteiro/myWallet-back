import { signInSchema, signUpSchema } from "../models/authSchemas.js";
import { dbUsers, dbUsersTokens } from "../db.js";
import bcrypt from "bcrypt";

export async function authUserSignIn(req, res, next) {
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

    req.user = founded;

    next();
  } catch (err) {
    console.log(err);
    res.sendStatus(401);
  }
}

export async function authUserSignUp(req, res, next) {
  const user = req.body;

  try {
    const validate = await signUpSchema.validateAsync(user, {
      abortEarly: false,
    });

    const userFounded = await dbUsers.findOne({
      $or: [{ name: user.name }, { email: user.email }],
    });

    if (userFounded) {
      return res.status(401).send("Usuario ja cadastrado!");
    } else if (validate.password.length === 0) {
      return res.status(400).send("Password is needed!!!");
    }

    req.user = user;

    next();
  } catch (err) {
    console.log(err);
    res.sendStatus(401);
  }
}

export async function authUpdateUser(req, res, next) {
  try {
    const { authorization } = req.headers;
    const token = authorization.replace("Bearer ", "");
    const founded = await dbUsersTokens.findOne({ token });

    if (!founded) {
      return res.sendStatus(401);
    }

    req.token = founded;

    next();
  } catch (err) {
    console.log(err);
    res.sendStatus(404);
  }
}
