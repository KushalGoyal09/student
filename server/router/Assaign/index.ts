import { Router } from "express";
import getAllSeniorMentor from "./getAllSeniorMentors";
import authMiddleware from "../../middleware/auth";
import getAllGroupMentor from "./getMentors";
const assignRouter = Router();

assignRouter.get("/seniorMentors", authMiddleware, getAllSeniorMentor);
assignRouter.post("/groupMentors", authMiddleware, getAllGroupMentor);

export default assignRouter;
