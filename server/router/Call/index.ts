import { Router } from "express";
const callRouter = Router();
import authMiddleware from "../../middleware/auth";
import getWeekRecord from "./getWeekRecord";
import saveCallStatus from "./saveCallStatus";
import getStudentCallRecord from "./getStudentCallRecord";

callRouter.post("/week-record", authMiddleware, getWeekRecord);
callRouter.post("/save-call-status", authMiddleware, saveCallStatus);
callRouter.post("/student", authMiddleware, getStudentCallRecord);

export default callRouter;
