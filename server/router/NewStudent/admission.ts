import { Request, Response } from "express";
import { PrismaClient } from "prisma/prisma-client";
import { z } from "zod";
const db = new PrismaClient();

const bodySchema = z.object({
    name: z.coerce.string(),
    gender: z.coerce.string(),
    fatherName: z.coerce.string(),
    motherName: z.coerce.string(),
    whattsapNumber: z.coerce.string(),
    callNumber: z.coerce.string(),
    motherNumber: z.coerce.string(),
    fatherNumber: z.coerce.string(),
    language: z.coerce.string(),
    target: z.coerce.string(),
    StudyHours: z.coerce.number(),
    class: z.coerce.string(),
    dropperStatus: z.coerce.string(),
    previousScore: z.coerce.string(),
    platform: z.coerce.string(),
    expectation: z.coerce.string(),
});

const admissionForm = async (req: Request, res: Response) => {
    const parsedData = bodySchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({ error: parsedData.error });
    }
    await db.student.create({
        data: parsedData.data,
    });
    return res.status(200).json({ message: "Student added successfully" });
};

export default admissionForm;
