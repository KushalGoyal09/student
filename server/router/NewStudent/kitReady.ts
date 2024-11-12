import { Response } from "express";
import { AuthRequest, Role } from "../../types";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
const db = new PrismaClient();

const bodySchema = z.object({
    studentId: z.coerce.string(),
});

const kitReady = async (req: AuthRequest, res: Response) => {
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
                KitDispatch: true,
            },
        });
        if (!supervisor || supervisor.KitDispatch === false) {
            return res.status(401).json({ error: "Unauthorized" });
        }
    }
    const parsedData = bodySchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({ error: "Invalid input" });
    }
    const { studentId } = parsedData.data;
    const student = await db.student.findUnique({
        where: {
            id: studentId,
        },
        select: {
            kitReady: true,
        },
    });

    if (!student) {
        return res.status(404).json({ error: "Student not found" });
    }

    await db.student.update({
        where: {
            id: studentId,
        },
        data: {
            kitReady: !student.kitReady,
        },
    });
    return res.status(200).json({
        message: "Kit status updated",
    });
};

export default kitReady;
