import { Response } from "express";
import { AuthRequest, Role } from "../../types";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const getKitDispatchData = async (req: AuthRequest, res: Response) => {
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
    const students = await db.student.findMany({
        where: {
            Fees: {
                allClear: true,
            },
        },
        select: {
            callNumber: true,
            id: true,
            name: true,
            kitDispatched: true,
            kitDispatchedDate: true,
        },
        orderBy: {
            kitDispatched: "asc",
        },
    });
    res.status(200).json({
        success: true,
        data: students,
    });
};

export default getKitDispatchData;
