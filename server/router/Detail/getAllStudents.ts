import { PrismaClient } from "prisma/prisma-client";
const db = new PrismaClient();
import { Response } from "express";
import { AuthRequest, Role } from "../../types";
import { throwUnauthorizedError } from "../../custom-error/customError";

const getAllStudents = async (req: AuthRequest, res: Response) => {
    if (
        req.role !== Role.admin &&
        req.role !== Role.supervisor &&
        req.role !== Role.seniorMentor &&
        req.role !== Role.groupMentor
    ) {
        throwUnauthorizedError("You are not authorized to get all supervisors");
        return;
    }
    if (req.role === Role.admin) {
        const data = await db.student.findMany({
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
                        Student: true,
                    },
                },
            },
        });
        const data = seniorMentors
            .flatMap((mentorGroup) => mentorGroup.GroupMentor)
            .flatMap((group) => group.Student);
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
        const groupMentors = await db.groupMentor.findMany({
            where: {
                seniorMentorId: userId,
            },
            select: {
                Student: true,
            },
        });
        const data = groupMentors.flatMap((mentorGroup) => mentorGroup.Student);
        res.json({
            success: true,
            data,
        });
        return;
    }
    if (req.role === Role.groupMentor) {
        const userId = req.userId;
        if (!userId) {
            throwUnauthorizedError("User not found");
            return;
        }
        const data = await db.student.findMany({
            where: {
                groupMentorId: userId,
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
};

export default getAllStudents;
