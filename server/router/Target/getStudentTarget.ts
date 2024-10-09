import { PrismaClient } from "prisma/prisma-client";
import { Response } from "express";
import { AuthRequest, Role } from "../../types";
import { throwUnauthorizedError } from "../../custom-error/customError";
import { z } from "zod";

const db = new PrismaClient();

const bodtSchema = z.object({
    studentId: z.string(),
    completed: z.coerce.boolean(),
});

const getStudentTarget = async (req: AuthRequest, res: Response) => {
    // if (
    //     req.role !== Role.groupMentor &&
    //     req.role !== Role.admin &&
    //     req.role !== Role.seniorMentor &&
    //     req.role !== Role.supervisor
    // ) {
    //     throwUnauthorizedError("You are not authorized to get targets");
    //     return;
    // }
    // const { studentId, completed } = bodtSchema.parse(req.body);
    // const targets = await db.target.findMany({
    //     where: {
    //         studentId,
    //         completed,
    //     },
    //     select: {
    //         id: true,
    //         completed: true,
    //         studentId: true,
    //         physics: {
    //             select: {
    //                 PhysicsChapter: {
    //                     select: {
    //                         chapterName: true,
    //                     },
    //                 },
    //                 fromDate: true,
    //                 toDate: true,
    //                 lecturePerDay: true,
    //             },
    //         },
    //         chemistry: {
    //             select: {
    //                 ChemistryChapter: {
    //                     select: {
    //                         chapterName: true,
    //                     },
    //                 },
    //                 fromDate: true,
    //                 toDate: true,
    //                 lecturePerDay: true,
    //             },
    //         },
    //         biology: {
    //             select: {
    //                 BiologyChapter: {
    //                     select: {
    //                         chapterName: true,
    //                     },
    //                 },
    //                 fromDate: true,
    //                 toDate: true,
    //                 lecturePerDay: true,
    //             },
    //         },
    //     },
    // });
    // const data = targets.map((target) => {
    //     return {
    //         targetId: target.id,
    //         completed: target.completed,
    //         studentId: target.studentId,
    //         physics: {
    //             chapter: target.physics.PhysicsChapter.chapterName,
    //             fromDate: target.physics.fromDate,
    //             toDate: target.physics.toDate,
    //             lecturePerDay: target.physics.lecturePerDay,
    //         },
    //         chemistry: {
    //             chapter: target.chemistry.ChemistryChapter.chapterName,
    //             fromDate: target.chemistry.fromDate,
    //             toDate: target.chemistry.toDate,
    //             lecturePerDay: target.chemistry.lecturePerDay,
    //         },
    //         biology: {
    //             chapter: target.biology.BiologyChapter.chapterName,
    //             fromDate: target.biology.fromDate,
    //             toDate: target.biology.toDate,
    //             lecturePerDay: target.biology.lecturePerDay,
    //         },
    //     };
    // });
    res.json({
        success: true,
    });
};

export default getStudentTarget;
