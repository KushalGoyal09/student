import { PrismaClient, Month } from "prisma/prisma-client";
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
    totalSalary: z.number(),
    bonus: z.number(),
    paid: z.boolean(),
    mentorType: z.enum(["GroupMentor", "SeniorMentor", "Employee"]),
});

const editMentorSalaryDetail = async (req: AuthRequest, res: Response) => {
    const role = req.role;
    if (role !== Role.admin) {
        throwUnauthorizedError(
            "You are not authorized to access this resource",
        );
        return;
    }
    const { userId, month, year, totalSalary, bonus, paid, mentorType } =
        bodySchema.parse(req.body);
    const mentorSalary = await db.mentorSalary.updateMany({
        where: {
            month,
            year,
            userId,
            Role: mentorType,
        },
        data: {
            totalSalary,
            bonus,
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
                totalSalary,
                bonus,
                paid,
            },
        });
    }
    res.json({
        success: true,
    });
};

export default editMentorSalaryDetail;
