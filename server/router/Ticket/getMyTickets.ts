import { PrismaClient } from "prisma/prisma-client";
import { Response } from "express";
import { AuthRequest, Role } from "../../types";
import { throwUnauthorizedError } from "../../custom-error/customError";

const db = new PrismaClient();

interface Ticket {
    id: string;
    subject: string;
    explaination: string | null;
    audioFile: string | null;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
}

interface TicketResponse {
    success: true;
    data: Ticket[]
}

const getMyTickets = async (req: AuthRequest, res: Response<TicketResponse>) => {
    const userId = req.userId;
    if(!userId) {
        throwUnauthorizedError("User not found");
        return;
    }

    const tickets = await db.ticket.findMany({
        where: {
            craetedByUserId: userId
        },
        select: {
            id: true,
            subject: true,
            explaination: true,
            audioFile: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
        orderBy: {
            updatedAt: "desc"
        }
    });
    res.status(200).json({
        data: tickets,
        success: true,
    });
};

export default getMyTickets;
