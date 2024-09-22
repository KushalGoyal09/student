import { AuthRequest } from "../../types";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { Response } from "express";
const db = new PrismaClient();

const bodySchema = z.object({
    studentId: z.coerce.string(),
    date: z.coerce.date(),
});

const changeActiveStatus = async (req: AuthRequest, res: Response) => {
    const parsedData = bodySchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({ error: "Invalid input" });
    }
    const { studentId, date } = parsedData.data;
    await db.student.update({
        where: {
            id: studentId,
        },
        data: {
            status: false,
            dateOfDeactive: date,
        },
    });
    return res.status(200).json({
        message: "Active status updated",
    });
};

export default changeActiveStatus;
