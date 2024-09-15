import express from "express";
import {
    meRouter,
    studentRatingRouter,
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
import loginRouter from "./router/Login";
import AddRouter from "./router/Add";
import utilRouter from "./router/Util";
import adminRouter from "./router/Admin";
config();

app.use(express.json());

app.use("/api/me", meRouter);
app.use("/api/login", loginRouter);
app.use("/api/add", AddRouter);
app.use("/api/util", utilRouter);
app.use("/api/admin", adminRouter);
app.use("/api/studentrating", studentRatingRouter);
app.use("/api/supervisordetail", supervisorDetailRouter);
app.use("/api/supervisorUtil", supervisorUtil);
app.use("/api/seniormentordetail", seniorMentorRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server listening to the port ${port}`);
});
