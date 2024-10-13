import { z } from "zod";
import { Response } from "express";
import { AuthRequest, Role } from "../../types";
import { PrismaClient } from "prisma/prisma-client";
import { throwUnauthorizedError } from "../../custom-error/customError";
const db = new PrismaClient();

const bodySchema = z.object({
    supervisorId: z.string(),
});

const getPermissions = async (req: AuthRequest, res: Response) => {
    const role = req.role;
    if (role !== Role.admin) {
        throwUnauthorizedError("You are not authorized to manage roles");
        return;
    }
    const { supervisorId } = bodySchema.parse(req.body);
    const supervisor = await db.supervisor.findUnique({
        where: {
            id: supervisorId,
        },
        select: {
            FeeManagement: true,
            AssaignMentor: true,
            KitDispatch: true,
        },
    });
    if (supervisor === null) {
        res.status(404).json({
            message: "Supervisor not found",
            success: false,
        });
        return;
    }
    res.json({
        data: supervisor,
        success: true,
    });
};

export default getPermissions;
