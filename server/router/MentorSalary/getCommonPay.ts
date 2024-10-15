import { PrismaClient, SalaryRole } from "prisma/prisma-client";
import { Response } from "express";
import { AuthRequest, Role } from "../../types";
import { throwUnauthorizedError } from "../../custom-error/customError";
import { z } from "zod";
const db = new PrismaClient();

const bodySchema = z.object({
    salaryRole: z.enum(["GroupMentor", "SeniorMentor", "Employee"]),
});

const getCommonPay = async (req: AuthRequest, res: Response) => {
    const role = req.role;
    if (role !== Role.admin) {
        throwUnauthorizedError(
            "You are not authorized to access this resource",
        );
        return;
    }
    const { salaryRole } = bodySchema.parse(req.body);
    const data = await db.salary.findUnique({
        where: {
            Role: salaryRole,
        },
        select: {
            perAj: true,
            perAjLess: true,
            perAjMore: true,
            baseSalary: true,
            payAccordingToRating: true,
        },
    });
    res.json({
        success: true,
        data,
    });
};

export default getCommonPay;
