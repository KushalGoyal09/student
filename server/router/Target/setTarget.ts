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
                    chapterId: z.coerce.number(),
                }),
            ),
            chemistry: z.array(
                z.object({
                    chapterId: z.coerce.number(),
                }),
            ),
            biology: z.array(
                z.object({
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
            }));

            await db.physicsTarget.createMany({
                data: physicsTargets,
            });
        }

        if (t.chemistry && t.chemistry.length > 0) {
            const chemistryTargets = t.chemistry.map((c) => ({
                chapterId: c.chapterId,
                targetId,
            }));
            await db.chemistryTarget.createMany({
                data: chemistryTargets,
            });
        }

        if (t.biology && t.biology.length > 0) {
            const biologyTargets = t.biology.map((b) => ({
                chapterId: b.chapterId,
                targetId,
            }));

            await db.biologyTarget.createMany({
                data: biologyTargets,
            });
        }
    }
    res.json({
        message: "Target set successfully",
        success: true,
    })
};

export default setTarget;