import { PrismaClient } from "prisma/prisma-client";
const db = new PrismaClient();
import { Response } from "express";
import { AuthRequest, Role } from "../../types";
import { throwUnauthorizedError } from "../../custom-error/customError";
import calculateSeniorMentorRating from "../../utils/calculateSeniorMentorRating";

const getAllSeniorMentor = async (req: AuthRequest, res: Response) => {
    if (req.role !== Role.admin && req.role !== Role.supervisor) {
        throwUnauthorizedError(
            "You are not authorized to get all senior mentors",
        );
        return;
    }
    if (req.role === Role.admin) {
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
        const response = await Promise.all(
            data.map(async (item) => {
                return {
                    ...item,
                    rating: await calculateSeniorMentorRating(item.id),
                };
            }),
        );
        res.status(200).json({
            success: true,
            data: response,
        });
        return;
    }
    if (req.role === Role.supervisor) {
        const userId = req.userId;
        if (!userId) {
            throwUnauthorizedError("User not found");
            return;
        }
        const data = await db.seniorMentor.findMany({
            where: {
                supervisorId: userId,
            },
            select: {
                id: true,
                name: true,
                username: true,
            },
        });
        const response = await Promise.all(
            data.map(async (item) => {
                return {
                    ...item,
                    rating: await calculateSeniorMentorRating(item.id),
                };
            }),
        );
        res.status(200).json({
            success: true,
            data: response,
        });
    }
};

export default getAllSeniorMentor;
