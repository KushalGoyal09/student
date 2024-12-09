import { PrismaClient } from "prisma/prisma-client";
const db = new PrismaClient();
import { Response } from "express";
import { AuthRequest, Role } from "../../types";
import { z } from "zod";

const bodySchema = z.object({
    seniorMentorId: z.coerce.string(),
});

const getAllGroupMentor = async (req: AuthRequest, res: Response) => {
    const { seniorMentorId } = bodySchema.parse(req.body);
    const data = await db.groupMentor.findMany({
        where: {
            seniorMentorId: seniorMentorId,
        },
        select: {
            id: true,
            name: true,
            username: true,
        },
        orderBy: {
            name: "asc",
        },
    });
    res.json({
        data,
        success: true,
    });
};

export default getAllGroupMentor;
