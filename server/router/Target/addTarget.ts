import { PrismaClient } from "prisma/prisma-client";
import { Response } from "express";
import { AuthRequest, Role } from "../../types";
import { throwUnauthorizedError } from "../../custom-error/customError";
import { z } from "zod";
const db = new PrismaClient();

const bodySchema = z.object({
    studentId: z.coerce.string(),
    physics: z.object({
        chapterId: z.coerce.number(),
        fromDate: z.coerce.string(),
        toDate: z.coerce.string(),
        lecturePerDay: z.coerce.number(),
    }),
    chemistry: z.object({
        chapterId: z.coerce.number(),
        fromDate: z.coerce.string(),
        toDate: z.coerce.string(),
        lecturePerDay: z.coerce.number(),
    }),
    biology: z.object({
        chapterId: z.coerce.number(),
        fromDate: z.coerce.string(),
        toDate: z.coerce.string(),
        lecturePerDay: z.coerce.number(),
    }),
});

const addTarget = async (req: AuthRequest, res: Response) => {
    // const userId = req.userId;
    // if (
    //     (req.role !== Role.groupMentor &&
    //         req.role !== Role.admin &&
    //         req.role !== Role.seniorMentor &&
    //         req.role !== Role.supervisor) ||
    //     !userId
    // ) {
    //     throwUnauthorizedError("You are not authorized to add target");
    //     return;
    // }
    // const { studentId, physics, chemistry, biology } = bodySchema.parse(
    //     req.body,
    // );
    // const student = await db.student.findUnique({
    //     where: {
    //         id: studentId,
    //     },
    //     select: {
    //         groupMentorId: true,
    //     },
    // });
    // if (!student || !student.groupMentorId) {
    //     res.status(400).json({
    //         success: false,
    //         message: "Student not found",
    //     });
    //     return;
    // }
    // const physicsTarget = await db.physicsTarget.create({
    //     data: {
    //         chapterId: physics.chapterId,
    //         fromDate: physics.fromDate,
    //         toDate: physics.toDate,
    //         lecturePerDay: physics.lecturePerDay,
    //     },
    // });
    // const chemistryTarget = await db.chemistryTarget.create({
    //     data: {
    //         chapterId: chemistry.chapterId,
    //         fromDate: chemistry.fromDate,
    //         toDate: chemistry.toDate,
    //         lecturePerDay: chemistry.lecturePerDay,
    //     },
    // });

    // const biologyTarget = await db.biologyTarget.create({
    //     data: {
    //         chapterId: biology.chapterId,
    //         fromDate: biology.fromDate,
    //         toDate: biology.toDate,
    //         lecturePerDay: biology.lecturePerDay,
    //     },
    // });
    // const target = await db.target.create({
    //     data: {
    //         studentId,
    //         mentorId: student.groupMentorId,
    //         physicsTargetId: physicsTarget.id,
    //         chemistryTargetId: chemistryTarget.id,
    //         biologyTargetId: biologyTarget.id,
    //     },
    // });
    res.json({
        success: true,
        message: "Target added successfully",
    });
};

export default addTarget;
