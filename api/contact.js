import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const contactToEmail =
  process.env.CONTACT_TO_EMAIL || "servicios_f@hotmail.com";
const contactCcEmail = process.env.CONTACT_CC_EMAIL || "";
const contactFromEmail =
  process.env.CONTACT_FROM_EMAIL || "Servicios Falcon <onboarding@resend.dev>";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildTextEmail({ nombre, telefono, correo, tipo, mensaje }) {
  return [
    "Nueva solicitud de cotizacion",
    "",
    `Nombre: ${nombre}`,
    `Telefono: ${telefono}`,
    `Correo: ${correo}`,
    `Tipo de proyecto: ${tipo}`,
    "",
    "Mensaje:",
    mensaje,
  ].join("\n");
}

function buildHtmlEmail({ nombre, telefono, correo, tipo, mensaje }) {
  const safeNombre = escapeHtml(nombre);
  const safeTelefono = escapeHtml(telefono);
  const safeCorreo = escapeHtml(correo);
  const safeTipo = escapeHtml(tipo);
  const safeMessage = escapeHtml(mensaje).replace(/\n/g, "<br />");

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
      <h2 style="margin-bottom: 16px;">Nueva solicitud de cotizacion</h2>
      <p><strong>Nombre:</strong> ${safeNombre}</p>
      <p><strong>Telefono:</strong> ${safeTelefono}</p>
      <p><strong>Correo:</strong> ${safeCorreo}</p>
      <p><strong>Tipo de proyecto:</strong> ${safeTipo}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${safeMessage}</p>
    </div>
  `;
}

function getPayload(req) {
  if (!req.body) return {};
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed.",
    });
  }

  if (!resendApiKey) {
    return res.status(500).json({
      success: false,
      message: "RESEND_API_KEY no esta configurada en Vercel.",
    });
  }

  const payload = getPayload(req);
  const nombre = payload?.nombre?.trim() || "";
  const telefono = payload?.telefono?.trim() || "";
  const correo = payload?.correo?.trim() || "";
  const tipo = payload?.tipo?.trim() || "";
  const mensaje = payload?.mensaje?.trim() || "";

  if (!nombre || !telefono || !correo || !tipo || !mensaje) {
    return res.status(400).json({
      success: false,
      message: "Completa todos los campos antes de continuar.",
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    return res.status(400).json({
      success: false,
      message: "Escribe un correo valido para continuar.",
    });
  }

  try {
    const resend = new Resend(resendApiKey);
    const recipients = [contactToEmail];

    if (contactCcEmail) {
      recipients.push(contactCcEmail);
    }

    const emailResult = await resend.emails.send({
      from: contactFromEmail,
      to: recipients,
      replyTo: correo,
      subject: `Solicitud de cotizacion - ${tipo} - ${nombre}`,
      text: buildTextEmail({ nombre, telefono, correo, tipo, mensaje }),
      html: buildHtmlEmail({ nombre, telefono, correo, tipo, mensaje }),
    });

    if (emailResult?.error) {
      return res.status(502).json({
        success: false,
        message: emailResult.error.message || "No se pudo enviar el correo.",
      });
    }

    return res.status(200).json({
      success: true,
      id: emailResult?.data?.id || null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "No se pudo procesar la solicitud.",
    });
  }
}
