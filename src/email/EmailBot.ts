import { Request, Response } from "express";
import express from "express";
import * as nodemailer from "nodemailer";
import * as bodyParser from "body-parser";
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BOT_EMAIL,
    pass: process.env.BOT_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

export const sendMail = async (req: Request, res: Response) => {
  const { destinatario, asunto, mensaje, link } = req.body;

  const mailOptions = {
    from: process.env.BOT_EMAIL,
    to: destinatario,
    subject: asunto,
    html: `
    <h1>Estimado/a `+destinatario+`,</h1>
    <p>`+mensaje+`, haga clic en el siguiente enlace:</p>
    <p><a href="`+link+`">`+link+`</a></p>
  `,
  };
  try {
    // Enviamos el correo electrónico utilizando el transporter definido anteriormente
    await transporter.sendMail(mailOptions);
    res.status(200).send("Correo electrónico enviado correctamente");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error al enviar el correo electrónico");
  }
};
