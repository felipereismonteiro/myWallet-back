import express from "express";
import cors from "cors";
import { deleteInactiveTokens } from "./controllers/authControllers.js";
import authRoute from "./routes/authRoute.js";
import dataRoute from "./routes/dataRoute.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use(authRoute);
app.use(dataRoute);

setInterval(deleteInactiveTokens, 10000);

app.listen(5000, () => console.log("Server on port:5000"));
