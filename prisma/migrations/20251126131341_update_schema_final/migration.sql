-- CreateTable
CREATE TABLE "config_global" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "config_global_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tickets" (
    "id" SERIAL NOT NULL,
    "ticket_key" TEXT NOT NULL,
    "subject" TEXT,
    "sector_principal" TEXT,
    "source_channel" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'abierto',
    "assigned_to" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" SERIAL NOT NULL,
    "ticket_id" INTEGER NOT NULL,
    "message_id_original" TEXT NOT NULL,
    "from_email" TEXT,
    "from_name" TEXT,
    "to_email" TEXT,
    "html_body" TEXT,
    "text_body" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "error_logs" (
    "id" SERIAL NOT NULL,
    "workflow_name" TEXT,
    "error_message" TEXT,
    "stack_trace" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "error_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "config_global_key_key" ON "config_global"("key");

-- CreateIndex
CREATE UNIQUE INDEX "tickets_ticket_key_key" ON "tickets"("ticket_key");

-- CreateIndex
CREATE UNIQUE INDEX "messages_message_id_original_key" ON "messages"("message_id_original");

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
