import { PrismaClient } from "prisma/prisma-client";
import { Response } from "express";
import { AuthRequest } from "../../types";
import { z } from "zod";
import { addDays, format } from "date-fns";

const db = new PrismaClient();

const bodySchema = z.object({
    studentId: z.string(),
    fromDate: z.string(),
    toDate: z.string(),
}); 

const getTarget = async (req: AuthRequest, res: Response) => {
    const { studentId, fromDate, toDate } = bodySchema.parse(req.body);
    const data = [];
    let date = addDays(new Date(fromDate), 1);
    while (date <= new Date(toDate)) {
        const target = await db.target.findMany({
            where: {
                studentId,
                date: format(date, "yyyy-MM-dd"),
            },
            select: {
                id: true,
                date: true,
                targetType: true,
                completed: true,
                physics: true,
                chemistry: true,
                biology: true,
            },
        });
        data.push(...target);
        date = addDays(date, 1);
    }
    res.json({
        data,
        message: "Targets fetched successfully",
        success: true,
    });
};

export default getTarget;
