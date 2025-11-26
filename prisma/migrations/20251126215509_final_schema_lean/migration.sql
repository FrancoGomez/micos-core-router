/*
  Warnings:

  - You are about to drop the column `to_email` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `assigned_to` on the `tickets` table. All the data in the column will be lost.
  - You are about to drop the column `sector_principal` on the `tickets` table. All the data in the column will be lost.
  - Made the column `from_email` on table `messages` required. This step will fail if there are existing NULL values in that column.
  - Made the column `from_name` on table `messages` required. This step will fail if there are existing NULL values in that column.
  - Made the column `html_body` on table `messages` required. This step will fail if there are existing NULL values in that column.
  - Made the column `text_body` on table `messages` required. This step will fail if there are existing NULL values in that column.
  - Made the column `subject` on table `tickets` required. This step will fail if there are existing NULL values in that column.
  - Made the column `source_channel` on table `tickets` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "messages" DROP COLUMN "to_email",
ALTER COLUMN "from_email" SET NOT NULL,
ALTER COLUMN "from_name" SET NOT NULL,
ALTER COLUMN "html_body" SET NOT NULL,
ALTER COLUMN "text_body" SET NOT NULL;

-- AlterTable
ALTER TABLE "tickets" DROP COLUMN "assigned_to",
DROP COLUMN "sector_principal",
ALTER COLUMN "subject" SET NOT NULL,
ALTER COLUMN "source_channel" SET NOT NULL,
ALTER COLUMN "estado" SET DEFAULT 'nuevo';
