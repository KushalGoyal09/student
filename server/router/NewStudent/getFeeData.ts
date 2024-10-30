import { AuthRequest, Role } from "../../types";
import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { throwUnauthorizedError } from "../../custom-error/customError";
const db = new PrismaClient();

const bodySchema = z.object({
    studentId: z.string(),
});

type Payment = {
    id: string;
    amount: number;
    date: string;
    mode: string | null;
    transactionId: string | null;
    cleared: boolean;
};

type MentorshipPlan = "Elite" | "Pro" | "Max";

type FeeData = {
    totalAmountPaid: number;
    totalAmountDue: number;
    feesPlan: number;
    allClear: boolean;
    mentorshipPlan: MentorshipPlan;
    payments: Payment[];
};

type FeeDataResponse = {
    success: true;
    data: FeeData | null;
};

const getFeeData = async (req: AuthRequest, res: Response<FeeDataResponse>) => {
    const role = req.role;
    const userId = req.userId;
    if (role !== Role.admin && role !== Role.supervisor) {
        throwUnauthorizedError("Unauthorized");
        return;
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
            throwUnauthorizedError("Unauthorized");
            return;
        }
    }
    const { studentId } = bodySchema.parse(req.body);
    const fee = await db.fees.findUnique({
        where: {
            studentId,
        },
        select: {
            allClear: true,
            feesPlan: true,
            mentorshipPlan: true,
            payments: {
                select: {
                    id: true,
                    amount: true,
                    date: true,
                    transactionId: true,
                    mode: true,
                    cleared: true,
                },
                orderBy: {
                    date: "asc",
                },
            },
        },
    });
    if (!fee) {
        res.json({
            success: true,
            data: null,
        });
        return;
    }
    const totalAmountPaid = fee.payments.reduce(
        (sum, payment) => (payment.cleared ? sum + payment.amount : sum),
        0,
    );
    const totalAmountDue = fee.payments.reduce(
        (sum, payment) => (!payment.cleared ? sum + payment.amount : sum),
        0,
    );

    return res.status(200).json({
        success: true,
        data: {
            ...fee,
            totalAmountPaid,
            totalAmountDue,
        },
    });
};

export default getFeeData;
