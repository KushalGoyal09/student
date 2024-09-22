import { Router } from "express";
const ProfileRouter = Router();
import studentProfile from "./studentProfile";
import authMiddleware from "../../middleware/auth";
import updateStudentProfile from "./updateStudentProfile";
import changeActiveStatus from "./changeActiveStatus";

ProfileRouter.post("/student", authMiddleware, studentProfile);
ProfileRouter.post("/update/student", authMiddleware, updateStudentProfile);
ProfileRouter.post("/update/status", authMiddleware, changeActiveStatus);


export default ProfileRouter;