import { PrismaClient } from "prisma/prisma-client";
import { Response } from "express";
import { AuthRequest } from "../../types";
import { z } from "zod";

const db = new PrismaClient();

const bodySchema = z.object({
    targetId: z.string(),
});

const deleteTarget = async (req: AuthRequest, res: Response) => {
    const { targetId } = bodySchema.parse(req.body);
    await db.target.delete({
        where: {
            id: targetId,
        },
    });
    res.json({
        success: true,
        message: "Target deleted successfully",
    });
}

export default deleteTarget;