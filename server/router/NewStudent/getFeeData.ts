import { AuthRequest, Role } from "../../types";
import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { throwNotFoundError } from "../../custom-error/customError";
const db = new PrismaClient();

const bodySchema = z.object({
    studentId: z.coerce.string(),
});

const getFeeData = async (req: AuthRequest, res: Response) => {
    const role = req.role;
    if (role !== Role.admin) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const parsedData = bodySchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({ error: "Invalid data" });
    }
    const student = await db.student.findUnique({
        where: {
            id: parsedData.data.studentId,
        },
        select: {
            Fees: {
                select: {
                    allClear: true,
                    feesPlan: true,
                    payments: {
                        select: {
                            amount: true,
                            date: true,
                            mode: true,
                        },
                    },
                },
            },
        },
    });
    if (!student) {
        throwNotFoundError("Student not found");
        return;
    }
    const totalAmountPaid =
        student.Fees?.payments.reduce(
            (sum, payment) => sum + payment.amount,
            0,
        ) || 0;
    const data = {
        ...student.Fees,
        totalAmountPaid,
    };
    return res.status(200).json({
        success: true,
        data,
    });
};

export default getFeeData;
