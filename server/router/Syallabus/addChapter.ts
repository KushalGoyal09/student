import { Response, Request } from "express";
import { PrismaClient } from "prisma/prisma-client";
import { AuthRequest, Role } from "../../types";
import { z } from "zod";
const db = new PrismaClient();

const bodySchemaAdd = z.object({
    chapterName: z.coerce.string(),
    subject: z.enum(["physics", "chemistry", "biology"]),
});

interface Chapter {
    id: number;
    chapterName: string;
    createdAt: Date;
}

const addChapter = async (req: AuthRequest, res: Response) => {
    const role = req.role;
    if (role !== Role.admin) {
        res.status(401).json({
            success: false,
            message: "You are not authorized to add Physics Syllabus",
        });
        return;
    }
    const { chapterName, subject } = bodySchemaAdd.parse(req.body);
    let data: Chapter;
    if (subject === "physics") {
        data = await db.physicsSyallabus.create({
            data: {
                chapterName,
            },
            select: {
                id: true,
                chapterName: true,
                createdAt: true,
            },
        });
    } else if (subject === "chemistry") {
        data = await db.chemistrySyallabus.create({
            data: {
                chapterName,
            },
            select: {
                id: true,
                chapterName: true,
                createdAt: true,
            },
        });
    } else {
        data = await db.biologySyallabus.create({
            data: {
                chapterName,
            },
            select: {
                id: true,
                chapterName: true,
                createdAt: true,
            },
        });
    }

    res.json({
        success: true,
        message: `Physics ${chapterName} added successfully`,
        data,
    });
};

export default addChapter;
