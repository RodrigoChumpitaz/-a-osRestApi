"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer = __importStar(require("nodemailer"));
const env_1 = require("../config/env");
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: env_1.environment.BOT_EMAIL,
        pass: env_1.environment.BOT_PASS,
    },
    tls: {
        rejectUnauthorized: false
    }
});
const sendMail = async (req, res) => {
    const { destinatario, asunto, mensaje, link } = req.body;
    const mailOptions = {
        from: process.env.BOT_EMAIL,
        to: destinatario,
        subject: asunto,
        html: `
    <h1>Estimado/a ` + destinatario + `,</h1>
    <p>` + mensaje + `, haga clic en el siguiente enlace:</p>
    <p><a href="` + link + `">` + link + `</a></p>
  `,
    };
    try {
        // Enviamos el correo electrónico utilizando el transporter definido anteriormente
        await transporter.sendMail(mailOptions);
        res.status(200).json({
            msg: "Correo electrónico enviado correctamente",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Error al enviar el correo electrónico",
        });
    }
};
exports.sendMail = sendMail;
