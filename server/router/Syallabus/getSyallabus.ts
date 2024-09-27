import { PrismaClient } from "prisma/prisma-client";
import { Response, Request } from "express";
const db = new PrismaClient();

const getAllSyallabus = async (req: Request, res: Response) => {
    const physics = await db.physicsSyallabus.findMany();
    const chemistry = await db.chemistrySyallabus.findMany();
    const biology = await db.biologySyallabus.findMany();
    res.json({
        success: true,
        physics,
        chemistry,
        biology,
    });
};

export default getAllSyallabus;
