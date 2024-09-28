import { PrismaClient } from "prisma/prisma-client";
const db = new PrismaClient();

const getWeekRecordForMentor = async (mentorId: string, startDate: string) => {
    const data = await db.week.findUnique({
        where: {
            startDate_mentorId: {
                startDate,
                mentorId,
            },
        },
        select: {
            students: {
                select: {
                    studentId: true,
                    call: {
                        select: {
                            date: true,
                            callStatus: true,
                        },
                    },
                },
            },
        },
    });
    return data;
};

export default getWeekRecordForMentor;
