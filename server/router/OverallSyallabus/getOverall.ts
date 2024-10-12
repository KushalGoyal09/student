import { PrismaClient } from "@prisma/client";
import { Response } from "express";
import { AuthRequest, Role } from "../../types";
import { throwUnauthorizedError } from "../../custom-error/customError";

const prisma = new PrismaClient();

type Subject = "physics" | "chemistry" | "biology";

const getOverall = async (req: AuthRequest, res: Response) => {
    if (req.role !== Role.admin) {
        throwUnauthorizedError("You are not authorized to access this route");
        return;
    }
    const data = await getOverallSyllabusCompletion();
    res.json({
        success: true,
        data,
    });
};

async function getOverallSyllabusCompletion(): Promise<OverallSyllabusResponse> {
    const subjects: Subject[] = ["physics", "chemistry", "biology"];
    const result: OverallSyllabusResponse = {
        physics: [],
        chemistry: [],
        biology: [],
    };

    for (const subject of subjects) {
        const chapters = await getChapters(subject);

        for (const chapter of chapters) {
            const seniorMentors = await prisma.seniorMentor.findMany({
                include: {
                    GroupMentor: {
                        include: {
                            Student: true,
                        },
                    },
                },
            });

            const chapterCompletion: SubjectOverallSyllabus = {
                chapterId: chapter.id,
                chapterName: chapter.chapterName,
                seniorMentor: [],
            };

            for (const seniorMentor of seniorMentors) {
                const seniorMentorCompletion: SeniorMentorCompletion = {
                    seniorMentorUsername: seniorMentor.username,
                    seniorMentorId: seniorMentor.id,
                    seniorMentorName: seniorMentor.name,
                    totalNumberOfStudents: 0,
                    totalNumberOfStudentsWhoHaveCompletedTheChapter: 0,
                    groupMentor: [],
                };

                for (const groupMentor of seniorMentor.GroupMentor) {
                    const groupMentorCompletion = {
                        groupMentorUsername: groupMentor.username,
                        groupMentorId: groupMentor.id,
                        groupMentorName: groupMentor.name,
                        totalNumberOfStudents: groupMentor.Student.length,
                        totalNumberOfStudentsWhoHaveCompletedTheChapter: 0,
                        students: groupMentor.Student.map((student) => ({
                            name: student.name,
                        })),
                    };

                    seniorMentorCompletion.totalNumberOfStudents +=
                        groupMentor.Student.length;

                    for (const student of groupMentor.Student) {
                        const visionBoard = await getVisionBoard(
                            subject,
                            student.id,
                            chapter.id,
                        );

                        if (
                            visionBoard &&
                            visionBoard.notes &&
                            visionBoard.leacture &&
                            visionBoard.ncert &&
                            visionBoard.QP
                        ) {
                            groupMentorCompletion.totalNumberOfStudentsWhoHaveCompletedTheChapter++;
                            seniorMentorCompletion.totalNumberOfStudentsWhoHaveCompletedTheChapter++;
                        }
                    }

                    seniorMentorCompletion.groupMentor.push(
                        groupMentorCompletion,
                    );
                }

                chapterCompletion.seniorMentor.push(seniorMentorCompletion);
            }

            result[subject].push(chapterCompletion);
        }
    }

    return result;
}

async function getChapters(subject: Subject) {
    switch (subject) {
        case "physics":
            return prisma.physicsSyallabus.findMany();
        case "chemistry":
            return prisma.chemistrySyallabus.findMany();
        case "biology":
            return prisma.biologySyallabus.findMany();
    }
}

async function getVisionBoard(
    subject: Subject,
    studentId: string,
    chapterId: number,
) {
    switch (subject) {
        case "physics":
            return prisma.physicsVisionBoard.findUnique({
                where: {
                    studentId_physicsSyallabusId: {
                        studentId,
                        physicsSyallabusId: chapterId,
                    },
                },
            });
        case "chemistry":
            return prisma.chemistryVisionBoard.findUnique({
                where: {
                    studentId_chemistrySyallabusId: {
                        studentId,
                        chemistrySyallabusId: chapterId,
                    },
                },
            });
        case "biology":
            return prisma.biologyVisionBoard.findUnique({
                where: {
                    studentId_biologySyallabusId: {
                        studentId,
                        biologySyallabusId: chapterId,
                    },
                },
            });
    }
}

interface SubjectOverallSyllabus {
    chapterId: number;
    chapterName: string;
    seniorMentor: SeniorMentorCompletion[];
}

interface SeniorMentorCompletion {
    seniorMentorUsername: string;
    seniorMentorId: string;
    seniorMentorName: string;
    totalNumberOfStudents: number;
    totalNumberOfStudentsWhoHaveCompletedTheChapter: number;
    groupMentor: GroupMentorCompletion[];
}

interface Student {
    name: string;
}

interface GroupMentorCompletion {
    groupMentorUsername: string;
    groupMentorId: string;
    groupMentorName: string;
    totalNumberOfStudents: number;
    totalNumberOfStudentsWhoHaveCompletedTheChapter: number;
    students: Student[]
}

interface OverallSyllabusResponse {
    physics: SubjectOverallSyllabus[];
    chemistry: SubjectOverallSyllabus[];
    biology: SubjectOverallSyllabus[];
}

export default getOverall;
