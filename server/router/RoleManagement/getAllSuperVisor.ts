import { PrismaClient } from "prisma/prisma-client";
import { Response } from "express";
import { AuthRequest, Role } from "../../types";
import { throwUnauthorizedError } from "../../custom-error/customError";
const db = new PrismaClient();

const getAllSuperVisor = async (req: AuthRequest, res: Response) => {
    const role = req.role;
    if (role !== Role.admin) {
        throwUnauthorizedError("You are not authorized to manage roles");
        return;
    }
    const supervisors = await db.supervisor.findMany({
        select: {
            id: true,
            name: true,
            username: true,
        },
    });
    res.json({
        data: supervisors,
        success: true,
    });
};

export default getAllSuperVisor;
