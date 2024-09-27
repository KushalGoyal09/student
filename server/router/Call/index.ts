import { Router } from "express";
const callRouter = Router();
import authMiddleware from "../../middleware/auth";
import getWeekRecord from "./getWeekRecord";
import saveCallStatus from "./saveCallStatus";

callRouter.post("/week-record", authMiddleware, getWeekRecord);
callRouter.post("/save-call-status", authMiddleware, saveCallStatus);

export default callRouter;
