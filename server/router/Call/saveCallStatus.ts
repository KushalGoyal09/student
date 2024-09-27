import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import { AuthRequest, Role } from "../../types";
import { z } from "zod";
import { endOfWeek, startOfWeek } from "date-fns";

const db = new PrismaClient();

const bodySchema = z.object({
    day: z.enum([
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ]),
    studentId: z.coerce.string(),
    status: z.enum(["Scheduled", "Done", "DNP", "Nothing"]),
    date: z.coerce.string(),
});

const saveCallStatus = async (req: AuthRequest, res: Response) => {
    const role = req.role;
    if (role !== Role.groupMentor) {
        return res
            .status(403)
            .send("You are not authorized to access this route");
    }
    const mentorId = req.userId;
    if (!mentorId) {
        return res.status(401).send("Unauthorized");
    }
    const parsedData = bodySchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).send("Invalid data");
    }
    const { day, studentId, status, date } = parsedData.data;
    const weekStart = startOfWeek(date, { weekStartsOn: 1 })
        .toISOString()
        .split("T")[0];
    const weekEnd = endOfWeek(date, { weekStartsOn: 1 })
        .toISOString()
        .split("T")[0];
    if (status === "Nothing") {
        
        return res.status(200).json({
            success: true,
            message: "Call status deleted successfully",
        });
    }
    const week = await db.week.upsert({
        where: {
            startDate_mentorId: {
                mentorId,
                startDate: weekStart,
            },
        },
        create: {
            startDate: weekStart,
            mentorId,
            endDate: weekEnd,
        },
        update: {},
        select: {
            id: true,
        },
    });
    const studentCallRecord = await db.studentCallRecord.upsert({
        where: {
            studentId_weekId: {
                studentId,
                weekId: week.id,
            },
        },
        update: {},
        create: {
            studentId: studentId,
            weekId: week.id,
            mentorId,
        },
        select: {
            id: true,
        },
    });
    await db.call.upsert({
        where: {
            date_studentId: {
                date,
                studentId,
            },
        },
        update: {
            callStatus: status,
        },
        create: {
            callStatus: status,
            day,
            studentId:studentCallRecord.id,
            date,
        },
    });
    res.status(200).json({
        success: true,
        message: "Call status saved successfully",
    });
};

export default saveCallStatus;
