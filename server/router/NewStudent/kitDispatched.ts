import { Response } from "express";
import { AuthRequest, Role } from "../../types";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
const db = new PrismaClient();

const bodySchema = z.object({
    studentId: z.coerce.string(),
    date: z.coerce.date(),
});

const kitDispatched = async (req: AuthRequest, res: Response) => {
    const role = req.role;
    if (role !== Role.admin) {
        return res.status(401).json({ error: "Unauthorized" });
    }
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
            kitDispatched: true,
            kitDispatchedDate: date,
        },
    });
    return res.status(200).json({
        message: "Kit dispatched status updated",
    });
};

export default kitDispatched;
