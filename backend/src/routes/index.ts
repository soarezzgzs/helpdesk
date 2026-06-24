import { Router } from "express";

import { authRoutes } from "./auth.routes";
import { usersRoutes } from "./users.routes";

import {ensureAuthenticated} from "../middlewares/auth.middleware"

const routes = Router();

// Rotas públicas
routes.use("/users", usersRoutes);
routes.use("/login", authRoutes);

// Rotas privadas.
routes.use(ensureAuthenticated);

export { routes };