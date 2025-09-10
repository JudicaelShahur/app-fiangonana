// src/hooks/useLogout.js
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";
import { afficherToastErreur, afficherToastSuccès } from "../utils/toast";
import { getBackendMessage } from "../utils/getBackendMessage";

export default function useLogout() {
  const { setUser, setToken } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const res = await logoutUser();
      setUser(null);
      setToken(null);
      afficherToastSuccès(res.message || "Déconnexion réussie !");
      navigate("/login");
    } catch (err) {
      const message = getBackendMessage(err.response?.data || err);
      afficherToastErreur(message);
    }
  };

  return { logout };
}
