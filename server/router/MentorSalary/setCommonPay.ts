import { PrismaClient, SalaryRole } from "prisma/prisma-client";
import { Response } from "express";
import { AuthRequest, Role } from "../../types";
import { throwUnauthorizedError } from "../../custom-error/customError";
import { z } from "zod";
const db = new PrismaClient();

const bodySchema = z.object({
    salaryRole: z.enum(["GroupMentor", "SeniorMentor", "Employee"]),
    perAj: z.number(),
    perAjLess: z.number(),
    perAjMore: z.number(),
    baseSalary: z.number(),
    payAccordingToRating: z.boolean(),
});

const setCommonPay = async (req: AuthRequest, res: Response) => {
    const role = req.role;
    if (role !== Role.admin) {
        throwUnauthorizedError(
            "You are not authorized to access this resource",
        );
        return;
    }
    const {
        salaryRole,
        perAj,
        perAjLess,
        perAjMore,
        payAccordingToRating,
        baseSalary,
    } = bodySchema.parse(req.body);
    const data = await db.salary.upsert({
        where: {
            Role: salaryRole,
        },
        update: {
            perAj,
            perAjLess,
            perAjMore,
            baseSalary,
            payAccordingToRating,
        },
        create: {
            Role: salaryRole,
            perAj,
            perAjLess,
            perAjMore,
            baseSalary,
            payAccordingToRating,
        },
    });
    res.json({
        success: true,
        data,
    });
};

export default setCommonPay;
