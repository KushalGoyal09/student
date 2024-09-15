import { Router } from "express";
const adminRouter = Router();
import createAdmin from "./createAdmin";
import changePassword from "./changePassword";
import authMiddleware from "../../middleware/auth";

adminRouter.get("/create", createAdmin);
adminRouter.post("/change-password", authMiddleware, changePassword);

export default adminRouter;
