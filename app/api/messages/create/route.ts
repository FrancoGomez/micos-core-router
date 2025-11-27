import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // CORRECCIÓN: Alinear nombres con lo que manda n8n (snake_case)
    const { 
        ticket_id,          // n8n envía ticket_id
        message_id_original, // n8n envía message_id_original
        from_email, 
        from_name, 
        html_body,          // n8n envía html_body
        text_body           // n8n envía text_body
    } = body;

    // Validación estricta
    if (!ticket_id || !message_id_original || !from_email) {
        return NextResponse.json({ success: false, error: "Faltan datos obligatorios para el mensaje" }, { status: 400 });
    }

    // Idempotencia (Evitar duplicados)
    const existingMessage = await prisma.message.findUnique({
        where: { messageIdOriginal: message_id_original }
    });

    if (existingMessage) {
        return NextResponse.json({ success: true, message: existingMessage, status: "already_exists" });
    }

    // Crear Mensaje
    const newMessage = await prisma.message.create({
      data: {
        ticketId: Number(ticket_id),
        messageIdOriginal: message_id_original,
        fromEmail: from_email,
        fromName: from_name || "Desconocido", 
        // Mapeo correcto a las columnas de Prisma
        htmlBody: html_body || "<div></div>", 
        textBody: text_body || "" 
      },
    });

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error: any) {
    console.error("[API Message Create] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}