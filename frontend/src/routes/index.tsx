import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Login } from "../pages/Login";
import { Admin } from "../pages/Admin";
import { Client } from "../pages/Client";
import { Technician } from "../pages/Technician";
import { Register } from "../pages/Register";
import {TicketDetails} from "../pages/TicketDetails";
import {CreateTicket} from "../pages/CreateTicket";

export function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/admin"
                    element={<Admin />}
                />

                <Route
                    path="/tickets/my-tickets"
                    element={<Client />}
                />

                <Route
                    path="/ticket/:id"
                    element={<TicketDetails />}
                />

                <Route
                    path="/tickets/create-ticket"
                    element={<CreateTicket />}
                />

                <Route
                    path="/tickets/assigned"
                    element={<Technician />}
                />

            </Routes>
        </BrowserRouter>
    );
}