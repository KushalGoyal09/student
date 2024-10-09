import { PrismaClient } from "prisma/prisma-client";
import { Response } from "express";
import { AuthRequest, Role } from "../../types";
import { throwUnauthorizedError } from "../../custom-error/customError";
const db = new PrismaClient();

const getMentorFeedbacks = async (req: AuthRequest, res: Response) => {
    const role = req.role;
    const userId = req.userId;
    if (role !== Role.groupMentor || !userId) {
        throwUnauthorizedError("You are not authorized to get this resource");
        return;
    }
    const mentorFeedbacks = await db.ratingByStudent.findMany({
        where: {
            groupMentorId: userId,
        },
        select: {
            exceptation: true,
        },
    });
    const feedbacks = mentorFeedbacks.map((feedback) => {
        return feedback.exceptation;
    });
    res.json({
        success: true,
        data: feedbacks,
    });
};

export default getMentorFeedbacks;
