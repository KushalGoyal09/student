import { Router } from "express";
const ProfileRouter = Router();
import studentProfile from "./studentProfile";
import authMiddleware from "../../middleware/auth";
import updateStudentProfile from "./updateStudentProfile";

ProfileRouter.post("/student", authMiddleware, studentProfile);
ProfileRouter.post("/update/student", authMiddleware, updateStudentProfile);


export default ProfileRouter;