import { useState, useEffect } from "react";
import { listeEn_attenteUser } from "../services/authService";

export default function useMembresEnAttente() {
  const [membres, setMembres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMembres = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listeEn_attenteUser();
      setMembres(res.results || []);
    } catch (err) {
      console.error("Erreur fetch membres:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch automatique à l'initialisation
  useEffect(() => {
    fetchMembres();
  }, []);

  return { membres, loading, error, refetch: fetchMembres };
}
