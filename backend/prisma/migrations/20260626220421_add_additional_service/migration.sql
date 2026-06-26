/*
  Warnings:

  - You are about to drop the `ticket_services` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `service_id` to the `tickets` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "technician_availability" DROP CONSTRAINT "technician_availability_technician_id_fkey";

-- DropForeignKey
ALTER TABLE "ticket_services" DROP CONSTRAINT "ticket_services_service_id_fkey";

-- DropForeignKey
ALTER TABLE "ticket_services" DROP CONSTRAINT "ticket_services_ticket_id_fkey";

-- DropForeignKey
ALTER TABLE "tickets" DROP CONSTRAINT "tickets_client_id_fkey";

-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "service_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "ticket_services";

-- CreateTable
CREATE TABLE "additional_services" (
    "id" TEXT NOT NULL,
    "ticket_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "additional_services_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "additional_services" ADD CONSTRAINT "additional_services_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "technician_availability" ADD CONSTRAINT "technician_availability_technician_id_fkey" FOREIGN KEY ("technician_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
