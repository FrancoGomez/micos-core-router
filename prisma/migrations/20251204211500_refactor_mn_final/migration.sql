-- CreateTable
CREATE TABLE "_MessageToTicket" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MessageToTicket_AB_unique" ON "_MessageToTicket"("A", "B");

-- CreateIndex
CREATE INDEX "_MessageToTicket_B_index" ON "_MessageToTicket"("B");

-- AddForeignKey
ALTER TABLE "_MessageToTicket" ADD CONSTRAINT "_MessageToTicket_A_fkey" FOREIGN KEY ("A") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MessageToTicket" ADD CONSTRAINT "_MessageToTicket_B_fkey" FOREIGN KEY ("B") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DATA MIGRATION: Copy existing relationships to the new pivot table
INSERT INTO "_MessageToTicket" ("A", "B")
SELECT id, ticket_id
FROM messages
WHERE ticket_id IS NOT NULL;

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_ticket_id_fkey";

-- DropColumn
ALTER TABLE "messages" DROP COLUMN "ticket_id";
