import { Router } from "express";

import { CategoriesController } from "../controllers/categories.controller";
import {verifyAuthorization} from "../middlewares/verifyAuthorization.middleware";

const categoriesRoutes = Router()

const categoriesController = new CategoriesController()

categoriesRoutes.get("/", verifyAuthorization(["admin"]) ,categoriesController.index)
categoriesRoutes.post("/", verifyAuthorization(["admin"]) ,categoriesController.create)

export {categoriesRoutes}