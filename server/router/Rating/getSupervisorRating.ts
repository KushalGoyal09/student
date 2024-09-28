import { Response } from "express";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
import { z } from "zod";
import { AuthRequest, Role } from "../../types";
import {
    throwBadRequestError,
    throwUnauthorizedError,
} from "../../custom-error/customError";

const bodySchema = z.object({
    groupMentorId: z.string(),
});

const getSupervisorRating = async (req: AuthRequest, res: Response) => {
    const supervisorId = req.userId;
    if (req.role !== Role.supervisor || !supervisorId) {
        throwUnauthorizedError("You are not allowed to do this operation");
        return;
    }
    const { groupMentorId } = bodySchema.parse(req.body);
    const data = await db.ratingBySupervisor.findUnique({
        where: {
            supervisorId_groupMentorId: {
                groupMentorId,
                supervisorId,
            },
        },
        select: {
            status: true,
            meeting: true,
            calling: true,
            responsibility: true,
            availability: true,
            targetAssaigning: true,
            targetChecking: true,
        },
    });
    res.status(200).json({
        success: true,
        data,
    });
};

export default getSupervisorRating;
