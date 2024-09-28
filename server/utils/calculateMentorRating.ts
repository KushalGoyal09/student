import { PrismaClient } from "prisma/prisma-client";
const db = new PrismaClient();

const calculateMentorRating = async (
    groupMentorId: string,
    supervisorId: string,
) => {
    const mentorRatingBySupervisor = await db.ratingBySupervisor.findUnique({
        where: {
            supervisorId_groupMentorId: {
                groupMentorId,
                supervisorId,
            },
        },
        select: {
            status: true,
            meeting: true,
            calling: true,
            responsibility: true,
            availability: true,
            targetAssaigning: true,
            targetChecking: true,
        },
    });
    let supervisorRating = 0;
    if (mentorRatingBySupervisor) {
        supervisorRating =
            (mentorRatingBySupervisor.status +
                mentorRatingBySupervisor.meeting +
                mentorRatingBySupervisor.calling +
                mentorRatingBySupervisor.responsibility +
                mentorRatingBySupervisor.availability +
                mentorRatingBySupervisor.targetAssaigning +
                mentorRatingBySupervisor.targetChecking) /
            7;
    }
    const mentorRatingByStudnets = await db.ratingByStudent.findMany({
        where: {
            groupMentorId,
        },
        select: {
            bonding: true,
            targetAssaigningAndChecking: true,
            calling: true,
            seriousness: true,
        },
    });
    let total = 0;
    let totalFactors = 0;
    mentorRatingByStudnets.forEach((rating) => {
        total +=
            rating.calling +
            rating.bonding +
            rating.targetAssaigningAndChecking +
            rating.seriousness;
        totalFactors += 4;
    });
    let studentsRating = 0;
    if (totalFactors !== 0) {
        studentsRating = total / totalFactors;
    }
    const overallRating = (supervisorRating + studentsRating) / 2;
    return {
        overallRating,
        supervisorRating,
        studentsRating,
    };
};

export default calculateMentorRating;
