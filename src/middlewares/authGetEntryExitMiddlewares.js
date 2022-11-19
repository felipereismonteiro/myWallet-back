import {dbUsersTokens, dbUsers} from "../db.js"

export async function authGetEntry(req, res, next) {
    console.log(req.headers)
    try {
        const token = req.headers.authorization.replace("Bearer ", "");

        const tokenFounded = await dbUsersTokens.findOne({ token });
    
        if (!tokenFounded) {
          return res.sendStatus(404);
        }
    
        const { name } = await dbUsers.findOne({ _id: tokenFounded.id });
    
        req.name = name;
        next();
    } catch(err) {
        console.log(err);
        res.sendStatus(401);
    }
}

export async function authGetExit(req, res, next) {
    try {
        const token = req.headers.authorization.replace("Bearer ", "");
        const tokenFounded = await dbUsersTokens.findOne({ token });
    
        if (!tokenFounded) {
          return res.sendStatus(404);
        }
    
        const { name } = await dbUsers.findOne({ _id: tokenFounded.id });
        
        req.name = name;
        next();
    } catch(err) {
        console.log(err);
        res.sendStatus(401);
    }
}