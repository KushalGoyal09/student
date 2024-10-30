import { PrismaClient } from "@prisma/client";
import { Response } from "express";
import { AuthRequest, Role } from "../../types";
import { z } from "zod";
import { endOfWeek, format, startOfWeek } from "date-fns";

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
    studentId: z.string(),
    status: z.enum(["Scheduled", "Done", "DNP", "Nothing"]),
    date: z.string(),
    callType: z.enum(["Student", "Parent"]),
});

const saveCallStatus = async (req: AuthRequest, res: Response) => {
    const role = req.role;
    const seniorMentorId = req.userId;
    if (role !== Role.seniorMentor || !seniorMentorId) {
        return res
            .status(403)
            .send("You are not authorized to access this route");
    }
    const { day, studentId, status, date, callType } = bodySchema.parse(
        req.body,
    );
    const weekStart = format(
        startOfWeek(date, { weekStartsOn: 1 }),
        "yyyy-MM-dd",
    );
    const weekEnd = format(endOfWeek(date, { weekStartsOn: 1 }), "yyyy-MM-dd");
    if (status === "Nothing") {
        const week = await db.seniorWeek.findUnique({
            where: {
                startDate_mentorId: {
                    mentorId: seniorMentorId,
                    startDate: weekStart,
                },
            },
        });
        if (!week) {
            return res.status(400).json({
                success: false,
                message: "No week found",
            });
        }
        if (callType === "Student") {
            const studentCallRecord =
                await db.studentCallRecordSenior.findUnique({
                    where: {
                        studentId_weekId: {
                            studentId,
                            weekId: week.id,
                        },
                    },
                });
            if (!studentCallRecord) {
                return res.status(400).json({
                    success: false,
                    message: "No student call record found",
                });
            }
            await db.seniorCallStudent.delete({
                where: {
                    date_studentRecordId: {
                        date,
                        studentRecordId: studentCallRecord.id,
                    },
                },
            });
            return res.status(200).json({
                success: true,
                message: "Call status deleted successfully",
            });
        }
        if (callType === "Parent") {
            const studentCallRecord =
                await db.parentsCallRecordSenior.findUnique({
                    where: {
                        studentId_weekId: {
                            studentId,
                            weekId: week.id,
                        },
                    },
                });
            if (!studentCallRecord) {
                return res.status(400).json({
                    success: false,
                    message: "No student call record found",
                });
            }
            await db.seniorCallParent.delete({
                where: {
                    date_studentRecordId: {
                        date,
                        studentRecordId: studentCallRecord.id,
                    },
                },
            });
            return res.status(200).json({
                success: true,
                message: "Call status deleted successfully",
            });
        }
        return;
    }
    const week = await db.seniorWeek.upsert({
        where: {
            startDate_mentorId: {
                mentorId: seniorMentorId,
                startDate: weekStart,
            },
        },
        create: {
            startDate: weekStart,
            mentorId: seniorMentorId,
            endDate: weekEnd,
        },
        update: {},
        select: {
            id: true,
        },
    });
    if (callType === "Student") {
        const studentCallRecord = await db.studentCallRecordSenior.upsert({
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
            },
            select: {
                id: true,
            },
        });
        await db.seniorCallStudent.upsert({
            where: {
                date_studentRecordId: {
                    date,
                    studentRecordId: studentCallRecord.id,
                },
            },
            update: {
                callStatus: status,
            },
            create: {
                callStatus: status,
                day,
                studentRecordId: studentCallRecord.id,
                date,
            },
        });
        return res.status(200).json({
            success: true,
            message: "Call status saved successfully",
        });
    }
    if (callType === "Parent") {
        const studentCallRecord = await db.parentsCallRecordSenior.upsert({
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
            },
            select: {
                id: true,
            },
        });
        await db.seniorCallParent.upsert({
            where: {
                date_studentRecordId: {
                    date,
                    studentRecordId: studentCallRecord.id,
                },
            },
            update: {
                callStatus: status,
            },
            create: {
                callStatus: status,
                day,
                studentRecordId: studentCallRecord.id,
                date,
            },
        });
        return res.status(200).json({
            success: true,
            message: "Call status saved successfully",
        });
    }
    res.status(400).json({
        success: false,
        message: "Invalid call type",
    });
};

export default saveCallStatus;
