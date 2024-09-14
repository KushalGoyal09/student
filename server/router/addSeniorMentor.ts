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
    supervisorId: z.coerce.string()
})


const addSenior = async (req: AuthRequest, res: Response) => {
    const parsedData = bodySchema.safeParse(req.body);
    if(parsedData.success === false) {
        throwForbiddenError("Wrong Inputs");
        return;
    }
    const {username,password,name,supervisorId} = parsedData.data;
    try {
        await db.seniorMentor.create({
            data: {
                username,
                password,
                name,
                supervisorId
            }
        })
        res.json({
            success: true,
            message: `Senior Mentor ${name} is added successfully`
        })
    } catch (error) {
        if(error instanceof Prisma.PrismaClientKnownRequestError) {
            if(error.code === 'P2002') {
                throwForbiddenError("Username should be unique");
                return;
            }
        }
        console.log(error);
        throwInternalServerError("Somthing is Wrong");
        return;
    }
}

router.post('/', addSenior)

export default router;