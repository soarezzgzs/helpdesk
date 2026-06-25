import { Router } from "express";

import { authRoutes } from "./auth.routes";
import { clientRoutes } from "./clients.routes";
import { adminsRoutes } from "./admins.routes";
import { techniciansRoutes } from "./technicians.routes";
import { profileRoutes } from "./profile.routes";

import {ensureAuthenticated} from "../middlewares/auth.middleware"

const routes = Router();

// Rotas públicas
routes.use("/users", clientRoutes);
routes.use("/login", authRoutes);

// Rotas privadas.
routes.use(ensureAuthenticated);
routes.use("/admins", adminsRoutes);
routes.use("/technicians", techniciansRoutes);
routes.use("/profile", profileRoutes)

export { routes };