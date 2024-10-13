import { z } from "zod";
import { AuthRequest, Role } from "../../types";
import { Response } from "express";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

const bodySchema = z.object({
    studentId: z.string(),
    mentorId: z.string(),
    whattsapGroupLink: z.string(),
});

const assaignMentor = async (req: AuthRequest, res: Response) => {
    const role = req.role;
    const userId = req.userId;
    if (role !== Role.admin && role !== Role.supervisor) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    if (role === Role.supervisor) {
        const supervisor = await db.supervisor.findUnique({
            where: {
                id: userId,
            },
            select: {
                AssaignMentor: true,
            },
        });
        if (!supervisor || supervisor.AssaignMentor === false) {
            return res.status(401).json({ error: "Unauthorized" });
        }
    }
    const parsedData = bodySchema.parse(req.body);
    await db.student.update({
        where: {
            id: parsedData.studentId,
        },
        data: {
            groupMentorId: parsedData.mentorId,
            whattsapGroupLink: parsedData.whattsapGroupLink,
        },
    });
    return res.status(200).json({
        success: true,
        message: "Mentor assigned successfully",
    });
};

export default assaignMentor;
