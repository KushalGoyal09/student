import { Router } from "express";
import getTargets from "./getTarget";
import markComplete from "./markComplete";
import authMiddleware from "../../middleware/auth";
import setTarget from "./setTarget";
import getUncompletedTarget from "./getUncompletedTarget";
import deleteTarget from "./deleteTarget";
import getLecturesDone from "./getLecturesDone";
const targetRouter = Router();

targetRouter.post("/setTarget", authMiddleware, setTarget);
targetRouter.post("/get", authMiddleware, getTargets);
targetRouter.post("/get-incomplete", authMiddleware, getUncompletedTarget);
targetRouter.post("/delete", authMiddleware, deleteTarget);
targetRouter.post("/complete", authMiddleware, markComplete);
targetRouter.post("/getLecturesDone", authMiddleware, getLecturesDone);

export default targetRouter;
