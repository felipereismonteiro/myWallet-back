import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";
import { dbUsers, dbUsersTokens, signInSchema, signUpSchema} from "../index.js"

export async function signIn (req, res){
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
}

export async function signUp (req, res){
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
}

export async function updateToken(req, res){
    const {lastStatus} = req.body;
    const {authorization} = req.headers;
    const token = authorization.replace("Bearer ", "")
    const founded = await dbUsersTokens.findOne({token})
  
    if(!founded) {
      return res.sendStatus(401);
    }
  
    try {
      await dbUsersTokens.updateOne({token}, {$set: {lastStatus}})
      res.sendStatus(200);
    } catch(err) {
      console.log(err);
    }
}

export async function deleteInactiveTokens (){
    const tokens = await dbUsersTokens.find().toArray();
    const filteredTokens = tokens.filter(t => Date.now() - t.lastStatus >= 10000);
  
    try { 
      filteredTokens.map(t => dbUsersTokens.deleteOne({_id: t._id}))
    } catch(err) {
      console.log(err);
    }
  
}