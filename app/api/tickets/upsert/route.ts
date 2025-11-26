import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { 
      message_id_original, 
      subject, 
      source_channel 
    } = body;

    // Validación estricta
    if (!message_id_original || !source_channel) {
        return NextResponse.json({ success: false, error: "Faltan datos obligatorios (message_id o source_channel)" }, { status: 400 });
    }

    // Upsert
    const ticket = await prisma.ticket.upsert({
      where: { ticketKey: message_id_original },
      
      // Si YA existe (Actualización):
      update: { 
        updatedAt: new Date(), 
        subject: subject || "Sin Asunto", 
        estado: "nuevo" // Vuelve a "nuevo" si entra respuesta del cliente
      },
      
      // Si es NUEVO (Creación):
      create: {
        ticketKey: message_id_original,
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