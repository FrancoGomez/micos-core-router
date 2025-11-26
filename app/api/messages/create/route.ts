import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ticketId, message_id, from_email, from_name, html, text } = body;

    // Validación estricta
    if (!ticketId || !message_id || !from_email) {
        return NextResponse.json({ success: false, error: "Faltan datos obligatorios para el mensaje" }, { status: 400 });
    }

    // Idempotencia (Evitar duplicados)
    const existingMessage = await prisma.message.findUnique({
        where: { messageIdOriginal: message_id }
    });

    if (existingMessage) {
        return NextResponse.json({ success: true, message: existingMessage, status: "already_exists" });
    }

    // Crear Mensaje
    const newMessage = await prisma.message.create({
      data: {
        ticketId: Number(ticketId),
        messageIdOriginal: message_id,
        fromEmail: from_email,
        fromName: from_name || "Desconocido", 
        htmlBody: html || "<div></div>",      // Obligatorio en DB
        textBody: text || ""                  // Obligatorio en DB
      },
    });

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error: any) {
    console.error("[API Message Create] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}