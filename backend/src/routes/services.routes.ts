import {Router} from "express"

import {ServicesController} from "../controllers/services.controller"

import {verifyAuthorization} from "../middlewares/verifyAuthorization.middleware"

const servicesRoutes = Router()

const servicesController = new ServicesController()

servicesRoutes.post("/", verifyAuthorization(["admin"]) ,servicesController.create)
servicesRoutes.get("/", verifyAuthorization(["admin"]) ,servicesController.index)
servicesRoutes.put("/:id", verifyAuthorization(["admin"]) ,servicesController.update)
servicesRoutes.patch("/:id/status", verifyAuthorization(["admin"]) ,servicesController.updateStatus)

export {servicesRoutes}