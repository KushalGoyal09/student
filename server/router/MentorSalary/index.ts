import { Router } from "express";
import getAllTheMentors from "./getAllTheMentors";
import getAllTheSeniors from "./getAllSeniorMentors";
import getMentorSalaryDetail from "./getMentorSalaryDetail";
import editMentorSalaryDetail from "./editMentorSalaryDetail";
import authMiddleware from "../../middleware/auth";
import getAllEmployes from "./getAllTheEmployee";
import getCommonPay from "./getCommonPay";
import setCommonPay from "./setCommonPay";
const slaryRouter = Router();

slaryRouter.get("/get-mentors", authMiddleware, getAllTheMentors);
slaryRouter.get("/get-seniors", authMiddleware, getAllTheSeniors);
slaryRouter.get("/get-employes", authMiddleware, getAllEmployes);
slaryRouter.post("/get-common", authMiddleware, getCommonPay);
slaryRouter.post("/set-common", authMiddleware, setCommonPay);
slaryRouter.post("/get-salary", authMiddleware, getMentorSalaryDetail);
slaryRouter.post("/edit-salary", authMiddleware, editMentorSalaryDetail);

export default slaryRouter;
