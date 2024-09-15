import { Router } from "express";
const addRouter = Router();
import addStudent from "./addStudent";
import addSupervisor from "./addSupervisor";
import addSeniorMentor from "./addSeniorMentor";
import addMentor from "./addMentor";
import authMiddleware from "../../middleware/auth";

addRouter.post("/student", authMiddleware, addStudent);
addRouter.post("/supervisor", authMiddleware, addSupervisor);
addRouter.post("/senior-mentor", authMiddleware, addSeniorMentor);
addRouter.post("/mentor", authMiddleware, addMentor);

export default addRouter;
