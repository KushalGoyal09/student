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

    // Fetch all chapters for all subjects in parallel
    const [physicsChapters, chemistryChapters, biologyChapters] =
        await Promise.all([
            prisma.physicsSyallabus.findMany(),
            prisma.chemistrySyallabus.findMany(),
            prisma.biologySyallabus.findMany(),
        ]);

    const chaptersBySubject = {
        physics: physicsChapters,
        chemistry: chemistryChapters,
        biology: biologyChapters,
    };

    // Fetch all senior mentors with their group mentors and students in a single query
    const seniorMentors = await prisma.seniorMentor.findMany({
        include: {
            GroupMentor: {
                include: {
                    Student: {
                        include: {
                            physicsVisionBoard: true,
                            ChemistryVisionBoard: true,
                            BiologyVisionBoard: true,
                        },
                    },
                },
            },
        },
    });

    // Process each subject
    for (const subject of subjects) {
        const chapters = chaptersBySubject[subject];

        // Process each chapter
        for (const chapter of chapters) {
            const chapterCompletion: SubjectOverallSyllabus = {
                chapterId: chapter.id,
                chapterName: chapter.chapterName,
                seniorMentor: [],
            };

            // Process each senior mentor
            for (const seniorMentor of seniorMentors) {
                const seniorMentorCompletion: SeniorMentorCompletion = {
                    seniorMentorUsername: seniorMentor.username,
                    seniorMentorId: seniorMentor.id,
                    seniorMentorName: seniorMentor.name,
                    totalNumberOfStudents: 0,
                    totalNumberOfStudentsWhoHaveCompletedTheChapter: 0,
                    groupMentor: [],
                };

                // Process each group mentor
                for (const groupMentor of seniorMentor.GroupMentor) {
                    const groupMentorCompletion: GroupMentorCompletion = {
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

                    // Check completion for each student using pre-fetched vision board data
                    for (const student of groupMentor.Student) {
                        const visionBoard = getVisionBoardFromStudent(
                            student,
                            subject,
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

function getVisionBoardFromStudent(
    student: any,
    subject: Subject,
    chapterId: number,
) {
    const visionBoardMap = {
        physics: student.physicsVisionBoard?.find(
            (board: any) => board.physicsSyallabusId === chapterId,
        ),
        chemistry: student.chemistryVisionBoard?.find(
            (board: any) => board.chemistrySyallabusId === chapterId,
        ),
        biology: student.biologyVisionBoard?.find(
            (board: any) => board.biologySyallabusId === chapterId,
        ),
    };

    return visionBoardMap[subject];
}

// Interfaces remain the same...
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
    students: Student[];
}

interface OverallSyllabusResponse {
    physics: SubjectOverallSyllabus[];
    chemistry: SubjectOverallSyllabus[];
    biology: SubjectOverallSyllabus[];
}

export default getOverall;
