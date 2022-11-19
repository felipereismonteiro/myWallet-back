import express from "express";
import { signIn, signUp, updateToken } from "../controllers/authControllers.js";
import { authUserSignIn, authUserSignUp, authUpdateUser } from "../middlewares/authSignMiddleware.js";

const authRoute = express.Router();

authRoute.post("/sign-in", authUserSignIn, signIn);

authRoute.post("/sign-up", authUserSignUp, signUp);

authRoute.put("/update", authUpdateUser, updateToken);

export default authRoute;
