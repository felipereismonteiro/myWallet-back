import dayjs from "dayjs";
import { db, dbUsers, dbUsersTokens} from "../index.js"

export async function entryPost(req, res) {
    const token = req.headers.authorization.replace("Bearer ", "");
    const { value, description } = req.body;

    try {
        const foundedToken = await dbUsersTokens.findOne({token})
        const { name, email } = await dbUsers.findOne({_id: foundedToken.id});

        if (!foundedToken || !email) {
            return res.sendStatus(404);
        }

        const entry = {
            name, 
            value, 
            description,
            day: dayjs().format("DD/MM/YYYY")
        }

        await db.collection("userEntries").insertOne(entry)
        res.sendStatus(200);
    } catch(err) {
        console.log(err);
        res.sendStatus(401);
    }
}