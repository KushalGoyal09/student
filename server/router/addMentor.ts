import { PrismaClient , Prisma} from "prisma/prisma-client";
const db = new PrismaClient();
import {Response,Router} from 'express'
import { AuthRequest } from "../types";
import { z } from "zod";
import { throwForbiddenError, throwInternalServerError } from "../custom-error/customError";
const router = Router()

const bodySchema = z.object({
    name: z.coerce.string(),
    username: z.coerce.string(),
    password: z.coerce.string(),
    seniorMentorId: z.coerce.string()
})


const addMentor = async (req: AuthRequest, res: Response) => {
    const parsedData = bodySchema.safeParse(req.body);
    if(parsedData.success === false) {
        throwForbiddenError("Wrong Inputs");
        return;
    }
    const {username,password,name,seniorMentorId} = parsedData.data;
    try {
        await db.groupMentor.create({
            data: {
                username,
                password,
                name,
                seniorMentorId
            }
        })
        res.json({
            success: true,
            message: `Group Mentor ${name} is added successfully`
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

router.post('/', addMentor)

export default router;