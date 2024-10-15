import { Router } from "express";
const detailRouter = Router();
import getAllStudents from "./getAllStudents";
import getAllGroupMentor from "./getAllMentors";
import getAllSeniorMentor from "./getAllSeniorMentor";
import getAllSupervisors from "./getAllSupervisor";
import getMentorDetail from "./getMentorDetail";
import getSeniorMentorDetail from "./getSeniorMentorDetail";
import getSupervisorDetail from "./getSupervisorDetail";
import authMiddleware from "../../middleware/auth";
import getAllEmployes from "./getAllEmployes";

detailRouter.get("/students", authMiddleware, getAllStudents);
detailRouter.get("/mentors", authMiddleware, getAllGroupMentor);
detailRouter.get("/senior-mentors", authMiddleware, getAllSeniorMentor);
detailRouter.get("/supervisors", authMiddleware, getAllSupervisors);
detailRouter.get("/employes", authMiddleware, getAllEmployes);
detailRouter.post("/mentor-detail", authMiddleware, getMentorDetail);
detailRouter.post(
    "/senior-mentor-detail",
    authMiddleware,
    getSeniorMentorDetail,
);
detailRouter.post("/supervisor-detail", authMiddleware, getSupervisorDetail);

export default detailRouter;
