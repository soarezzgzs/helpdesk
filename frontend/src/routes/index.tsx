import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Login } from "../pages/Login";
import { Admin } from "../pages/Admin";
import { Client } from "../pages/Client";
import { Technician } from "../pages/Technician";
import { Register } from "../pages/Register";
import {TicketDetails} from "../pages/TicketDetails";
import {CreateTicket} from "../pages/CreateTicket";
import {AdminTechnicians} from "../pages/Admin/Technicians";
import {TechnicianForm} from "../pages/Admin/Technicians/Form";

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
                    path="/tickets/admin"
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

                <Route
                    path="/technicians/admin"
                    element={<AdminTechnicians />}
                />

                <Route
                    path="/technicians/admin/new"
                    element={<TechnicianForm />}
                />

                <Route
                    path="/technicians/admin/edit/:id"
                    element={<TechnicianForm />}
                />

            </Routes>
        </BrowserRouter>
    );
}