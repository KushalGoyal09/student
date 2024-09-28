import { Router } from "express";
import supervisorRating from "./supervisorRating";
import studentRating from "./studentRating";
import authMiddleware from "../../middleware/auth";
import getSupervisorRating from "./getSupervisorRating";
const ratingRouter = Router();

ratingRouter.post("/supervisor", authMiddleware, supervisorRating);
ratingRouter.post("/student", studentRating);
ratingRouter.post("/get", authMiddleware, getSupervisorRating);

export default ratingRouter;
