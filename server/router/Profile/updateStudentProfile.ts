import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../../types";
import { z } from "zod";
const db = new PrismaClient();

const bodySchema = z.object({
    id: z.string(),
    name: z.coerce.string(),
    gender: z.coerce.string(),
    fatherName: z.string(),
    motherName: z.string(),
    whattsapNumber: z.string(),
    callNumber: z.string(),
    motherNumber: z.string(),
    fatherNumber: z.string(),
    language: z.string(),
    target: z.string(),
    StudyHours: z.string(),
    class: z.string(),
    dropperStatus: z.string(),
    previousScore: z.string(),
    platform: z.string(),
    whattsapGroupLink: z.string().nullable(),
});

const updateStudentProfile = async (req: AuthRequest, res: Response) => {
    const parsedData = bodySchema.safeParse(req.body);
    if (!parsedData.success) {
        console.log(parsedData.error);
        return res.status(400).json({ message: "Wrong inputs" });
    }
    await db.student.update({
        where: {
            id: parsedData.data.id,
        },
        data: parsedData.data,
    });
    res.status(200).json({
        message: "Student profile updated successfully",
    });
};

export default updateStudentProfile;
