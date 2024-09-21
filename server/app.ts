import express from "express";
import "express-async-errors";
import Secret from "./utils/secrets";
import notFound from "./middleware/notFound";
import errorHandler from "./middleware/errorHandler";
const port = Secret.PORT;
const app = express();
import { config } from "dotenv";
import loginRouter from "./router/Login";
import addRouter from "./router/Add";
import adminRouter from "./router/Admin";
import meRouter from "./router/Me/me";
import detailRouter from "./router/Detail";
import profileRouter from "./router/Profile";
config();

app.use(express.json());

app.use("/api/me", meRouter);
app.use("/api/login", loginRouter);
app.use("/api/add", addRouter);
app.use("/api/admin", adminRouter);
app.use("/api/detail", detailRouter);
app.use("/api/profile", profileRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server listening to the port ${port}`);
});
