import {Router} from "express"

import {ServicesController} from "../controllers/services.controller"

import {verifyAuthorization} from "../middlewares/verifyAuthorization.middleware"

const servicesRoutes = Router()

const servicesController = new ServicesController()

servicesRoutes.post("/admin", verifyAuthorization(["admin"]) ,servicesController.create)
servicesRoutes.get("/", verifyAuthorization(["admin", "client"]) ,servicesController.index)
servicesRoutes.get("/:id", verifyAuthorization(["admin"]) ,servicesController.show)
servicesRoutes.put("/:id", verifyAuthorization(["admin"]) ,servicesController.update)
servicesRoutes.patch("/:id/status", verifyAuthorization(["admin"]) ,servicesController.updateStatus)

export {servicesRoutes}