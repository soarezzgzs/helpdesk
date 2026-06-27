import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Login } from "../pages/Login";
import { Admin } from "../pages/Admin";
import { Client } from "../pages/Client";
import { Technician } from "../pages/Technician";
import { Register } from "../pages/Register";

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
                    path="/client"
                    element={<Client />}
                />

                <Route
                    path="/technician"
                    element={<Technician />}
                />

            </Routes>
        </BrowserRouter>
    );
}