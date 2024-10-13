import { Router } from "express";
import authMiddleware from "../../middleware/auth";
import getAllSyallabus from "./getSyallabus";
import addChapter from "./addChapter";
import deleteChapter from "./deleteChapter";
const syallabusRouter = Router();

syallabusRouter.post("/add", authMiddleware, addChapter);
syallabusRouter.post("/delete", authMiddleware, deleteChapter);
syallabusRouter.get("/getAll", getAllSyallabus);

export default syallabusRouter;
