import {Router} from "express"

import {ServicesController} from "../controllers/services.controller"

const servicesRoutes = Router()

const servicesController = new ServicesController()

servicesRoutes.post("/", servicesController.create)

export {servicesRoutes}