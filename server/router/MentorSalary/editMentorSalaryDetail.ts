import { PrismaClient } from "prisma/prisma-client";
import { Response } from "express";
import { AuthRequest, Role } from "../../types";
import { throwUnauthorizedError } from "../../custom-error/customError";
import { z } from "zod";
const db = new PrismaClient();

const bodySchema = z.object({
    month: z.enum([
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ]),
    year: z.coerce.number(),
    userId: z.string(),
    basePay: z.coerce.number(),
    perStudentPay: z.coerce.number(),
    paid: z.boolean(),
    mentorType: z.enum(["GroupMentor", "SeniorMentor"]),
});

const editMentorSalaryDetail = async (req: AuthRequest, res: Response) => {
    const role = req.role;
    if (role !== Role.admin) {
        throwUnauthorizedError(
            "You are not authorized to access this resource",
        );
        return;
    }
    const { userId, month, year, basePay, perStudentPay, paid, mentorType } =
        bodySchema.parse(req.body);
    const mentorSalary = await db.mentorSalary.updateMany({
        where: {
            month,
            year,
            userId,
        },
        data: {
            basePay,
            perStudentPay,
            paid,
        },
    });
    if (mentorSalary.count === 0) {
        await db.mentorSalary.create({
            data: {
                month,
                year,
                userId,
                Role: mentorType,
                basePay,
                perStudentPay,
            },
        });
    }
    res.json({
        success: true,
    });
};

export default editMentorSalaryDetail;
