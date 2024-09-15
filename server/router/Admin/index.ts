import { Router } from "express";
const adminRouter = Router();
import createAdmin from "./createAdmin";
import changePassword from "./changePassword";
import authMiddleware from "../../middleware/auth";
import getMentorDetail from "./getMentorDetail";
import getSeniorMentorDetail from "./getSeniorMentorDetail";
import getSupervisorDetail from "./getSupervisorDetail";


adminRouter.get("/create", createAdmin);
adminRouter.post("/change-password", authMiddleware, changePassword);
adminRouter.post("/get-mentor-detail", authMiddleware, getMentorDetail);
adminRouter.post("/get-senior-mentor-detail", authMiddleware, getSeniorMentorDetail);
adminRouter.post("/get-supervisor-detail", authMiddleware, getSupervisorDetail);


export default adminRouter;
