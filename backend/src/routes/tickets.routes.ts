import {Router} from "express"

import {TicketsController} from "../controllers/tickets.controller"

import {verifyAuthorization} from "../middlewares/verifyAuthorization.middleware"

const ticketsRoutes = Router()

const ticketsController = new TicketsController()

ticketsRoutes.post("/", ticketsController.create)
ticketsRoutes.get("/my", verifyAuthorization(["client"]) ,ticketsController.clientTickets)
ticketsRoutes.get("/assigned", verifyAuthorization(["technician"]) ,ticketsController.technicianTickets)
ticketsRoutes.get("/", verifyAuthorization(["admin"]) ,ticketsController.allTickets)
ticketsRoutes.patch("/status/:id", verifyAuthorization(["admin", "technician"]) ,ticketsController.updateStatus)

export {ticketsRoutes}