import { Router } from "express";
const LoginRouter = Router();
import adminLogin from "./adminLogin";
import supervisorLogin from "./supervisorLogin";
import seniorMentorLogin from "./seniorMentorLogin";
import mentorLogin from "./mentorLogin";

LoginRouter.post("/admin", adminLogin);
LoginRouter.post("/supervisor", supervisorLogin);
LoginRouter.post("/senior-mentor", seniorMentorLogin);
LoginRouter.post("/mentor", mentorLogin);

export default LoginRouter;
