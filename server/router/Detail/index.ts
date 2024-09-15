import { Router } from "express";
const detailRouter = Router(); 
import getAllStudents from "./getAllStudents";
import getAllGroupMentor from "./getAllMentors";
import getAllSeniorMentor from "./getAllSeniorMentor";
import getAllSupervisors from "./getAllSupervisor";
import getMentorDetail from "./getMentorDetail";
import getSeniorMentorDetail from "./getSeniorMentorDetail";
import getSupervisorDetail from "./getSupervisorDetail";

detailRouter.get("/students", getAllStudents);
detailRouter.get("/mentors", getAllGroupMentor);
detailRouter.get("/senior-mentors", getAllSeniorMentor);
detailRouter.get("/supervisors", getAllSupervisors);
detailRouter.post("/mentor-detail", getMentorDetail);
detailRouter.post("/senior-mentor-detail", getSeniorMentorDetail);
detailRouter.post("/supervisor-detail", getSupervisorDetail);
