import { Router } from "express";
import {
  entryPost,
  exitPost,
  getEntry,
  getExit,
} from "../controllers/dataControllers.js";
import { validateEntryPost, validateExitPost } from "../middlewares/authEntryExitMiddleware.js";
import {
  authGetEntry,
  authGetExit,
} from "../middlewares/authGetEntryExitMiddlewares.js";

const dataRoute = Router();

dataRoute.post("/entry", validateEntryPost, entryPost);

dataRoute.post("/exit", validateExitPost, exitPost);

dataRoute.get("/entry", authGetEntry, getEntry);

dataRoute.get("/exit", authGetExit, getExit);

export default dataRoute;
