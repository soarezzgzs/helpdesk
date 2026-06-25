import { Router } from "express";

import { authRoutes } from "./auth.routes";
import { clientRoutes } from "./clients.routes";
import { loginRoutes } from "./login.routes";
import { adminsRoutes } from "./admins.routes";
import { techniciansRoutes } from "./technicians.routes";
import { profileRoutes } from "./profile.routes";
import { servicesRoutes } from "./services.routes";
import {categoriesRoutes} from "./categories.routes"

import {ensureAuthenticated} from "../middlewares/auth.middleware"

const routes = Router();

// Rotas públicas
routes.use("/users", loginRoutes);
routes.use("/login", authRoutes);

// Rotas privadas.
routes.use(ensureAuthenticated);
routes.use("/admins", adminsRoutes);
routes.use("/technicians", techniciansRoutes);
routes.use("/clients", clientRoutes);
routes.use("/profile", profileRoutes)
routes.use("/services", servicesRoutes)
routes.use("/categories", categoriesRoutes)

export { routes };