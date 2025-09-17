import { useState, useEffect } from "react";
import { profile } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { getFiangonanaById } from "../services/fiangonanaService";

export default function useProfile() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Format role + mampiditra anaran'ny fiangonana raha misy
  const formatRole = (role, fiangonanaName) => {
    if (!role) return "Role";
    const mapping = {
      "admin_fiangonana": "Admin Fiangonana",
      "mpitondra": "Mpitondra",
      "chef_kartie": "Chef Kartie",
    };
    let formatted = mapping[role] || role.split("_").map(w => w[0].toUpperCase() + w.slice(1)).join(" ");
    if (fiangonanaName) {
      formatted += ` (${fiangonanaName})`;
    }
    return formatted;
  };

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const res = await profile();

        if (res.success && res.results?.user) {
          let fiangonanaName = "";

          // Raha misy fiang_id na fiangonana_id dia  fetch
          const fiangId = res.results.user.fiang_id || res.results.user.fiangonana_id;

          if (fiangId) {
            try {
              const fRes = await getFiangonanaById(fiangId);
              if (fRes.success && fRes.results) {
                fiangonanaName = fRes.results.fiang_nom;
              }
            } catch (err) {
            }
          }

          // Set user miaraka amin'ny role 
          const formattedUser = {
            ...res.results.user,
            role: formatRole(res.results.user.role, fiangonanaName),
          };
          setUser(formattedUser);
        }
      } catch (err) {
        setError(err);
        console.error("Erreur fetch profile:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [setUser]);

  return { user, loading, error };
}
