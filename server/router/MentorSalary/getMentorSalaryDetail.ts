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
    salaryRole: z.enum(["GroupMentor", "SeniorMentor", "Employee"]),
});

const getMentorSalaryDetail = async (req: AuthRequest, res: Response) => {
    const role = req.role;
    if (role !== Role.admin) {
        throwUnauthorizedError(
            "You are not authorized to access this resource",
        );
        return;
    }
    const { month, year,salaryRole } = bodySchema.parse(req.body);
    const mentorSalary = await db.mentorSalary.findMany({
        where: {
            month,
            year,
            Role: salaryRole,
        },
        select: {
            id: true,
            bonus: true,
            totalSalary: true,
            paid: true,
            userId: true,
        },
    });
    res.json({
        success: true,
        data: mentorSalary,
    });
};

export default getMentorSalaryDetail;
