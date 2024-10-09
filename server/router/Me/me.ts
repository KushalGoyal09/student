import { Response, Router } from "express";
import { AuthRequest, Role } from "../../types";
import authMiddleware from "../../middleware/auth";
import { throwUnauthorizedError } from "../../custom-error/customError";
import { PrismaClient } from "prisma/prisma-client";
const db = new PrismaClient();
const meRouter = Router();

const getRole = async (req: AuthRequest, res: Response) => {
    const role = req.role;
    const userId = req.userId;
    if (!role || !userId) {
        throwUnauthorizedError("You are not authorized to get role");
        return;
    }
    let name = "User";
    if (role === Role.admin) {
        name = "Admin";
    } else if (role === Role.supervisor) {
        const supervisor = await db.supervisor.findUnique({
            where: {
                id: userId,
            },
            select: {
                name: true,
            },
        });
        if (!supervisor) {
            throwUnauthorizedError("You are not authorized to get role");
            return;
        }
        name = supervisor.name;
    } else if (role === Role.seniorMentor) {
        const seniorMentor = await db.seniorMentor.findUnique({
            where: {
                id: userId,
            },
            select: {
                name: true,
            },
        });
        if (!seniorMentor) {
            throwUnauthorizedError("You are not authorized to get role");
            return;
        }
        name = seniorMentor.name;
    } else if (role === Role.groupMentor) {
        const groupMentor = await db.groupMentor.findUnique({
            where: {
                id: userId,
            },
            select: {
                name: true,
            },
        });
        if (!groupMentor) {
            throwUnauthorizedError("You are not authorized to get role");
            return;
        }
        name = groupMentor.name;
    }
    res.json({
        success: true,
        role,
        name,
    });
};

meRouter.get("/", authMiddleware, getRole);

export default meRouter;
