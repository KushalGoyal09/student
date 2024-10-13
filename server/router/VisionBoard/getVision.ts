import { PrismaClient } from "@prisma/client";
import { Response } from "express";
import { z } from "zod";
import { AuthRequest } from "../../types";
const db = new PrismaClient();

const bodySchema = z.object({
    studentId: z.string(),
});

const getVision = async (req: AuthRequest, res: Response) => {
    const { studentId } = bodySchema.parse(req.body);
    const physicsVision = await db.physicsVisionBoard.findMany({
        where: {
            studentId,
        },
    });
    const physics = physicsVision.map((vision) => {
        return {
            ...vision,
            chapterId: vision.physicsSyallabusId,
        };
    });
    const chemistryVision = await db.chemistryVisionBoard.findMany({
        where: {
            studentId,
        },
    });
    const chemistry = chemistryVision.map((vision) => {
        return {
            ...vision,
            chapterId: vision.chemistrySyallabusId,
        };
    });
    const biologyVision = await db.biologyVisionBoard.findMany({
        where: {
            studentId,
        },
    });
    const biology = biologyVision.map((vision) => {
        return {
            ...vision,
            chapterId: vision.biologySyallabusId,
        };
    });
    res.status(200).json({
        success: true,
        data: {
            physics,
            chemistry,
            biology,
        },
    });
};

export default getVision;
