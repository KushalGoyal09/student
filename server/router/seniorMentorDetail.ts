import { Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest, Role } from "../types";
import authMiddleware from "../middleware/auth";
import {
    throwBadRequestError,
    throwUnauthorizedError,
} from "../custom-error/customError";
import { z } from "zod";
const prisma = new PrismaClient();
const router = Router();

const bodySchema = z.object({
    seniorMentorUsername: z.coerce.string(),
})

const seniorMentorDetail = async (req: AuthRequest, res: Response) => {
    if (req.role !== Role.admin && req.role !== Role.supervisor) {
        throwUnauthorizedError("You are not authorized to get all senior mentor");
        return;
    }
    const parsedData = bodySchema.safeParse(req.body);
    if (!parsedData.success) {
        throwBadRequestError("Invalid data");
        return;
    }
    const data = await prisma.seniorMentor.findUnique({
        where: {
            username: parsedData.data.seniorMentorUsername,
        },
        select: {
            name: true,
            username: true,
            id: true,
            GroupMentor: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                },
            },
        },
    });
    if (!data) {
        throwBadRequestError("Senior Mentor not found");
        return;
    }
    res.json({
        success: true,
        data,
    });
};

router.post("/", authMiddleware, seniorMentorDetail);

export default router;
