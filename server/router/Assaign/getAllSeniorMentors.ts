import { PrismaClient } from "prisma/prisma-client";
const db = new PrismaClient();
import { Response } from "express";
import { AuthRequest, Role } from "../../types";
import { throwUnauthorizedError } from "../../custom-error/customError";
import calculateSeniorMentorRating from "../../utils/calculateSeniorMentorRating";

const getAllSeniorMentor = async (req: AuthRequest, res: Response) => {
    if (req.role !== Role.admin) {
        throwUnauthorizedError(
            "You are not authorized to get all senior mentors",
        );
        return;
    }
    const data = await db.seniorMentor.findMany({
        select: {
            id: true,
            name: true,
            username: true,
        },
        orderBy: {
            name: "asc",
        },
    });
    res.json({
        data,
        success: true,
    });
};

export default getAllSeniorMentor;
