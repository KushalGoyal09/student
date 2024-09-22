import { z } from "zod";
import { AuthRequest, Role } from "../../types";
import { Response } from "express";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

const bodySchema = z.object({
    studentId: z.coerce.string(),
    mentorId: z.coerce.string(),
});

const assaignMentor = async (req: AuthRequest, res: Response) => {
    const role = req.role;
    if (role !== Role.admin) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const parsedData = bodySchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({ error: parsedData.error });
    }
    console.log(parsedData.data);
    try {
        await db.student.update({
            where: {
                id: parsedData.data.studentId,
            },
            data: {
                groupMentorId: parsedData.data.mentorId,
            },
        });
    } catch (error) {
        console.log(error);
        return;
    }

    return res.status(200).json({
        success: true,
        message: "Mentor assigned successfully",
    });
};

export default assaignMentor;
