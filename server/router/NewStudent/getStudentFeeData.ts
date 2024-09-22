import { AuthRequest, Role } from "../../types";
import { Response } from "express";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

const getStudentFeeData = async (req: AuthRequest, res: Response) => {
    const role = req.role;
    if (role !== Role.admin) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const students = await db.student.findMany({
        select: {
            name: true,
            createdAt: true,
            id: true,
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
        orderBy: {
            createdAt: "desc",
        },
    });
    const data = students.map((student) => {
        const totalAmountPaid =
            student.Fees?.payments.reduce(
                (sum, payment) => sum + payment.amount,
                0,
            ) || 0;

        return {
            ...student,
            totalAmountPaid,
        };
    });
    return res.status(200).json({
        success: true,
        data,
    });
};

export default getStudentFeeData;
