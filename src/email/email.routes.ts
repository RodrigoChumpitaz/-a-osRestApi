import { Router }  from "express";
import { sendMail } from "./EmailBot";

const router = Router();

router.post('/enviar-email', sendMail)

export default router;