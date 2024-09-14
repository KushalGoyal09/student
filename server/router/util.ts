import { PrismaClient } from "prisma/prisma-client";
const db = new PrismaClient();
import { Response, Router } from "express";
import { AuthRequest, Role } from "../types";
import authMiddleware from "../middleware/auth";

const router = Router();

const getAllSupervisor = (req: AuthRequest, res: Response) => {
    if (req.role !== Role.admin) {
        res.json({
            success: false,
            message: "You are not authorized to get all supervisors",
        });
        return;
    }
    db.supervisor
        .findMany({
            select: {
                id: true,
                name: true,
                username: true,
            },
            orderBy: {
                name: "asc",
            }
        })
        .then((data) => {
            res.json({
                success: true,
                data,
            });
        })
        .catch((error) => {
            res.json({
                success: false,
                message: "Something went wrong",
            });
        });
};

const getAllSeniorMentor = (req: AuthRequest, res: Response) => {
    if (req.role !== Role.admin) {
        res.json({
            success: false,
            message: "You are not authorized to get all supervisors",
        });
        return;
    }
    db.seniorMentor
        .findMany({
            select: {
                id: true,
                name: true,
                username: true,
            },
            orderBy: {
                name: "asc",
            },
        })
        .then((data) => {
            res.json({
                success: true,
                data,
            });
        })
        .catch((error) => {
            res.json({
                success: false,
                message: "Something went wrong",
            });
        });
};

const getAllGroupMentor = (req: AuthRequest, res: Response) => {
    if (req.role !== Role.admin) {
        res.json({
            success: false,
            message: "You are not authorized to get all supervisors",
        });
        return;
    }
    db.groupMentor
        .findMany({
            select: {
                id: true,
                name: true,
                username: true,
            },
            orderBy: {
                name: "asc",
            },
        })
        .then((data) => {
            res.json({
                success: true,
                data,
            });
        })
        .catch((error) => {
            res.json({
                success: false,
                message: "Something went wrong",
            });
        });
};

const createAdmin = async (req: AuthRequest, res: Response) => {
    await db.admin.create({
        data: {
            password: "admin",
        },
    });
    res.json({
        success: true,
    });
};

router.get("/getSupervisor", authMiddleware, getAllSupervisor);
router.get("/getSeniorMentor", authMiddleware, getAllSeniorMentor);
router.get("/getGroupMentor", authMiddleware, getAllGroupMentor);
router.get("/createAdmin", createAdmin);

export default router;
