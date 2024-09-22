import { Router } from "express";
const AdmissionRouter = Router();
import admissionForm from "./admission";
import getAllNewStudents from "./getAllNewStudents";
import getStudentFeeData from "./getStudentFeeData";
import assaignMentor from "./assaignMentor";
import authMiddleware from "../../middleware/auth";
import getFeeData from "./getFeeData";
import feeChange from "./feeChange";
import addPayment from "./addPayment";
import getKitDispatchData from "./getKitDispatchData";
import kitDispatched from "./kitDispatched";

AdmissionRouter.post("/admission", admissionForm);
AdmissionRouter.get("/students", authMiddleware, getAllNewStudents);
AdmissionRouter.get("/fee-data", authMiddleware, getStudentFeeData);
AdmissionRouter.post("/fee-data", authMiddleware, getFeeData);
AdmissionRouter.put("/update-fee-details", authMiddleware, feeChange);
AdmissionRouter.post("/add-payment", authMiddleware, addPayment);
AdmissionRouter.post("/assign-mentor", authMiddleware, assaignMentor);
AdmissionRouter.get("/kit-data", authMiddleware, getKitDispatchData);
AdmissionRouter.post("/kit-dispatch", authMiddleware, kitDispatched);

export default AdmissionRouter;
