import express from "express";
import "dotenv/config";
import "express-async-errors";
import Secret from "./utils/secrets";
import notFound from "./middleware/notFound";
import errorHandler from "./middleware/errorHandler";
const port = Secret.PORT;
const app = express();
import loginRouter from "./router/Login";
import addRouter from "./router/Add";
import adminRouter from "./router/Admin";
import meRouter from "./router/Me/me";
import detailRouter from "./router/Detail";
import profileRouter from "./router/Profile";
import admissionRouter from "./router/NewStudent";
import callRouter from "./router/Call";
import testRouter from "./router/test";
import syallabusRouter from "./router/Syallabus";

app.use(express.json());

app.use("/test", testRouter)
app.use("/api/me", meRouter);
app.use("/api/login", loginRouter);
app.use("/api/add", addRouter);
app.use("/api/admin", adminRouter);
app.use("/api/detail", detailRouter);
app.use("/api/profile", profileRouter);
app.use("/api/new", admissionRouter);
app.use("/api/call", callRouter);
app.use("/api/syllabus", syallabusRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server listening to the port ${port}`);
});
