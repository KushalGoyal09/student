import { Response } from "express";
import { AuthRequest, Role } from "../../types";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
const db = new PrismaClient();

const bodySchema = z.object({
    studentId: z.coerce.string(),
    payment: z.object({
        id: z.string(),
        amount: z.coerce.number(),
        date: z.string(),
        mode: z.string().nullable(),
        cleared: z.coerce.boolean(),
    }),
});

const addPayment = async (req: AuthRequest, res: Response) => {
    const role = req.role;
    if (role !== Role.admin) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const parsedData = bodySchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({ error: "Invalid input" });
    }
    const { studentId, payment } = parsedData.data;
    await db.payment.update({
        where: {
            id: payment.id,
        },
        data: {
            amount: payment.amount,
            date: payment.date,
            mode: payment.mode,
            cleared: payment.cleared,
        },
    });
    return res.status(200).json({ success: true });
};

export default addPayment;
