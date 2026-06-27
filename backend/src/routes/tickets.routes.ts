import {Router} from "express"

import {TicketsController} from "../controllers/tickets.controller"

import {verifyAuthorization} from "../middlewares/verifyAuthorization.middleware"

const ticketsRoutes = Router()

const ticketsController = new TicketsController()

ticketsRoutes.get("/my-tickets", verifyAuthorization(["client"]) ,ticketsController.clientTickets)
ticketsRoutes.post("/create-ticket", verifyAuthorization(["client"]) ,ticketsController.create)
ticketsRoutes.get("/assigned", verifyAuthorization(["technician"]) ,ticketsController.technicianTickets)
ticketsRoutes.get("/admin", verifyAuthorization(["admin"]) ,ticketsController.allTickets)
ticketsRoutes.get("/:id", verifyAuthorization(["client", "technician", "admin"]) ,ticketsController.show)
ticketsRoutes.patch("/:id/status", verifyAuthorization(["admin", "technician"]) ,ticketsController.updateStatus)
ticketsRoutes.post("/additionalService/:id", verifyAuthorization(["admin", "technician"]) ,ticketsController.addAdditionalService)
ticketsRoutes.delete("/additionalService/:id", verifyAuthorization(["admin", "technician"]) ,ticketsController.deleteAdditionalService)

export {ticketsRoutes}