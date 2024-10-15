import { PrismaClient, Prisma } from "prisma/prisma-client";
const db = new PrismaClient();
import { Response } from "express";
import { AuthRequest, Role } from "../../types";
import { z } from "zod";
import { throwForbiddenError } from "../../custom-error/customError";

const bodySchema = z.object({
    name: z.string(),
    gender: z.string(),
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
    expectation: z.string(),
    email: z.string(),
    completeAddress: z.string(),
    landmark: z.string(),
    city: z.string(),
    state: z.string(),
    pincode: z.string(),
    country: z.string(),
});

const addStudent = async (req: AuthRequest, res: Response) => {
    if (req.role !== Role.admin) {
        throwForbiddenError("You are not authorized to add a mentor");
        return;
    }
    const parsedData = bodySchema.safeParse(req.body);
    if (parsedData.success === false) {
        throwForbiddenError("Wrong Inputs");
        return;
    }
    console.log(parsedData.data);
    await db.student.create({
        data: parsedData.data,
    });
    res.json({
        success: true,
        message: `Student ${parsedData.data.name} is added successfully`,
    });
};

export default addStudent;
