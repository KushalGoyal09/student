import { Router } from "express";
const utilRouter = Router();
import getAllGroupMentor from "./getAllMentor";
import getAllSupervisor from "./getAllSupervisor";
import getAllSeniorMentor from "./getAllSeniorMentor";
import authMiddleware from "../../middleware/auth";

utilRouter.use("/mentor", authMiddleware, getAllGroupMentor);
utilRouter.use("/supervisor", authMiddleware, getAllSupervisor);
utilRouter.use("/senior-mentor", authMiddleware, getAllSeniorMentor);

export default utilRouter;
