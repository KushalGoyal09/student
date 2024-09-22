import { PrismaClient } from "prisma/prisma-client";
const db = new PrismaClient();
import { Response } from "express";
import { AuthRequest, Role } from "../../types";
import { throwUnauthorizedError } from "../../custom-error/customError";

const getAllGroupMentor = async (req: AuthRequest, res: Response) => {
    if (
        req.role !== Role.admin &&
        req.role !== Role.supervisor &&
        req.role !== Role.seniorMentor
    ) {
        throwUnauthorizedError("You are not authorized to get all supervisors");
        return;
    }
    if (req.role === Role.admin) {
        const data = await db.groupMentor.findMany({
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
            success: true,
            data,
        });
        return;
    }
    if (req.role === Role.supervisor) {
        const userId = req.userId;
        if (!userId) {
            throwUnauthorizedError("User not found");
            return;
        }
        const seniorMentors = await db.seniorMentor.findMany({
            where: {
                supervisorId: userId,
            },
            select: {
                GroupMentor: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                    },
                },
            },
        });
        const data = seniorMentors.flatMap(
            (mentorGroup) => mentorGroup.GroupMentor,
        );
        res.json({
            success: true,
            data,
        });
        return;
    }
    if (req.role === Role.seniorMentor) {
        const userId = req.userId;
        if (!userId) {
            throwUnauthorizedError("User not found");
            return;
        }
        const data = await db.groupMentor.findMany({
            where: {
                seniorMentorId: userId,
            },
            select: {
                id: true,
                name: true,
                username: true,
            },
        });
        res.json({
            success: true,
            data,
            
        });
        return;
    }
};

export default getAllGroupMentor;
