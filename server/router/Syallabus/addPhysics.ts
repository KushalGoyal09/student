import { Response, Request } from "express";
import { PrismaClient } from "prisma/prisma-client";
import { AuthRequest, Role } from "../../types";
import { z } from "zod";
const db = new PrismaClient();

const bodySchemaAdd = z.object({
    chapterName: z.coerce.string(),
});

export const addPhysics = async (req: AuthRequest, res: Response) => {
    const role = req.role;
    if (role !== Role.admin) {
        res.status(401).json({
            success: false,
            message: "You are not authorized to add Physics Syllabus",
        });
        return;
    }
    const { chapterName } = bodySchemaAdd.parse(req.body);
    await db.physicsSyallabus.create({
        data: {
            chapterName,
        },
    });
    res.json({
        success: true,
        message: `Physics ${chapterName} added successfully`,
    });
};

const bodySchemaDelete = z.object({
    chapterId: z.coerce.number(),
});

export const deletePhysics = async (req: AuthRequest, res: Response) => {
    const role = req.role;
    if (role !== Role.admin) {
        res.status(401).json({
            success: false,
            message: "You are not authorized to delete Physics Syllabus",
        });
        return;
    }
    const { chapterId } = bodySchemaDelete.parse(req.body);
    const data = await db.physicsSyallabus.delete({
        where: {
            id: chapterId,
        },
        select: {
            chapterName: true,
        },
    });
    res.json({
        success: true,
        message: `Physics ${data.chapterName} deleted successfully`,
    });
};
