import {Router} from "express"

import {TicketsController} from "../controllers/tickets.controller"

import {verifyAuthorization} from "../middlewares/verifyAuthorization.middleware"

const ticketsRoutes = Router()

const ticketsController = new TicketsController()

ticketsRoutes.get("/my-tickets", verifyAuthorization(["client"]) ,ticketsController.clientTickets)
ticketsRoutes.post("/", verifyAuthorization(["client"]) ,ticketsController.create)
ticketsRoutes.get("/assigned", verifyAuthorization(["technician"]) ,ticketsController.technicianTickets)
ticketsRoutes.get("/", verifyAuthorization(["admin"]) ,ticketsController.allTickets)
ticketsRoutes.patch("/:id/status", verifyAuthorization(["admin", "technician"]) ,ticketsController.updateStatus)
ticketsRoutes.post("/:id/additionalService", verifyAuthorization(["admin", "technician"]) ,ticketsController.addAdditionalService)

export {ticketsRoutes}