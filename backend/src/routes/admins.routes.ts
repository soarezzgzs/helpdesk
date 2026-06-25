import { Router } from "express"

import { AdminsController } from "../controllers/admins.controller"

import { verifyAuthorization } from "../middlewares/verifyAuthorization.middleware";

const adminsRoutes = Router()


// Instanciando o controller de admin
const adminsController = new AdminsController()

// Rotas para Admins
adminsRoutes.get("/", verifyAuthorization(["admin"]) ,adminsController.index)
adminsRoutes.post("/" ,  verifyAuthorization(["admin"]),adminsController.create)
adminsRoutes.put("/:id", verifyAuthorization(["admin"]), adminsController.update)
adminsRoutes.delete("/:id", verifyAuthorization(["admin"]), adminsController.delete)

export {adminsRoutes}