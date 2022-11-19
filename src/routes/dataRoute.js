import express from "express";
import { entrySchema, exitSchema } from "../models/dataSchemas.js";
import {
    entryPost,
    exitPost,
    getEntry,
    getExit,
  } from "../controllers/dataControllers.js";

const dataRoute = express.Router();

dataRoute.post("/entry", entryPost);

dataRoute.post("/exit", exitPost);

dataRoute.get("/entry", getEntry);

dataRoute.get("/exit", getExit);

export default dataRoute;