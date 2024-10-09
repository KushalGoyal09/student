import { Router, static as static_ } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import createTickets from "./createTickets";
import authMiddleware from "../../middleware/auth";
import getTickets from "./getTickets";
import changeTickets from "./changeTickets";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, "uploads");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });
const ticketRouter = Router();

ticketRouter.use("/uploads", static_(path.join(__dirname, "uploads")));
ticketRouter.post(
    "/create",
    authMiddleware,
    upload.single("audio"),
    createTickets,
);
ticketRouter.get("/get", authMiddleware, getTickets);
ticketRouter.post("/close", authMiddleware, changeTickets);

export default ticketRouter;
