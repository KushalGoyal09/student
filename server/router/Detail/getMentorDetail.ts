import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest, Role } from "../../types";
import {
    throwBadRequestError,
    throwUnauthorizedError,
} from "../../custom-error/customError";
import { z } from "zod";
const prisma = new PrismaClient();

const bodySchema = z.object({
    groupMentorUsername: z.coerce.string(),
});

const getMentorDetail = async (req: AuthRequest, res: Response) => {
    if (
        req.role !== Role.admin &&
        req.role !== Role.supervisor &&
        req.role !== Role.seniorMentor
    ) {
        throwUnauthorizedError("You are not authorized to get all students");
        return;
    }
    const parsedData = bodySchema.safeParse(req.body);
    if (!parsedData.success) {
        throwBadRequestError("Invalid data");
        return;
    }
    const data = await prisma.groupMentor.findUnique({
        where: {
            username: parsedData.data.groupMentorUsername,
        },
        select: {
            name: true,
            username: true,
            id: true,
            Student: {
                select: {
                    id: true,
                    name: true,
                    whattsapNumber: true,
                    fatherNumber: true,
                    motherNumber: true,
                    platform: true,
                    previousScore: true,
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

export default getMentorDetail;
