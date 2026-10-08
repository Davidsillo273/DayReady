import nodemailer from "nodemailer";
import { config } from "../../../config.js";

// Render (plan Free) bloquea los puertos SMTP, así que en producción el
// correo sale por la API HTTP de Mailjet. Si no hay llaves de Mailjet
// (ej. en local), se usa Gmail por SMTP como antes.
const { mailjet } = config;
const useMailjet = Boolean(mailjet.api_key && mailjet.api_secret);

const transporter = useMailjet
  ? null
  : nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.email.user_email,
        pass: config.email.user_password,
      },
    });

const sendWithMailjet = async (to, subject, html) => {
  const auth = Buffer.from(`${mailjet.api_key}:${mailjet.api_secret}`).toString("base64");
  const response = await fetch("https://api.mailjet.com/v3.1/send", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Basic ${auth}` },
    body: JSON.stringify({
      Messages: [
        {
          From: { Email: mailjet.from_email, Name: mailjet.from_name },
          To: [{ Email: to }],
          Subject: subject,
          HTMLPart: html,
        },
      ],
    }),
  });

  const data = await response.json();
  if (!response.ok || data.Messages?.[0]?.Status !== "success") {
    throw new Error(`Mailjet respondió ${response.status}: ${JSON.stringify(data)}`);
  }
  return data;
};

export const deliverEmail = (to, subject, html) => {
  if (useMailjet) return sendWithMailjet(to, subject, html);
  return transporter.sendMail({
    from: `"DayReady" <${config.email.user_email}>`,
    to,
    subject,
    html,
  });
};
