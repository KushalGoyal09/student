import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest, Role } from "../../types";
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
    StudyHours: z.coerce.number(),
    class: z.string(),
    dropperStatus: z.string(),
    previousScore: z.string(),
    platform: z.string(),
});

const updateStudentProfile = async (req: AuthRequest, res: Response) => {
    const role = req.role;
    if (role !== Role.admin) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const parsedData = bodySchema.safeParse(req.body);
    if (!parsedData.success) {
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
