import { Response } from "express";
import { AuthRequest, Role } from "../../types";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
const db = new PrismaClient();

const bodySchema = z.object({
    studentId: z.coerce.string(),
    feesPlan: z.coerce.number().int(),
    mentorshipPlan: z.enum(["Elite", "Pro", "Max"]),
    allClear: z.coerce.boolean().optional(),
    payments: z.array(
        z.object({
            amount: z.coerce.number(),
            date: z.string(),
        }),
    ),
});

const setFeeStructure = async (req: AuthRequest, res: Response) => {
    const role = req.role;
    if (role !== Role.admin) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const parsedData = bodySchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({ error: "Invalid input" });
    }
    const { studentId, feesPlan, mentorshipPlan, payments } = parsedData.data;
    await db.fees.upsert({
        where: {
            studentId,
        },
        create: {
            studentId,
            feesPlan,
            mentorshipPlan,
            payments: {
                createMany: {
                    data: payments,
                },
            },
        },
        update: {
            feesPlan,
            mentorshipPlan,
            payments: {
                createMany: {
                    data: payments,
                },
            },
        },
    });
    return res.status(200).json({ success: true });
};

export default setFeeStructure;
