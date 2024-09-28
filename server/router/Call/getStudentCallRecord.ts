import { PrismaClient, DaysOfWeek, CallStatus } from "@prisma/client";
import { Response } from "express";
import { z } from "zod";
import { AuthRequest, Role } from "../../types";
import { throwUnauthorizedError } from "../../custom-error/customError";
const db = new PrismaClient();

const bodySchema = z.object({
    studentId: z.string(),
    weekStart: z.string(),
});

const getStudentCallRecord = async (req: AuthRequest, res: Response) => {
    const role = req.role;
    if (
        role !== Role.admin &&
        role !== Role.supervisor &&
        role !== Role.seniorMentor &&
        role !== Role.groupMentor
    ) {
        throwUnauthorizedError(
            "You are not authorized to access this resource",
        );
        return;
    }
    const { studentId, weekStart } = bodySchema.parse(req.body);
    const studentCallRecord = await db.studentCallRecord.findMany({
        where: {
            studentId: studentId,
            Week: {
                startDate: weekStart,
            },
        },
        select: {
            call: {
                select: {
                    id: true,
                    callStatus: true,
                    date: true,
                    day: true,
                },
            },
        },
    });
    const data = studentCallRecord.flatMap((student) => student.call);
    res.status(200).json({
        success: true,
        data,
    });
};

export default getStudentCallRecord;
