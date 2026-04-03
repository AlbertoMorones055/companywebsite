# Servicios Falcon Site

Sitio web construido con Vite y React.

## Formulario en Vercel

El formulario de contacto usa una funcion serverless en `api/contact.js` y envia correos con Resend.

Variables necesarias en Vercel:
- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`
- `CONTACT_CC_EMAIL` (opcional)
- `CONTACT_FROM_EMAIL`

Puedes usar `.env.example` como referencia para configurarlas.
