import { Router } from "express";
const addRouter = Router();
import addStudent from "./addStudent";
import addSupervisor from "./addSupervisor";
import addSeniorMentor from "./addSeniorMentor";
import addMentor from "./addMentor";
import authMiddleware from "../../middleware/auth";
import addEmployee from "./addEmployee";

addRouter.post("/student", authMiddleware, addStudent);
addRouter.post("/supervisor", authMiddleware, addSupervisor);
addRouter.post("/senior-mentor", authMiddleware, addSeniorMentor);
addRouter.post("/mentor", authMiddleware, addMentor);
addRouter.post("/employee", authMiddleware, addEmployee);

export default addRouter;
