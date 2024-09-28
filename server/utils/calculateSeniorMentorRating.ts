import { PrismaClient } from "prisma/prisma-client";
import calculateMentorRating from "./calculateMentorRating";
const db = new PrismaClient();

const calculateSeniorMentorRating = async (seniorMentorId: string) => {
    const groupMentors = await db.groupMentor.findMany({
        where: {
            seniorMentorId,
        },
        select: {
            id: true,
        },
    });
    let total = 0;
    groupMentors.forEach(async (groupMentor) => {
        total += (await calculateMentorRating(groupMentor.id, seniorMentorId))
            .overallRating;
    });
    const seniorMentorRating = total / groupMentors.length;
    return seniorMentorRating;
};

export default calculateSeniorMentorRating;
