import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
import { z } from "zod";

const bodySchema = z.object({
    email: z.coerce.string(),
    phoneNumber: z.coerce.string(),
    bonding: z.coerce.number().int(),
    targetAssaigningAndChecking: z.coerce.number().int(),
    calling: z.coerce.number().int(),
    seriousness: z.coerce.number().int(),
    exceptation: z.string(),
});

const studentRating = async (req: Request, res: Response) => {
    const parsedData = bodySchema.safeParse(req.body);
    if (parsedData.success === false) {
        res.json({
            success: false,
            message: "Wrong Inputs",
        });
        return;
    }
    const {
        bonding,
        targetAssaigningAndChecking,
        calling,
        seriousness,
        exceptation,
        phoneNumber,
    } = parsedData.data;
    const student = await db.student.findUnique({
        where: {
            whattsapNumber: phoneNumber,
        },
        select: {
            id: true,
            groupMentorId: true,
        },
    });
    if (student === null) {
        res.json({
            success: false,
            message: "Student is not found",
        });
        return;
    }
    if (student.groupMentorId === null) {
        res.json({
            success: false,
            message: "Student is not assigned to any mentor",
        });
        return;
    }
    await db.ratingByStudent.upsert({
        where: {
            studentId_groupMentorId: {
                studentId: student.id,
                groupMentorId: student.groupMentorId,
            },
        },
        create: {
            bonding,
            targetAssaigningAndChecking,
            calling,
            seriousness,
            exceptation,
            studentId: student.id,
            groupMentorId: student.groupMentorId,
        },
        update: {
            bonding,
            targetAssaigningAndChecking,
            calling,
            seriousness,
            exceptation,
        },
    });
    res.json({
        success: true,
        message: "Rating is added successfully",
    });
};

export default studentRating;
