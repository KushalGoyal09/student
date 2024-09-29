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
    if (groupMentors.length === 0) {
        return 0;
    }
    let total = 0;
    const mentorRatings = await Promise.all(
        groupMentors.map(async (groupMentor) => {
            const mentorRating = await calculateMentorRating(groupMentor.id);
            return mentorRating.overallRating;
        }),
    );
    total = mentorRatings.reduce((acc, rating) => acc + rating, 0);
    const seniorMentorRating = total / groupMentors.length;
    return seniorMentorRating;
};

export default calculateSeniorMentorRating;
