import { Router } from "express";
import authMiddleware from "../../middleware/auth";
import getOverall from "./getOverall";
const overallRouter = Router();

overallRouter.get("/", authMiddleware, getOverall);

export default overallRouter;
