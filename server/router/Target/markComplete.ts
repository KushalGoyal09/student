import { PrismaClient } from "@prisma/client";
import { Response } from "express";
import { AuthRequest, Role } from "../../types";
import { throwUnauthorizedError } from "../../custom-error/customError";
import { z } from "zod";
const db = new PrismaClient();

const bodySchema = z.object({
    targetId: z.string(),
});

const markComplete = async (req: AuthRequest, res: Response) => {
    if (
        req.role !== Role.groupMentor &&
        req.role !== Role.admin &&
        req.role !== Role.seniorMentor &&
        req.role !== Role.supervisor
    ) {
        throwUnauthorizedError("You are not authorized to toggle target");
        return;
    }
    const { targetId } = bodySchema.parse(req.body);
    await db.target.update({
        where: {
            id: targetId,
        },
        data: {
            completed: true,
        },
    });
    await updateVisionBoardOnTargetCompletion(targetId);
    res.json({
        success: true,
        message: "Target updated successfully",
    });
};

async function updateVisionBoardOnTargetCompletion(targetId: string) {
    const target = await db.target.findUnique({
        where: { id: targetId },
        select: {
            id: true,
            completed: true,
            studentId: true,
            physics: {
                select: {
                    chapterId: true,
                    isFinal: true,
                },
            },
            chemistry: {
                select: {
                    chapterId: true,
                    isFinal: true,
                },
            },
            biology: {
                select: {
                    chapterId: true,
                    isFinal: true,
                },
            },
            targetType: true,
        },
    });

    if (!target || !target.completed) {
        throw new Error("Target not found or not completed");
    }
    const targetType = target.targetType;
    const studentId = target.studentId;
    for (let i = 0; i < target.physics.length; i++) {
        const chapterId = target.physics[i].chapterId;
        const isFinal = target.physics[i].isFinal;
        if (isFinal === true) {
            if (targetType === "Regular") {
                await db.physicsVisionBoard.update({
                    where: {
                        studentId_physicsSyallabusId: {
                            studentId,
                            physicsSyallabusId: chapterId,
                        },
                    },
                    data: {
                        notes: true,
                        leacture: true,
                        ncert: true,
                        QP: true,
                    },
                });
            }
            if (targetType === "Revision") {
                await db.physicsVisionBoard.update({
                    where: {
                        studentId_physicsSyallabusId: {
                            studentId,
                            physicsSyallabusId: chapterId,
                        },
                    },
                    data: {
                        revision: true,
                    },
                });
            }
        }
    }
    for (let i = 0; i < target.chemistry.length; i++) {
        const chapterId = target.chemistry[i].chapterId;
        const isFinal = target.chemistry[i].isFinal;
        if (isFinal === true) {
            if (targetType === "Regular") {
                await db.chemistryVisionBoard.update({
                    where: {
                        studentId_chemistrySyallabusId: {
                            studentId,
                            chemistrySyallabusId: chapterId,
                        },
                    },
                    data: {
                        notes: true,
                        leacture: true,
                        ncert: true,
                        QP: true,
                    },
                });
            }
            if (targetType === "Revision") {
                await db.chemistryVisionBoard.update({
                    where: {
                        studentId_chemistrySyallabusId: {
                            studentId,
                            chemistrySyallabusId: chapterId,
                        },
                    },
                    data: {
                        revision: true,
                    },
                });
            }
        }
    }
    for (let i = 0; i < target.biology.length; i++) {
        const chapterId = target.biology[i].chapterId;
        const isFinal = target.biology[i].isFinal;
        if (isFinal === true) {
            if (targetType === "Regular") {
                await db.biologyVisionBoard.update({
                    where: {
                        studentId_biologySyallabusId: {
                            studentId,
                            biologySyallabusId: chapterId,
                        },
                    },
                    data: {
                        notes: true,
                        leacture: true,
                        ncert: true,
                        QP: true,
                    },
                });
            }
            if (targetType === "Revision") {
                await db.biologyVisionBoard.update({
                    where: {
                        studentId_biologySyallabusId: {
                            studentId,
                            biologySyallabusId: chapterId,
                        },
                    },
                    data: {
                        revision: true,
                    },
                });
            }
        }
    }
}

export default markComplete;
