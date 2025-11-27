import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // CORRECCIÓN: Usamos ticket_key (ConversationID), NO message_id_original
    const { 
      ticket_key, 
      subject, 
      source_channel 
    } = body;

    // Validación estricta
    if (!ticket_key || !source_channel) {
        return NextResponse.json({ success: false, error: "Faltan datos obligatorios (ticket_key o source_channel)" }, { status: 400 });
    }

    // Upsert
    const ticket = await prisma.ticket.upsert({
      // Buscamos por la clave del hilo (ConversationID)
      where: { ticketKey: ticket_key },
      
      // Si YA existe (Actualización):
      update: { 
        updatedAt: new Date(), 
        // Solo actualizamos el estado si es necesario, por ejemplo "reabierto" si estaba cerrado
        estado: "nuevo" 
      },
      
      // Si es NUEVO (Creación):
      create: {
        ticketKey: ticket_key,
        subject: subject || "Sin Asunto",
        sourceChannel: source_channel,
        estado: "nuevo"
      },
    });

    return NextResponse.json({ success: true, ticket });
    
  } catch (error: any) {
    console.error("[API Ticket Upsert] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}