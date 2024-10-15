import { PrismaClient } from "prisma/prisma-client";
const db = new PrismaClient();
import { Response } from "express";
import { AuthRequest, Role } from "../../types";
import { throwUnauthorizedError } from "../../custom-error/customError";

const getAllEmployes = async (req: AuthRequest, res: Response) => {
    if (req.role !== Role.admin) {
        throwUnauthorizedError("You are not authorized to get all supervisors");
        return;
    }
    const data = await db.employee.findMany({
        select: {
            id: true,
            name: true,
            phoneNumber: true,
        },
        orderBy: {
            name: "asc",
        },
    });
    res.json({
        success: true,
        data,
    });
};

export default getAllEmployes;
