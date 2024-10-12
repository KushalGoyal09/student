import { PrismaClient } from "prisma/prisma-client";
import { Response } from "express";
import { AuthRequest } from "../../types";
import { z } from "zod";

const db = new PrismaClient();

const bodySchema = z.object({
    studentId: z.string(),
});

const getUncompletedTarget = async (req: AuthRequest, res: Response) => {
    const { studentId } = bodySchema.parse(req.body);
    const data = await db.target.findMany({
        where: {
            studentId,
        completed: false,
        },
        select: {
            id: true,
            date: true,
            targetType: true,
            completed: true,
            physics: true,
            chemistry: true,
            biology: true,
        }
    })
    res.json({
        data,
        message: "Targets fetched successfully",
    success: true,
    });
};

export default getUncompletedTarget;
