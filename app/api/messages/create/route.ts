import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ticketId, message_id, from_email, from_name, html, text } = body;

    // Validación básica
    if (!ticketId || !message_id) {
        return NextResponse.json({ success: false, error: "Faltan datos clave (ticketId o message_id)" }, { status: 400 });
    }

    // Idempotencia: Verificar si el mensaje ya existe para evitar duplicados si n8n reintenta.
    const existingMessage = await prisma.message.findUnique({
        where: { messageIdOriginal: message_id }
    });

    if (existingMessage) {
        // Si ya existe, devolvemos OK pero avisamos que ya estaba.
        return NextResponse.json({ success: true, message: existingMessage, status: "already_exists" });
    }

    // Creamos el mensaje nuevo
    const newMessage = await prisma.message.create({
      data: {
        ticketId: Number(ticketId), // Aseguramos que el ID del ticket sea número
        messageIdOriginal: message_id,
        fromEmail: from_email,
        fromName: from_name,
        htmlBody: html,
        textBody: text
      },
    });

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error: any) {
    console.error("[API Message Create] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}