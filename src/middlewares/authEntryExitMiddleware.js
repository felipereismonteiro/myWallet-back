import { entrySchema, exitSchema } from "../models/dataSchemas.js";
import dayjs from "dayjs";
import { db, dbUsers, dbUsersTokens } from "../db.js";

export async function validateEntryPost(req, res, next) {
  console.log(req.body)

  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    const { value, description } = req.body;

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
  
    req.user = validate;

    next();

} catch (err) {
    console.log(err);
    res.sendStatus(401);
  }
}

export async function validateExitPost(req, res, next) {
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
        req.user = validate;
        next();
    } catch(err) {
        console.log(err);
        res.sendStatus(401);
    }
}
