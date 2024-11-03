import { PrismaClient, TargetType } from "prisma/prisma-client";
import { Response } from "express";
import { AuthRequest } from "../../types";
import { z } from "zod";
const db = new PrismaClient();

const bodySchema = z.object({
    studentId: z.string(),
    target: z.array(
        z.object({
            date: z.string(),
            targetType: z.enum(["Regular", "Revision", "Extra"]),
            physics: z.array(
                z.object({
                    isFinal: z.boolean().optional(),
                    numberOfLecture: z.number(),
                    chapterId: z.coerce.number(),
                }),
            ),
            chemistry: z.array(
                z.object({
                    isFinal: z.boolean().optional(),
                    numberOfLecture: z.number(),
                    chapterId: z.coerce.number(),
                }),
            ),
            biology: z.array(
                z.object({
                    isFinal: z.boolean().optional(),
                    numberOfLecture: z.number(),
                    chapterId: z.coerce.number(),
                }),
            ),
        }),
    ),
});

const setTarget = async (req: AuthRequest, res: Response) => {
    const { studentId, target } = bodySchema.parse(req.body);
    for (const t of target) {
        const createdTarget = await db.target.create({
            data: {
                studentId,
                date: t.date,
                targetType: t.targetType,
            },
        });
        const targetId = createdTarget.id;

        if (t.physics && t.physics.length > 0) {
            const physicsTargets = t.physics.map((p) => ({
                chapterId: p.chapterId,
                targetId,
                isFinal: p.isFinal,
                numberOfLecture: p.numberOfLecture,
            }));
            await handleIncreaseLecture(
                "Physics",
                t.targetType,
                physicsTargets,
                studentId,
            );
            await db.physicsTarget.createMany({
                data: physicsTargets,
            });
        }

        if (t.chemistry && t.chemistry.length > 0) {
            const chemistryTargets = t.chemistry.map((c) => ({
                chapterId: c.chapterId,
                targetId,
                numberOfLecture: c.numberOfLecture,
                isFinal: c.isFinal,
            }));
            await handleIncreaseLecture(
                "Chemistry",
                t.targetType,
                chemistryTargets,
                studentId,
            );
            await db.chemistryTarget.createMany({
                data: chemistryTargets,
            });
        }

        if (t.biology && t.biology.length > 0) {
            const biologyTargets = t.biology.map((b) => ({
                chapterId: b.chapterId,
                targetId,
                numberOfLecture: b.numberOfLecture,
                isFinal: b.isFinal,
            }));
            await handleIncreaseLecture(
                "Biology",
                t.targetType,
                biologyTargets,
                studentId,
            );
            await db.biologyTarget.createMany({
                data: biologyTargets,
            });
        }
    }
    res.json({
        message: "Target set successfully",
        success: true,
    });
};

type Subject = "Physics" | "Chemistry" | "Biology";

const handleIncreaseLecture = async (
    subject: Subject,
    targetType: TargetType,
    targets: {
        chapterId: number;
        targetId: string;
        numberOfLecture: number;
        isFinal: boolean | undefined;
    }[],
    studentId: string,
) => {
    for (let i = 0; i < targets.length; i++) {
        const target = targets[i];
        const chapterId = target.chapterId;
        const numberOfLecture = target.numberOfLecture;
        if (subject === "Physics") {
            const vision = await db.physicsVisionBoard.upsert({
                where: {
                    studentId_physicsSyallabusId: {
                        studentId,
                        physicsSyallabusId: chapterId,
                    },
                },
                create: {
                    studentId,
                    physicsSyallabusId: chapterId,
                },
                update: {},
            });
            if (targetType === "Regular") {
                await db.physicsVisionBoard.update({
                    where: {
                        id: vision.id,
                    },
                    data: {
                        numberOfRegularLectures:
                            vision.numberOfRegularLectures + numberOfLecture,
                    },
                });
            } else if (targetType === "Revision") {
                await db.physicsVisionBoard.update({
                    where: {
                        id: vision.id,
                    },
                    data: {
                        numberOfRevisionLectures:
                            vision.numberOfRevisionLectures + numberOfLecture,
                    },
                });
            } else if (targetType === "Extra") {
                await db.physicsVisionBoard.update({
                    where: {
                        id: vision.id,
                    },
                    data: {
                        numberOfExtraLectures:
                            vision.numberOfExtraLectures + numberOfLecture,
                    },
                });
            }
        }
        if (subject === "Chemistry") {
            const vision = await db.chemistryVisionBoard.upsert({
                where: {
                    studentId_chemistrySyallabusId: {
                        studentId,
                        chemistrySyallabusId: chapterId,
                    },
                },
                create: {
                    studentId,
                    chemistrySyallabusId: chapterId,
                },
                update: {},
            });
            if (targetType === "Regular") {
                await db.chemistryVisionBoard.update({
                    where: {
                        id: vision.id,
                    },
                    data: {
                        numberOfRegularLectures:
                            vision.numberOfRegularLectures + numberOfLecture,
                    },
                });
            } else if (targetType === "Revision") {
                await db.chemistryVisionBoard.update({
                    where: {
                        id: vision.id,
                    },
                    data: {
                        numberOfRevisionLectures:
                            vision.numberOfRevisionLectures + numberOfLecture,
                    },
                });
            } else if (targetType === "Extra") {
                await db.chemistryVisionBoard.update({
                    where: {
                        id: vision.id,
                    },
                    data: {
                        numberOfExtraLectures:
                            vision.numberOfExtraLectures + numberOfLecture,
                    },
                });
            }
        }
        if (subject === "Biology") {
            const vision = await db.biologyVisionBoard.upsert({
                where: {
                    studentId_biologySyallabusId: {
                        studentId,
                        biologySyallabusId: chapterId,
                    },
                },
                create: {
                    studentId,
                    biologySyallabusId: chapterId,
                },
                update: {},
            });
            if (targetType === "Regular") {
                await db.biologyVisionBoard.update({
                    where: {
                        id: vision.id,
                    },
                    data: {
                        numberOfRegularLectures:
                            vision.numberOfRegularLectures + numberOfLecture,
                    },
                });
            } else if (targetType === "Revision") {
                await db.biologyVisionBoard.update({
                    where: {
                        id: vision.id,
                    },
                    data: {
                        numberOfRevisionLectures:
                            vision.numberOfRevisionLectures + numberOfLecture,
                    },
                });
            } else if (targetType === "Extra") {
                await db.biologyVisionBoard.update({
                    where: {
                        id: vision.id,
                    },
                    data: {
                        numberOfExtraLectures:
                            vision.numberOfExtraLectures + numberOfLecture,
                    },
                });
            }
        }
    }
};

export default setTarget;
