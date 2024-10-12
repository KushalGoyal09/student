import { PrismaClient } from "prisma/prisma-client";
import { Response } from "express";
import { AuthRequest } from "../../types";
import { z } from "zod";

const db = new PrismaClient();

const bodySchema = z.object({
    targetId: z.string(),
    target: z.object({
        physics: z.array(
            z.object({
                chapterId: z.coerce.number(),
            }),
        ),
        chemistry: z.array(
            z.object({
                chapterId: z.coerce.number(),
            }),
        ),
        biology: z.array(
            z.object({
                chapterId: z.coerce.number(),
            }),
        ),
    }),
});

const editTarget = async (req: AuthRequest, res: Response) => {

}

export default editTarget;