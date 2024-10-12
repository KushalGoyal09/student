import { Router } from "express";
import setVision from "./setVision";
import getVision from "./getVision";
import authMiddleware from "../../middleware/auth";
const visionBoardRouter = Router();

visionBoardRouter.post("/set",authMiddleware ,setVision);
visionBoardRouter.post("/get",authMiddleware ,getVision);

export default visionBoardRouter;