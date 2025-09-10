import { useState, useEffect } from "react";
import { profile } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function useProfile() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      if (!user || !user.nom_user) { // fetch raha mbola null
        setLoading(true);
        try {
          const res = await profile();
          if (res.success && res.results?.user) {
            setUser(res.results.user);
          }
        } catch (err) {
          setError(err);
          console.error("Erreur fetch profile:", err);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchProfile();
  }, [user, setUser]);

  return { user, loading, error };
}
