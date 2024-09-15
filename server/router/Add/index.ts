import { Router } from "express";
const AddRouter = Router();
import addStudent from "./addStudent";
import addSupervisor from "./addSupervisor";
import addSeniorMentor from "./addSeniorMentor";
import addMentor from "./addMentor";
import authMiddleware from "../../middleware/auth";

AddRouter.use("/student", authMiddleware, addStudent);
AddRouter.use("/supervisor", authMiddleware, addSupervisor);
AddRouter.use("/senior-mentor", authMiddleware, addSeniorMentor);
AddRouter.use("/mentor", authMiddleware, addMentor);

export default AddRouter;
