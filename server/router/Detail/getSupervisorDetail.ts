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
    supervisorUsername: z.coerce.string(),
});

const getSupervisorDetail = async (req: AuthRequest, res: Response) => {
    if (req.role !== Role.admin) {
        throwUnauthorizedError("You are not authorized to get all supervisors");
        return;
    }
    const parsedData = bodySchema.safeParse(req.body);
    if (!parsedData.success) {
        throwBadRequestError("Invalid data");
        return;
    }
    const data = await prisma.supervisor.findUnique({
        where: {
            username: parsedData.data.supervisorUsername,
        },
        select: {
            name: true,
            username: true,
            id: true,
            SeniorMentor: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                },
            },
        },
    });
    if (!data) {
        throwBadRequestError("Supervisor not found");
        return;
    }
    res.json({
        success: true,
        data,
    });
};

export default getSupervisorDetail;
