import { Router } from "express";
import {
  entryPost,
  exitPost,
  getEntry,
  getExit,
} from "../controllers/dataControllers.js";
import {
  authGetEntry,
  authGetExit,
} from "../middlewares/authGetEntryExitMiddlewares.js";

const dataRoute = Router();

dataRoute.post("/entry", entryPost);

dataRoute.post("/exit", exitPost);

dataRoute.get("/entry", authGetEntry, getEntry);

dataRoute.get("/exit", authGetExit, getExit);

export default dataRoute;
