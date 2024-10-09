import { Router } from "express";
import getAllTheMentors from "./getAllTheMentors";
import getAllTheSeniors from "./getAllSeniorMentors";
import getSeniorSalaryDetail from "./getSeniorSalaryDetail";
import getMentorSalaryDetail from "./getMentorSalaryDetail";
import editMentorSalaryDetail from "./editMentorSalaryDetail";
import authMiddleware from "../../middleware/auth";
const slaryRouter = Router();

slaryRouter.get("/get-mentors", authMiddleware, getAllTheMentors);
slaryRouter.get("/get-seniors", authMiddleware, getAllTheSeniors);
slaryRouter.post("/get-senior-salary", authMiddleware, getSeniorSalaryDetail);
slaryRouter.post("/get-mentor-salary", authMiddleware, getMentorSalaryDetail);
slaryRouter.post("/edit-salary", authMiddleware, editMentorSalaryDetail);

export default slaryRouter;
