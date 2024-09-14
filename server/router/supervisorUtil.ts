import { throwUnauthorizedError } from "../custom-error/customError";
import authMiddleware from "../middleware/auth";
import { AuthRequest, Role } from "../types";
import { Response, Router } from 'express';
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
const router = Router();

const getAllGroupMentors = (req: AuthRequest, res:Response) => {
    if(req.role !== Role.supervisor) {
        res.json({
            success: false,
            message: "You are not authorized to get all group mentors"
        })
        return;
    }
    /// impcomplete
}

const getAllSeniorMentors =async (req: AuthRequest, res:Response) => {
    if(req.role !== Role.supervisor) {
        res.json({
            success: false,
            message: "You are not authorized to get all group mentors"
        })
        return;
    }
    const userId = req.userId;
    if(!userId) {
        throwUnauthorizedError("You are not authorized")
        return;
    }
    const data = await db.seniorMentor.findMany({
        where: {
            supervisorId: userId
        },
        select: {
            id: true,
            username: true,
            name: true
        }
    });
    res.json({
        success: true,
        data: data
    })
}

router.get('/getAllGroupMentors',authMiddleware ,getAllGroupMentors)
router.get('/getAllSeniorMentors',authMiddleware ,getAllSeniorMentors)

export default router;