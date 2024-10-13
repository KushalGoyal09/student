import { Router } from "express";
import getPermissions from "./getPermissions";
import authMiddleware from "../../middleware/auth";
import setPermission from "./setPermission";
import getAllSuperVisor from "./getAllSuperVisor";
import getMyPermission from "./getMyPermission";
const roleRouter = Router();

roleRouter.post("/get", authMiddleware, getPermissions);
roleRouter.get("/get", authMiddleware, getMyPermission);
roleRouter.post("/set", authMiddleware, setPermission);
roleRouter.get("/get-super", authMiddleware, getAllSuperVisor);

export default roleRouter;
