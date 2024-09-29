import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
import { z } from "zod";

const bodySchema = z.object({
    email: z.coerce.string(),
    phoneNumber: z.coerce.string(),
    bonding: z.coerce.number().int(),
    targetAssaigningAndChecking: z.coerce.number().int(),
    calling: z.coerce.number().int(),
    seriousness: z.coerce.number().int(),
    exceptation: z.string(),
});

const studentRating = async (req: Request, res: Response) => {
    try {
        const parsedData = bodySchema.safeParse(req.body);
        if (parsedData.success === false) {
            console.log(parsedData.error);
            res.status(400).json({
                success: false,
                message: "Wrong Inputs",
            });
            return;
        }
        const {
            bonding,
            targetAssaigningAndChecking,
            calling,
            seriousness,
            exceptation,
            phoneNumber,
        } = parsedData.data;
        const student = await db.student.findUnique({
            where: {
                whattsapNumber: phoneNumber,
            },
            select: {
                id: true,
                groupMentorId: true,
            },
        });
        if (!student || !student.groupMentorId) {
            res.status(404).json({
                success: false,
                message: "Student is not found",
            });
            return;
        }
        await db.ratingByStudent.upsert({
            where: {
                studentId_groupMentorId: {
                    studentId: student.id,
                    groupMentorId: student.groupMentorId,
                },
            },
            create: {
                bonding,
                targetAssaigningAndChecking,
                calling,
                seriousness,
                exceptation,
                studentId: student.id,
                groupMentorId: student.groupMentorId,
            },
            update: {
                bonding,
                targetAssaigningAndChecking,
                calling,
                seriousness,
                exceptation,
            },
        });
    } catch (error) {
        res.status(500).json({
            data: error,
        });
    }
};

export default studentRating;

// function onSubmit(e) {
//     var url = 'https://backend-student.kushalgoyal.tech/api/rating/student';
//     // var url = "https://smee.io/s65RZg6a6T2Qlu";
//     var form = FormApp.openById('1B8LszuZ6HMPQnvSl-1tWIDdlk2s-7rA41wMff8f3k4E');
//     var formResponses = form.getResponses();
//     var formResponse = formResponses[formResponses.length - 1];
//     var itemResponses = formResponse.getItemResponses();
//     var payload = {
//       email: itemResponses[0].getResponse(),
//       phoneNumber: itemResponses[1].getResponse(),
//       bonding: itemResponses[2].getResponse(),
//       targetAssaigningAndChecking: itemResponses[3].getResponse(),
//       calling: itemResponses[4].getResponse(),
//       seriousness: itemResponses[5].getResponse(),
//       exceptation: itemResponses[6].getResponse(),
//     }
//     UrlFetchApp.fetch(url, {
//       'method': 'post',
//       'contentType': 'application/json',
//       'payload': JSON.stringify(payload)
//     });

//   }
