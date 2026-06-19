import nodemailer from "nodemailer";
import crypto from "crypto";
import jsonwebtoken from "jsonwebtoken";
import { config } from "../../../config.js";

const generateVerificationCode = () => {
  return crypto.randomBytes(3).toString("hex").toUpperCase();
};

const generateToken = (payload, expiresIn = "15m") => {
  return jsonwebtoken.sign(payload, config.JWT.secret, { expiresIn });
};

const verifyToken = (token) => {
  return jsonwebtoken.verify(token, config.JWT.secret);
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.email.user_email,
    pass: config.email.user_password,
  },
});

const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: `"DayReady" <${config.email.user_email}>`,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("sendEmail error:", error);
    throw new Error("No se pudo enviar el correo de verificación.");
  }
};

const HTMLVerificationEmail = (code) => `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#fff5ee;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0"
               style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 16px rgba(255,140,0,.15);">
          <tr>
            <td style="background:linear-gradient(135deg,#FF7A00,#FF9E40);padding:36px;text-align:center;">
              <h1 style="margin:0;color:#fff;font-size:26px;letter-spacing:1px;font-weight:800;">DayReady</h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,.9);font-size:13px;">Tu pedido, listo cuando lo necesitas</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 48px;text-align:center;">
              <h2 style="margin:0 0 12px;color:#1a1a1a;font-size:20px;">Verifica tu correo</h2>
              <p style="margin:0 0 32px;color:#666;font-size:15px;line-height:1.6;">
                Usa el siguiente código para completar tu registro. Expira en <strong style="color:#FF7A00;">15 minutos</strong>.
              </p>
              <div style="display:inline-block;background:#fff5ee;border:2px dashed #FF7A00;
                          border-radius:12px;padding:20px 48px;margin-bottom:32px;">
                <span style="font-size:32px;font-weight:800;letter-spacing:8px;color:#FF7A00;">
                  ${code}
                </span>
              </div>
              <p style="margin:0;color:#999;font-size:13px;">
                Si no solicitaste esto, puedes ignorar este mensaje.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#fff5ee;padding:18px;text-align:center;border-top:1px solid #ffe4cc;">
              <p style="margin:0;color:#FF9E40;font-size:12px;font-weight:600;">© 2026 DayReady</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const HTMLRecoveryEmail = (code) => `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#fff5ee;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0"
               style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 16px rgba(255,140,0,.15);">
          <tr>
            <td style="background:linear-gradient(135deg,#FF7A00,#FF9E40);padding:36px;text-align:center;">
              <h1 style="margin:0;color:#fff;font-size:26px;letter-spacing:1px;font-weight:800;">DayReady</h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,.9);font-size:13px;">Tu pedido, listo cuando lo necesitas</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 48px;text-align:center;">
              <h2 style="margin:0 0 12px;color:#1a1a1a;font-size:20px;">Recuperación de contraseña</h2>
              <p style="margin:0 0 32px;color:#666;font-size:15px;line-height:1.6;">
                Usa el siguiente código para restablecer tu contraseña. Expira en <strong style="color:#FF7A00;">15 minutos</strong>.
              </p>
              <div style="display:inline-block;background:#fff5ee;border:2px dashed #FF7A00;
                          border-radius:12px;padding:20px 48px;margin-bottom:32px;">
                <span style="font-size:32px;font-weight:800;letter-spacing:8px;color:#FF7A00;">
                  ${code}
                </span>
              </div>
              <p style="margin:0;color:#999;font-size:13px;">
                Si no solicitaste este cambio, por favor ignora este correo.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#fff5ee;padding:18px;text-align:center;border-top:1px solid #ffe4cc;">
              <p style="margin:0;color:#FF9E40;font-size:12px;font-weight:600;">© 2026 DayReady</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const HTMLInvitationEmail = (link, roleLabel) => `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#fff5ee;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0"
               style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 16px rgba(255,140,0,.15);">
          <tr>
            <td style="background:linear-gradient(135deg,#FF7A00,#FF9E40);padding:36px;text-align:center;">
              <h1 style="margin:0;color:#fff;font-size:26px;letter-spacing:1px;font-weight:800;">DayReady</h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,.9);font-size:13px;">Tu pedido, listo cuando lo necesitas</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 48px;text-align:center;">
              <h2 style="margin:0 0 12px;color:#1a1a1a;font-size:20px;">Has sido invitado</h2>
              <p style="margin:0 0 32px;color:#666;font-size:15px;line-height:1.6;">
                Fuiste invitado a unirte a DayReady como <strong style="color:#FF7A00;">${roleLabel}</strong>.
                Haz clic en el botón para completar tu registro. Este enlace expira en <strong style="color:#FF7A00;">24 horas</strong>.
              </p>
              <a href="${link}" target="_blank"
                 style="display:inline-block;background:linear-gradient(135deg,#FF7A00,#FF9E40);color:#fff;
                        text-decoration:none;font-weight:700;font-size:15px;border-radius:10px;
                        padding:16px 40px;margin-bottom:24px;">
                Completar registro
              </a>
              <p style="margin:0;color:#999;font-size:13px;">
                Si no esperabas esta invitación, puedes ignorar este correo.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#fff5ee;padding:18px;text-align:center;border-top:1px solid #ffe4cc;">
              <p style="margin:0;color:#FF9E40;font-size:12px;font-weight:600;">© 2026 DayReady</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export default {
  generateVerificationCode,
  generateToken,
  verifyToken,
  sendEmail,
  HTMLVerificationEmail,
  HTMLRecoveryEmail,
  HTMLInvitationEmail,
};