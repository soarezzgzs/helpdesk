-- DropForeignKey
ALTER TABLE "technician_availability" DROP CONSTRAINT "technician_availability_technician_id_fkey";

-- DropForeignKey
ALTER TABLE "ticket_services" DROP CONSTRAINT "ticket_services_ticket_id_fkey";

-- AddForeignKey
ALTER TABLE "ticket_services" ADD CONSTRAINT "ticket_services_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "technician_availability" ADD CONSTRAINT "technician_availability_technician_id_fkey" FOREIGN KEY ("technician_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
