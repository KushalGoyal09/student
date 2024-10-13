import { Response, Request } from "express";
import { PrismaClient } from "prisma/prisma-client";
import { AuthRequest, Role } from "../../types";
import { z } from "zod";
const db = new PrismaClient();

const bodySchemaDelete = z.object({
    chapterId: z.coerce.number(),
    subject: z.enum(["physics", "chemistry", "biology"]),
});

const deleteChapter = async (req: AuthRequest, res: Response) => {
    const role = req.role;
    if (role !== Role.admin) {
        res.status(401).json({
            success: false,
            message: "You are not authorized to delete Physics Syllabus",
        });
        return;
    }
    const { chapterId, subject } = bodySchemaDelete.parse(req.body);
    if (subject === "physics") {
        await db.physicsSyallabus.delete({
            where: {
                id: chapterId,
            },
        });
    } else if (subject === "chemistry") {
        await db.chemistrySyallabus.delete({
            where: {
                id: chapterId,
            },
        });
    } else {
        await db.biologySyallabus.delete({
            where: {
                id: chapterId,
            },
        });
    }

    res.json({
        success: true,
    });
};

export default deleteChapter;
