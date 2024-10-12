import { PrismaClient, TargetType } from "@prisma/client";
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
        include: {
            physics: { include: { PhysicsChapter: true } },
            chemistry: { include: { ChemistryChapter: true } },
            biology: { include: { BiologyChapter: true } },
            Student: true,
        },
    });

    if (!target || !target.completed) {
        throw new Error("Target not found or not completed");
    }

    if (target.physics.length > 0) {
        for (const subjectTarget of target.physics) {
            const chapterId = subjectTarget.chapterId;
            const studentId = target.studentId;
            if (target.targetType === TargetType.Regular) {
                const incompleteRegularTargets = await db.target.count({
                    where: {
                        completed: false,
                        targetType: TargetType.Regular,
                        physics: {
                            some: { chapterId },
                        },
                        studentId,
                    },
                });
                if (incompleteRegularTargets === 0) {
                    await db.physicsVisionBoard.upsert({
                        where: {
                            studentId_physicsSyallabusId: {
                                studentId,
                                physicsSyallabusId: chapterId,
                            },
                        },
                        update: {
                            notes: true,
                            leacture: true,
                            ncert: true,
                            QP: true,
                        },
                        create: {
                            Student: { connect: { id: studentId } },
                            chapter: { connect: { id: chapterId } },
                            notes: true,
                            leacture: true,
                            ncert: true,
                            QP: true,
                            revision: false,
                            viva: false,
                        },
                    });
                }
            }

            if (target.targetType === TargetType.Revision) {
                const incompleteRevisionTargets = await db.target.count({
                    where: {
                        completed: false,
                        targetType: TargetType.Revision,
                        physics: {
                            some: { chapterId },
                        },
                        studentId,
                    },
                });
                if (incompleteRevisionTargets === 0) {
                    await db.physicsVisionBoard.upsert({
                        where: {
                            studentId_physicsSyallabusId: {
                                studentId,
                                physicsSyallabusId: chapterId,
                            },
                        },
                        update: {
                            revision: true,
                        },
                        create: {
                            Student: { connect: { id: studentId } },
                            chapter: { connect: { id: chapterId } },
                            notes: false,
                            leacture: false,
                            ncert: false,
                            QP: false,
                            revision: true,
                            viva: false,
                        },
                    });
                }
            }
        }
    }

    if (target.chemistry.length > 0) {
        for (const subjectTarget of target.chemistry) {
            const chapterId = subjectTarget.chapterId;
            const studentId = target.studentId;
            if (target.targetType === TargetType.Regular) {
                const incompleteRegularTargets = await db.target.count({
                    where: {
                        completed: false,
                        targetType: TargetType.Regular,
                        chemistry: {
                            some: { chapterId },
                        },
                        studentId,
                    },
                });
                if (incompleteRegularTargets === 0) {
                    await db.chemistryVisionBoard.upsert({
                        where: {
                            studentId_chemistrySyallabusId: {
                                studentId,
                                chemistrySyallabusId: chapterId,
                            },
                        },
                        update: {
                            notes: true,
                            leacture: true,
                            ncert: true,
                            QP: true,
                        },
                        create: {
                            Student: { connect: { id: studentId } },
                            chapter: { connect: { id: chapterId } },
                            notes: true,
                            leacture: true,
                            ncert: true,
                            QP: true,
                            revision: false,
                            viva: false,
                        },
                    });
                }
            }

            if (target.targetType === TargetType.Revision) {
                const incompleteRevisionTargets = await db.target.count({
                    where: {
                        completed: false,
                        targetType: TargetType.Revision,
                        chemistry: {
                            some: { chapterId },
                        },
                        studentId,
                    },
                });
                if (incompleteRevisionTargets === 0) {
                    await db.chemistryVisionBoard.upsert({
                        where: {
                            studentId_chemistrySyallabusId: {
                                studentId,
                                chemistrySyallabusId: chapterId,
                            },
                        },
                        update: {
                            revision: true,
                        },
                        create: {
                            Student: { connect: { id: studentId } },
                            chapter: { connect: { id: chapterId } },
                            notes: false,
                            leacture: false,
                            ncert: false,
                            QP: false,
                            revision: true,
                            viva: false,
                        },
                    });
                }
            }
        }
    }
    if (target.biology.length > 0) {
        for (const subjectTarget of target.biology
        ) {
            const chapterId = subjectTarget.chapterId;
            const studentId = target.studentId;
            if (target.targetType === TargetType.Regular) {
                const incompleteRegularTargets = await db.target.count({
                    where: {
                        completed: false,
                        targetType: TargetType.Regular,
                        biology: {
                            some: { chapterId },
                        },
                        studentId,
                    },
                });
                if (incompleteRegularTargets === 0) {
                    await db.biologyVisionBoard.upsert({
                        where: {
                            studentId_biologySyallabusId: {
                                studentId,
                                biologySyallabusId: chapterId,
                            },
                        },
                        update: {
                            notes: true,
                            leacture: true,
                            ncert: true,
                            QP: true,
                        },
                        create: {
                            Student: { connect: { id: studentId } },
                            chapter: { connect: { id: chapterId } },
                            notes: true,
                            leacture: true,
                            ncert: true,
                            QP: true,
                            revision: false,
                            viva: false,
                        },
                    });
                }
            }

            if (target.targetType === TargetType.Revision) {
                const incompleteRevisionTargets = await db.target.count({
                    where: {
                        completed: false,
                        targetType: TargetType.Revision,
                        chemistry: {
                            some: { chapterId },
                        },
                        studentId,
                    },
                });
                if (incompleteRevisionTargets === 0) {
                    await db.biologyVisionBoard.upsert({
                        where: {
                            studentId_biologySyallabusId: {
                                studentId,
                                biologySyallabusId: chapterId,
                            },
                        },
                        update: {
                            revision: true,
                        },
                        create: {
                            Student: { connect: { id: studentId } },
                            chapter: { connect: { id: chapterId } },
                            notes: false,
                            leacture: false,
                            ncert: false,
                            QP: false,
                            revision: true,
                            viva: false,
                        },
                    });
                }
            }
        }
    }
}

export default markComplete;
