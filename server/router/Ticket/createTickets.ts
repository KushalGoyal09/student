import { Response } from "express";
import { PrismaClient } from "prisma/prisma-client";
import { AuthRequest, Role } from "../../types";
import { z } from "zod";
import { throwUnauthorizedError } from "../../custom-error/customError";
const db = new PrismaClient();

const bodySchema = z.object({
    subject: z.string(),
    explanation: z.string().optional(),
});

const createTickets = async (req: AuthRequest, res: Response) => {
    const role = req.role;
    const userId = req.userId;
    if (
        role !== Role.groupMentor &&
        role !== Role.supervisor &&
        role !== Role.seniorMentor
    ) {
        throwUnauthorizedError("You are not authorized to create a ticket");
        return;
    }
    if (!userId) {
        throwUnauthorizedError("You are not authorized to create a ticket");
        return;
    }
    const { subject, explanation } = bodySchema.parse(req.body);
    const audioFile = req.file;
    if (audioFile) {
        console.log("Audio file saved:", audioFile.filename);
    }
    await db.ticket.create({
        data: {
            craetedByUserId: userId,
            createdByRole:
                role === Role.groupMentor
                    ? "GroupMentor"
                    : role === Role.seniorMentor
                      ? "SeniorMentor"
                      : "Supervisor",
            subject: subject,
            explaination: explanation,
            audioFile: audioFile ? audioFile.filename : null,
        },
    });

    return res
        .status(200)
        .json({ success: true, message: "Complaint submitted successfully." });
};

export default createTickets;
