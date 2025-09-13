import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import Dashboard from "./pages/Principal/Dashboard";
import ChefKartie from "./pages/Gestion/ChefKartie";
import Statistique from "./pages/Principal/Statistique";
import Kartie from "./pages/Gestion/Kartie";
import Mpino from "./pages/Gestion/Mpino";
import Mpitondra from "./pages/Gestion/Mpitondra";
import Fahatongavana from "./pages/Gestion/Fahatongavana";
import Vola from "./pages/Gestion/Vola";
import Komitie from "./pages/Gestion/Komitie";
import Sampana from "./pages/Gestion/Sampana";
import Fiangonana from "./pages/Gestion/Fiangonana";
import PrivateRoute from "./routes/PrivateRoute";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import { ToastContainer } from "react-toastify";
import SampanaManags from "./pages/Gestion/SampanaManags";
import Utilisateurs from "./pages/Administration/Utilisateurs";
// import Parametres from "./pages/Parametres";
import AideSupport from "./pages/Administration/AideSupport";

function App() {
  return (
    <>
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
          <Route path="/sampanamanaga" element={<SampanaManags />} />
          <Route path="/utilisateur" element={<Utilisateurs />} />
          {/* <Route path="/parametre" element={<Parametres />} /> */}
          <Route path="/aide_support" element={<AideSupport />} />
        </Route>
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
