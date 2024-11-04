import { PrismaClient } from "@prisma/client";
import { Response } from "express";
import { AuthRequest } from "../../types";
import { z } from "zod";

const db = new PrismaClient();

const bodySchema = z.object({
    subject: z.enum(["physics", "chemistry", "biology"]),
    chapterId: z.coerce.number(),
    studentId: z.string(),
});

interface ResponseData {
    data: {
        numberOfExtraLectures: number;
        numberOfRegularLectures: number;
        numberOfRevisionLectures: number;
    };
    success: boolean;
}

const getLecturesDone = async (req: AuthRequest, res: Response) => {
    const { subject, studentId, chapterId } = bodySchema.parse(req.body);
    if (subject === "physics") {
        let data = await db.physicsVisionBoard.findUnique({
            where: {
                studentId_physicsSyallabusId: {
                    studentId,
                    physicsSyallabusId: chapterId,
                },
            },
            select: {
                numberOfExtraLectures: true,
                numberOfRegularLectures: true,
                numberOfRevisionLectures: true,
            },
        });
        if (!data) {
            data = {
                numberOfExtraLectures: 0,
                numberOfRegularLectures: 0,
                numberOfRevisionLectures: 0,
            };
        }
        return res.status(200).json({
            data,
            success: true,
        });
    }
    if (subject === "biology") {
        let data = await db.biologyVisionBoard.findUnique({
            where: {
                studentId_biologySyallabusId: {
                    studentId,
                    biologySyallabusId: chapterId,
                },
            },
            select: {
                numberOfExtraLectures: true,
                numberOfRegularLectures: true,
                numberOfRevisionLectures: true,
            },
        });
        if (!data) {
            data = {
                numberOfExtraLectures: 0,
                numberOfRegularLectures: 0,
                numberOfRevisionLectures: 0,
            };
        }
        return res.status(200).json({
            data,
            success: true,
        });
    }
    if (subject === "chemistry") {
        let data = await db.chemistryVisionBoard.findUnique({
            where: {
                studentId_chemistrySyallabusId: {
                    studentId,
                    chemistrySyallabusId: chapterId,
                },
            },
            select: {
                numberOfExtraLectures: true,
                numberOfRegularLectures: true,
                numberOfRevisionLectures: true,
            },
        });
        if (!data) {
            data = {
                numberOfExtraLectures: 0,
                numberOfRegularLectures: 0,
                numberOfRevisionLectures: 0,
            };
        }
        return res.status(200).json({
            data,
            success: true,
        });
    }
};

export default getLecturesDone;
