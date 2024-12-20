import { AuthRequest, Role } from "../../types";
import { Response } from "express";
import { PrismaClient, MentorshipPlan } from "@prisma/client";
const db = new PrismaClient();

const getStudentFeeData = async (req: AuthRequest, res: Response) => {
    const role = req.role;
    const userId = req.userId;
    if (role !== Role.admin && role !== Role.supervisor) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    if (role === Role.supervisor) {
        const supervisor = await db.supervisor.findUnique({
            where: {
                id: userId,
            },
            select: {
                FeeManagement: true,
            },
        });
        if (!supervisor || supervisor.FeeManagement === false) {
            return res.status(401).json({ error: "Unauthorized" });
        }
    }
    const students = await db.student.findMany({
        select: {
            name: true,
            whattsapNumber: true,
            createdAt: true,
            id: true,
            Fees: {
                select: {
                    allClear: true,
                    feesPlan: true,
                    mentorshipPlan: true,
                    payments: {
                        select: {
                            amount: true,
                            date: true,
                            mode: true,
                            transactionId: true,
                            cleared: true,
                        },
                        orderBy: {
                            date: "asc",
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
                (sum, payment) =>
                    payment.cleared ? sum + payment.amount : sum,
                0,
            ) || 0;
        const totalAmountDue =
            student.Fees?.payments.reduce(
                (sum, payment) =>
                    !payment.cleared ? sum + payment.amount : sum,
                0,
            ) || 0;

        return {
            ...student,
            totalAmountPaid,
            totalAmountDue,
        };
    });
    return res.status(200).json({
        success: true,
        data,
        totalAmountDue: data.reduce(
            (sum, student) => sum + student.totalAmountDue,
            0,
        ),
    });
};

export default getStudentFeeData;
