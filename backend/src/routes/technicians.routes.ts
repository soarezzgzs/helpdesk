import {Router} from "express"
import multer from "multer"

import { TechniciansController } from "../controllers/technicians.controller"

import {verifyAuthorization} from "../middlewares/verifyAuthorization.middleware"


const techniciansRoutes = Router()

const techniciansController = new TechniciansController()


techniciansRoutes.get("/admin", verifyAuthorization(["admin"]) ,techniciansController.index)
techniciansRoutes.get("/admin/:id", verifyAuthorization(["admin"]) ,techniciansController.show)
techniciansRoutes.post("/admin/new", verifyAuthorization(["admin"]) ,techniciansController.create)
techniciansRoutes.put("/admin/edit/:id", verifyAuthorization(["admin", "technician"]) ,techniciansController.update)
techniciansRoutes.patch("/password/:id", verifyAuthorization(["admin", "technician"]) ,techniciansController.updatePassword)
techniciansRoutes.patch("/availability/:id", verifyAuthorization(["admin", "technician"]) ,techniciansController.technicianAvailability)
techniciansRoutes.get("/availability/:id", verifyAuthorization(["admin", "technician"]) ,techniciansController.showAvailability)

export {techniciansRoutes}