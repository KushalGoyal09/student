import { PrismaClient , Prisma} from "prisma/prisma-client";
const db = new PrismaClient();
import {Response,Router} from 'express'
import { AuthRequest } from "../types";
import { z } from "zod";
import { throwForbiddenError, throwInternalServerError } from "../custom-error/customError";
const router = Router();

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
    StudyHours: z.coerce.number().int(),
    class: z.string(),
    dropperStatus: z.string(),
    previousScore: z.string(),
    platform: z.string(),
    expectation: z.string(),
})


const addStudent = async (req: AuthRequest, res: Response) => {
    const parsedData = bodySchema.safeParse(req.body);
    if(parsedData.success === false) {
        throwForbiddenError("Wrong Inputs");
        return;
    }
    try {
        await db.student.create({
            data: parsedData.data
        })
        res.json({
            success: true,
            message: `Student ${parsedData.data.name} is added successfully`
        })
    } catch (error) {
        if(error instanceof Prisma.PrismaClientKnownRequestError) {
            if(error.code === 'P2002') {
                throwForbiddenError("Username should be unique");
                return;
            }
        }
        throwInternalServerError("Somthing is Wrong");
        return;
    }
}

router.post('/', addStudent)

export default router;

