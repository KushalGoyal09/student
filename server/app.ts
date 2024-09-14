import express from "express";
import {
    addMentorRouter,
    addSeniorMentorRouter,
    addStudentRouter,
    addSupervisorRouter,
    adminAuth,
    meRouter,
    studentRatingRouter,
    utilRouter,
    supervisorDetailRouter,
    supervisorUtil,
    seniorMentorRouter
} from "./router";
import "express-async-errors";
import Secret from "./utils/secrets";
import notFound from "./middleware/notFound";
import errorHandler from "./middleware/errorHandler";
const port = Secret.PORT;
const app = express();
import { config } from "dotenv";
config();

app.use(express.json());

app.use("/api/me", meRouter);
app.use("/api/addstudent", addStudentRouter);
app.use("/api/addmentor", addMentorRouter);
app.use("/api/addseniormentor", addSeniorMentorRouter);
app.use("/api/addsupervisor", addSupervisorRouter);
app.use("/api/admin", adminAuth);
app.use("/api/util", utilRouter);
app.use("/api/studentrating", studentRatingRouter);
app.use("/api/supervisordetail", supervisorDetailRouter);
app.use("/api/supervisorUtil", supervisorUtil);
app.use("/api/seniormentordetail", seniorMentorRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server listening to the port ${port}`);
});
