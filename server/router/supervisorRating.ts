import { Response, Router} from 'express';
import { PrismaClient } from '@prisma/client';
const router = Router();
const db = new PrismaClient();
import { z } from "zod";
import authMiddleware from '../middleware/auth';
import { AuthRequest, Role } from '../types';
import { throwUnauthorizedError } from '../custom-error/customError';

const bodySchema = z.object({
    groupMentorId: z.coerce.string(),
    status           :z.coerce.number().int(),
    meeting          : z.coerce.number().int(),
    calling          : z.coerce.number().int(),
    responsibility   : z.coerce.number().int(),
    availability     : z.coerce.number().int(),
    targetAssaigning : z.coerce.number().int(),
    targetChecking   : z.coerce.number().int(),
})

const supervisorRating = async (req: AuthRequest, res: Response) => {
    if(req.role !== Role.supervisor) {
        throwUnauthorizedError("You are not allowed to do this operation")
            return;
    }
    const userId = req.userId;
    if(!userId) {
        throwUnauthorizedError("You are not allowed to do this operation")
        return;
    }

    const parsedData = bodySchema.safeParse(req.body);
    if(parsedData.success === false) {
        res.json({
            success: false,
            message: "Wrong Inputs"
        })
        return;
    }
    
    
    await db.ratingBySupervisor.create({
        data: {
            ...parsedData.data,
            supervisorId: userId
        }
    })
    res.json({
        success: true,
        message: "Rating is added successfully"
    })
}

router.post('/', authMiddleware ,supervisorRating)

export default router;