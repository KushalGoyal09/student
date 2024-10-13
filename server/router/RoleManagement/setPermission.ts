import { PrismaClient } from "prisma/prisma-client";
const db = new PrismaClient();
import { Response } from "express";
import { z } from "zod";
import { AuthRequest, Role } from "../../types";
import { throwUnauthorizedError } from "../../custom-error/customError";

const bodySchema = z.object({
    supervisorId: z.string(),
    FeeManagement: z.boolean().optional(),
    KitDispatch: z.boolean().optional(),
    AssaignMentor: z.boolean().optional(),
});

const setPermission = async (req: AuthRequest, res: Response) => {
    const role = req.role;
    if (role !== Role.admin) {
        throwUnauthorizedError("You are not authorized to manage roles");
        return;
    }
    const { supervisorId, FeeManagement, KitDispatch, AssaignMentor } =
        bodySchema.parse(req.body);
    await db.supervisor.update({
        where: {
            id: supervisorId,
        },
        data: {
            FeeManagement,
            KitDispatch,
            AssaignMentor,
        },
    });
    res.json({
        success: true,
    });
};

export default setPermission;
