import { PrismaClient } from "prisma/prisma-client";
import { Response } from "express";
import { AuthRequest, Role } from "../../types";
import { z } from "zod";
import { throwUnauthorizedError } from "../../custom-error/customError";

const db = new PrismaClient();

const bodySchema = z.object({
    id: z.string(),
});

const changeTickets = async (req: AuthRequest, res: Response) => {
    const role = req.role;
    if (role !== Role.admin) {
        throwUnauthorizedError("You are not authorized to change a ticket");
        return;
    }
    const { id } = bodySchema.parse(req.body);
    await db.ticket.update({
        where: {
            id: id,
        },
        data: {
            status: true,
        },
    });

    return res
        .status(200)
        .json({ success: true, message: "Complaint closed successfully." });
};

export default changeTickets;
