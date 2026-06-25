import { Router } from "express"

import { LoginController } from "../controllers/login.controller"

const loginRoutes = Router()

const usersController = new LoginController()

loginRoutes.post("/", usersController.create)

export { loginRoutes }
