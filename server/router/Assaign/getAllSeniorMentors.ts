import { PrismaClient } from "prisma/prisma-client";
const db = new PrismaClient();
import { Response } from "express";
import { AuthRequest, Role } from "../../types";

const getAllSeniorMentor = async (req: AuthRequest, res: Response) => {
    const data = await db.seniorMentor.findMany({
        select: {
            id: true,
            name: true,
            username: true,
        },
        orderBy: {
            name: "asc",
        },
    });
    res.json({
        data,
        success: true,
    });
};

export default getAllSeniorMentor;
