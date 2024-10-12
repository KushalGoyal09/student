import { Router } from "express";
import getTargets from "./getTarget";
import markComplete from "./markComplete";
import authMiddleware from "../../middleware/auth";
import setTarget from "./setTarget";
import getUncompletedTarget from "./getUncompletedTarget";
import deleteTarget from "./deleteTarget";
const targetRouter = Router();

targetRouter.post("/setTarget", authMiddleware, setTarget);
targetRouter.post("/get", authMiddleware, getTargets);
targetRouter.post("/get-incomplete", authMiddleware, getUncompletedTarget);
targetRouter.post("/delete", authMiddleware, deleteTarget);
targetRouter.post("/complete", authMiddleware, markComplete);

export default targetRouter;
