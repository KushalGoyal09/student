import { PrismaClient } from "prisma/prisma-client";
import { Response } from "express";
import { AuthRequest, Role } from "../../types";
const db = new PrismaClient();

const getAllMentors = async (req: AuthRequest, res: Response) => {
    const role = req.role;
    const userId = req.userId;
    if (role !== Role.seniorMentor || !userId) {
        return res
            .status(403)
            .send("You are not authorized to access this route");
    }
    const mentors = await db.groupMentor.findMany({
        where: {
            seniorMentorId: userId,
        },
        select: {
            name: true,
            username: true,
            id: true,
            whattsapLink: true,
            Student: {
                select: {
                    id: true,
                    name: true,
                    whattsapGroupLink: true,
                    whattsapNumber: true,
                    fatherNumber: true,
                    motherNumber: true,
                },
            },
        },
    });
    return res.status(200).json({
        success: true,
        data: mentors,
    });
};

export default getAllMentors;
