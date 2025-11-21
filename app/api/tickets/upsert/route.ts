import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Desestructuramos los datos en snake_case que envía n8n
    const { 
      message_id_original, 
      subject, 
      from_name, 
      from_email, 
      origen_real, 
      sector_principal, 
      sectores_involucrados 
    } = body;

    // Validación básica
    if (!message_id_original) {
        return NextResponse.json({ success: false, error: "Falta message_id_original" }, { status: 400 });
    }

    // Upsert: Si existe actualiza, si no crea.
    const ticket = await prisma.ticket.upsert({
      where: { ticketKey: message_id_original },
      update: { 
        updatedAt: new Date(), 
        subject: subject // Actualizamos el asunto si cambió
      },
      create: {
        ticketKey: message_id_original,
        subject: subject || "(Sin Asunto)",
        sectorPrincipal: sector_principal || "ventas",
        origenReal: origen_real || "desconocido",
        // Aseguramos que sea un array, si n8n manda null ponemos array vacío
        sectoresInvolucrados: Array.isArray(sectores_involucrados) ? sectores_involucrados : [],
        estado: "abierto"
      },
    });

    return NextResponse.json({ success: true, ticket });
  } catch (error: any) {
    console.error("[API Ticket Upsert] Error:", error);
    // Retornamos error 500 para que n8n sepa que falló y pueda reintentar
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}