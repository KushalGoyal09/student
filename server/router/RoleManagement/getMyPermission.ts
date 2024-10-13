import { PrismaClient } from "prisma/prisma-client";
const db = new PrismaClient();
import { Response } from "express";
import { AuthRequest, Role } from "../../types";

const getMyPermission = async (req: AuthRequest, res: Response) => {
    const role = req.role;
    const userId = req.userId;
    if (role !== Role.supervisor) {
        return res
            .status(403)
            .json({ message: "You are not authorized to get permission" });
    }
    const supervisor = await db.supervisor.findUnique({
        where: {
            id: userId,
        },
        select: {
            AssaignMentor: true,
            FeeManagement: true,
            KitDispatch: true,
        },
    });
    if (!supervisor) {
        return res
            .status(403)
            .json({ message: "You are not authorized to get permission" });
    }
    res.json({
        success: true,
        data: supervisor,
    });
};

export default getMyPermission;
