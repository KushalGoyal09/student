import { Router } from "express";
import authMiddleware from "../../middleware/auth";
import getWeekRecord from "./getWeekData";
import saveCallStatus from "./saveCallStatus";
import getAllMentors from "./getAllMentors";
const seniorCallRouter = Router();

seniorCallRouter.get("/get-mentors", authMiddleware, getAllMentors);
seniorCallRouter.post("/get", authMiddleware, getWeekRecord);
seniorCallRouter.post("/save", authMiddleware, saveCallStatus);

export default seniorCallRouter;
