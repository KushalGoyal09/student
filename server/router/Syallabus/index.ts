import { Router } from "express";
import { addPhysics, deletePhysics } from "./addPhysics";
import { addBiology, deleteBiology } from "./addBiology";
import { addChemistry, deleteChemistry } from "./addChemistry";
import authMiddleware from "../../middleware/auth";
import getAllSyallabus from "./getSyallabus";
const syallabusRouter = Router();

syallabusRouter.post("/addPhysics", authMiddleware, addPhysics);
syallabusRouter.post("/deletePhysics", authMiddleware, deletePhysics);
syallabusRouter.post("/addBiology", authMiddleware, addBiology);
syallabusRouter.post("/deleteBiology", authMiddleware, deleteBiology);
syallabusRouter.post("/addChemistry", authMiddleware, addChemistry);
syallabusRouter.post("/deleteChemistry", authMiddleware, deleteChemistry);
syallabusRouter.get("/getAll", getAllSyallabus);

export default syallabusRouter;
