import { AuthRequest, Role } from "../../types";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { Response } from "express";
import {
    throwBadRequestError,
    throwUnauthorizedError,
} from "../../custom-error/customError";
const db = new PrismaClient();

const bodySchema = z.object({
    studentId: z.string(),
    date: z.coerce.date(),
    status: z.coerce.boolean(),
    reason: z.string().optional(),
});

const changeActiveStatus = async (req: AuthRequest, res: Response) => {
    if (
        req.role !== Role.admin &&
        req.role !== Role.supervisor &&
        req.role !== Role.seniorMentor &&
        req.role !== Role.groupMentor
    ) {
        throwUnauthorizedError(
            "You are not authorized to change active status",
        );
    }
    const parsedData = bodySchema.safeParse(req.body);
    if (!parsedData.success) {
        throwBadRequestError(parsedData.error.errors[0].message);
        return;
    }
    const { studentId, date, status, reason } = parsedData.data;
    if (status === false) {
        await db.student.update({
            where: {
                id: studentId,
            },
            data: {
                status,
                dateOfDeactive: date,
                reasonOfDeactive: reason,
            },
        });
    } else {
        await db.student.update({
            where: {
                id: studentId,
            },
            data: {
                status,
                dateOfDeactive: null,
            },
        });
    }
    return res.status(200).json({
        success: true,
        message: "Active status updated",
    });
};

export default changeActiveStatus;
