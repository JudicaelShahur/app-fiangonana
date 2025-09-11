import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import Dashboard from "./pages/Dashboard";
import ChefKartie from "./pages/ChefKartie";
import Statistique from "./pages/Statistique";
import Kartie from "./pages/Kartie";
import Mpino from "./pages/Mpino";
import Mpitondra from "./pages/Mpitondra";
import Fahatongavana from "./pages/Fahatongavana";
import Vola from "./pages/Vola";
import Komitie from "./pages/Komitie";
import Sampana from "./pages/Sampana";
import Fiangonana from "./pages/Fiangonana";
import PrivateRoute from "./routes/PrivateRoute";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/Statistique" element={<Statistique />} />
        <Route path="/fiangonana" element={<Fiangonana />} />
        <Route path="/kartie" element={<Kartie />} />
        <Route path="/mpino" element={<Mpino />} />
        <Route path="/mpitondra" element={<Mpitondra />} />
        <Route path="/chefkartie" element={<ChefKartie />} />
        <Route path="/fahatongavana" element={<Fahatongavana />} />
        <Route path="/vola" element={<Vola />} />
        <Route path="/komitie" element={<Komitie />} />
        <Route path="/sampana" element={<Sampana />} />
      </Route>
    </Routes>
  );
}

export default App;
