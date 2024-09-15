import { PrismaClient } from "prisma/prisma-client";
const db = new PrismaClient();
import { Response } from "express";
import { AuthRequest, Role } from "../../types";
import { throwUnauthorizedError } from "../../custom-error/customError";

const getAllSeniorMentor = (req: AuthRequest, res: Response) => {
    if (req.role !== Role.admin) {
        throwUnauthorizedError("You are not authorized to get all supervisors");
        return;
    }
    db.seniorMentor
        .findMany({
            select: {
                id: true,
                name: true,
                username: true,
            },
            orderBy: {
                name: "asc",
            },
        })
        .then((data) => {
            res.json({
                success: true,
                data,
            });
        })
        .catch((error) => {
            res.json({
                success: false,
                message: "Something went wrong",
            });
        });
};

export default getAllSeniorMentor;