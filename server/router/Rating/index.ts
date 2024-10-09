import { Router } from "express";
import supervisorRating from "./supervisorRating";
import studentRating from "./studentRating";
import authMiddleware from "../../middleware/auth";
import getSupervisorRating from "./getSupervisorRating";
import getMentorFeedbacks from "./getMentorFeedbacks";
const ratingRouter = Router();

ratingRouter.post("/supervisor", authMiddleware, supervisorRating);
ratingRouter.post("/student", studentRating);
ratingRouter.post("/get", authMiddleware, getSupervisorRating);
ratingRouter.get("/mentor", authMiddleware, getMentorFeedbacks);

export default ratingRouter;
