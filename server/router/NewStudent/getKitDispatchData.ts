import { Response } from "express";
import { AuthRequest, Role } from "../../types";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const getKitDispatchData = async (req: AuthRequest, res: Response) => {
    const role = req.role;
    if (role !== Role.admin) {
        return res.status(401).json({ error: "Unauthorized" });
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