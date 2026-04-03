import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const contactToEmail =
  process.env.CONTACT_TO_EMAIL || "servicios_f@hotmail.com";
const contactCcEmail = process.env.CONTACT_CC_EMAIL || "";
const contactFromEmail =
  process.env.CONTACT_FROM_EMAIL || "Servicios Falcon <onboarding@resend.dev>";

function escapeHtml(value) {
  return value
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

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });
}

export default async function handler(request) {
  if (request.method !== "POST") {
    return jsonResponse({ success: false, message: "Method not allowed." }, 405);
  }

  if (!resendApiKey) {
    return jsonResponse(
      {
        success: false,
        message: "RESEND_API_KEY no esta configurada en Vercel.",
      },
      500,
    );
  }

  let payload;

  try {
    payload = await request.json();
  } catch {
    return jsonResponse(
      {
        success: false,
        message: "No se pudo leer la solicitud.",
      },
      400,
    );
  }

  const nombre = payload?.nombre?.trim() || "";
  const telefono = payload?.telefono?.trim() || "";
  const correo = payload?.correo?.trim() || "";
  const tipo = payload?.tipo?.trim() || "";
  const mensaje = payload?.mensaje?.trim() || "";

  if (!nombre || !telefono || !correo || !tipo || !mensaje) {
    return jsonResponse(
      {
        success: false,
        message: "Completa todos los campos antes de continuar.",
      },
      400,
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    return jsonResponse(
      {
        success: false,
        message: "Escribe un correo valido para continuar.",
      },
      400,
    );
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
      return jsonResponse(
        {
          success: false,
          message: emailResult.error.message || "No se pudo enviar el correo.",
        },
        502,
      );
    }

    return jsonResponse({ success: true, id: emailResult?.data?.id || null });
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "No se pudo procesar la solicitud.",
      },
      500,
    );
  }
}
