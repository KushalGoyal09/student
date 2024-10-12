import { PrismaClient } from "@prisma/client";
import { Response } from "express";
import { z } from "zod";
import { AuthRequest } from "../../types";

const db = new PrismaClient();

const bodySchema = z.object({
    studentId: z.string(),
    subject: z.enum(["physics", "chemistry", "biology"]),
    chapterId: z.coerce.number(),
    vision: z.enum(["notes", "leacture", "ncert", "QP", "revision", "viva"]),
    completed: z.coerce.boolean(),
});

const setVision = async (req: AuthRequest, res: Response) => {
    const { studentId, subject, chapterId, vision, completed } =
        bodySchema.parse(req.body);

    switch (subject) {
        case "physics":
            await db.physicsVisionBoard.upsert({
                where: {
                    studentId_physicsSyallabusId: {
                        studentId,
                        physicsSyallabusId: chapterId,
                    },
                },
                create: {
                    studentId,
                    physicsSyallabusId: chapterId,
                    notes: vision === "notes" ? completed : false,
                    leacture: vision === "leacture" ? completed : false,
                    ncert: vision === "ncert" ? completed : false,
                    QP: vision === "QP" ? completed : false,
                    revision: vision === "revision" ? completed : false,
                    viva: vision === "viva" ? completed : false,
                },
                update: {
                    [vision]: completed,
                },
            });
            break;
        case "chemistry":
            await db.chemistryVisionBoard.upsert({
                where: {
                    studentId_chemistrySyallabusId: {
                        studentId,
                        chemistrySyallabusId: chapterId,
                    },
                },
                create: {
                    studentId,
                    chemistrySyallabusId: chapterId,
                    notes: vision === "notes" ? completed : false,
                    leacture: vision === "leacture" ? completed : false,
                    ncert: vision === "ncert" ? completed : false,
                    QP: vision === "QP" ? completed : false,
                    revision: vision === "revision" ? completed : false,
                    viva: vision === "viva" ? completed : false,
                },
                update: {
                    [vision]: completed,
                },
            });
            break;
        case "biology":
            await db.biologyVisionBoard.upsert({
                where: {
                    studentId_biologySyallabusId: {
                        studentId,
                        biologySyallabusId: chapterId,
                    },
                },
                create: {
                    studentId,
                    biologySyallabusId: chapterId,
                    notes: vision === "notes" ? completed : false,
                    leacture: vision === "leacture" ? completed : false,
                    ncert: vision === "ncert" ? completed : false,
                    QP: vision === "QP" ? completed : false,
                    revision: vision === "revision" ? completed : false,
                    viva: vision === "viva" ? completed : false,
                },
                update: {
                    [vision]: completed,
                },
            });
            break;
    }
    res.status(200).json({ success: true });
};

export default setVision;
