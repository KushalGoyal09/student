import { PrismaClient } from "prisma/prisma-client";
const db = new PrismaClient();
import { Response, Request } from "express";

const createAdmin = async (req: Request, res: Response) => {
    await db.admin.create({
        data: {
            password: "admin",
        },
    });
    res.json({
        success: true,
    });
};

export default createAdmin;
