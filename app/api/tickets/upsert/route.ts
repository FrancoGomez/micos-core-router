import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Desestructuramos los datos que envía n8n
    const { 
      message_id_original, 
      subject, 
      sector_principal, 
      source_channel // <--- EL CAMPO ESTRELLA
    } = body;

    // 2. Validación básica
    if (!message_id_original) {
        return NextResponse.json({ success: false, error: "Falta message_id_original" }, { status: 400 });
    }

    // 3. Upsert: Crear o Actualizar Ticket
    const ticket = await prisma.ticket.upsert({
      where: { ticketKey: message_id_original },
      
      // Si el ticket YA existe:
      update: { 
        updatedAt: new Date(), 
        subject: subject, // Actualizamos asunto por si cambió (Re: ...)
        estado: "abierto" // Si entra un mensaje nuevo, reabrimos el ticket por si estaba cerrado
      },
      
      // Si el ticket es NUEVO:
      create: {
        ticketKey: message_id_original,
        subject: subject || "(Sin Asunto)",
        sectorPrincipal: sector_principal || "ventas",
        sourceChannel: source_channel || "desconocido", // Guardamos de qué casilla vino
        estado: "abierto"
      },
    });

    return NextResponse.json({ success: true, ticket });
    
  } catch (error: any) {
    console.error("[API Ticket Upsert] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}