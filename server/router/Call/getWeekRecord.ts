import { PrismaClient } from "@prisma/client";
import { Response } from "express";
import { AuthRequest, Role } from "../../types";
import { z } from "zod";
const db = new PrismaClient();

const bodySchema = z.object({
    startDay: z.coerce.string(),
});

const getWeekRecord = async (req: AuthRequest, res: Response) => {
    const role = req.role;
    if (role !== Role.groupMentor) {
        return res
            .status(403)
            .send("You are not authorized to access this route.");
    }
    const mentorId = req.userId;
    if (!mentorId) {
        return res.status(401).send("Unauthorized");
    }
    const parsedData = bodySchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).send("Invalid data");
    }
    const { startDay } = parsedData.data;
    const data = await db.week.findUnique({
        where: {
            startDate_mentorId: {
                startDate: startDay,
                mentorId: mentorId,
            },
        },
        select: {
            startDate: true,
            endDate: true,
            students: {
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
    res.status(200).json({
        data,
        isWeek: data !== null,
        success: true,
    });
};

export default getWeekRecord;
