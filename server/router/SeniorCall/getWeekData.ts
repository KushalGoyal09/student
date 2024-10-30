import { PrismaClient } from "@prisma/client";
import { Response } from "express";
import { AuthRequest, Role } from "../../types";
import { z } from "zod";
const db = new PrismaClient();

const bodySchema = z.object({
    startDay: z.string(),
    groupMentorId: z.string(),
});

const getWeekRecord = async (req: AuthRequest, res: Response) => {
    const seniorMentorId = req.userId;
    if (req.role !== Role.seniorMentor || !seniorMentorId) {
        return res.status(403).send("Unauthorized");
    }
    const { startDay, groupMentorId } = bodySchema.parse(req.body);

    const data = await db.seniorWeek.findUnique({
        where: {
            startDate_mentorId: {
                startDate: startDay,
                mentorId: seniorMentorId,
            },
        },
        select: {
            startDate: true,
            endDate: true,
            students: {
                where: {
                    Student: {
                        groupMentorId: groupMentorId,
                    },
                },
                select: {
                    studentId: true,
                    call: {
                        select: {
                            date: true,
                            callStatus: true,
                        },
                    },
                },
            },
            parents: {
                where: {
                    Student: {
                        groupMentorId: groupMentorId,
                    },
                },
                select: {
                    studentId: true,
                    call: {
                        select: {
                            date: true,
                            callStatus: true,
                        },
                    },
                },
            },
        },
    });

    res.json({
        success: true,
        data: data,
    });
};

export default getWeekRecord;
