import { PrismaClient } from "prisma/prisma-client";
import { Response } from "express";
import { AuthRequest, Role } from "../../types";
import { throwUnauthorizedError } from "../../custom-error/customError";

const db = new PrismaClient();

interface TicketResponse {
    id: string;
    subject: string;
    explanation: string | null;
    audioFile: string | null;
    createdByRole: Role;
    createdByUserId: string;
    createdByUsername: string;
    createdByName: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const getTickets = async (req: AuthRequest, res: Response) => {
    if (req.role !== Role.admin) {
        throwUnauthorizedError("You are not authorized to get tickets");
        return;
    }
    const tickets = await db.ticket.findMany();
    const responseTickets: TicketResponse[] = await Promise.all(
        tickets.map(async (ticket) => {
            let userInfo: { username: string; name: string } | null = null;

            if (ticket.createdByRole === "Supervisor") {
                userInfo = await db.supervisor.findUnique({
                    where: {
                        id: ticket.craetedByUserId,
                    },
                    select: {
                        username: true,
                        name: true,
                    },
                });
            } else if (ticket.createdByRole === "GroupMentor") {
                userInfo = await db.groupMentor.findUnique({
                    where: {
                        id: ticket.craetedByUserId,
                    },
                    select: {
                        username: true,
                        name: true,
                    },
                });
            } else if (ticket.createdByRole === "SeniorMentor") {
                userInfo = await db.seniorMentor.findUnique({
                    where: {
                        id: ticket.craetedByUserId,
                    },
                    select: {
                        username: true,
                        name: true,
                    },
                });
            }

            return {
                id: ticket.id,
                subject: ticket.subject,
                explanation: ticket.explaination,
                audioFile: ticket.audioFile,
                status: ticket.status,
                createdByRole:
                    ticket.createdByRole === "Supervisor"
                        ? Role.supervisor
                        : ticket.createdByRole === "GroupMentor"
                          ? Role.groupMentor
                          : Role.seniorMentor,
                createdByUserId: ticket.craetedByUserId,
                createdByUsername: userInfo?.username || "Unknown",
                createdByName: userInfo?.name || "Unknown",
                createdAt: ticket.createdAt,
                updatedAt: ticket.updatedAt,
            };
        }),
    );
    res.status(200).json({
        data: responseTickets,
        success: true,
    });
};

export default getTickets;
