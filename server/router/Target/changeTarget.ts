import { PrismaClient } from "prisma/prisma-client";
import { Response } from "express";
import { AuthRequest, Role } from "../../types";
import {
    throwNotFoundError,
    throwUnauthorizedError,
} from "../../custom-error/customError";
import { z } from "zod";
const db = new PrismaClient();

const bodySchema = z.object({
    targetId: z.string(),
});

const toggleTarget = async (req: AuthRequest, res: Response) => {
    const role = req.role;
    const userId = req.userId;
    if (role !== Role.groupMentor || !userId) {
        throwUnauthorizedError("You are not authorized to toggle target");
        return;
    }
    const { targetId } = bodySchema.parse(req.body);
    const target = await db.target.findFirst({
        where: {
            id: targetId,
        },
    });
    if (!target) {
        throwNotFoundError("Target not found");
        return;
    }
    await db.target.update({
        where: {
            id: targetId,
        },
        data: {
            completed: !target.completed,
        },
    });
    res.json({
        success: true,
        message: "Target updated successfully",
    });
};

export default toggleTarget;
