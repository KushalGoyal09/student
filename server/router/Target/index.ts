import { Router } from "express";
import addTarget from "./addTarget";
import getTargets from "./getTarget";
import toggleTarget from "./changeTarget";
import authMiddleware from "../../middleware/auth";
const targetRouter = Router();

targetRouter.post("/create", authMiddleware, addTarget);
targetRouter.get("/get", authMiddleware, getTargets);
targetRouter.post("/toggle", authMiddleware, toggleTarget);

export default targetRouter;
