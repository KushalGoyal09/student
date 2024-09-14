import { PrismaClient } from "prisma/prisma-client";
import { Response, Router } from "express";
import { AuthRequest } from "../types";
import authMiddleware from "../middleware/auth";
const db = new PrismaClient();
const router = Router();

const getRole = (req: AuthRequest, res: Response) => {
    const {role, userId} = req;
    res.json({
        success: true,
        role,
    })
};

router.get("/", authMiddleware, getRole);

export default router;
