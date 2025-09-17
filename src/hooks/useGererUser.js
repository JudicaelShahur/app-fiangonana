import { useState, useCallback } from "react";
import { gererUser } from "../services/authService";
import { afficherToastSuccès, afficherToastErreur } from "../utils/toast";

export default function useGererUser(refetchMembres) {
  const [loading, setLoading] = useState(false);

  const handleGererUser = useCallback(
    async (membre, action) => {
      setLoading(true);
      try {
        // Map action React → backend
        let backendAction = action === "confirmer" ? "accepte" : "refuse";
        await gererUser(membre.id, backendAction);

        if (action === "confirmer") {
          afficherToastSuccès(`La demande de compte de ${membre.nom_user} est confirmée`);
        } else if (action === "supprimer") {
          afficherToastSuccès(`La demande de compte de ${membre.nom_user} est supprimée`);
        }

        if (refetchMembres) refetchMembres();
      } catch (err) {
        afficherToastErreur(err.response?.data?.message || "Erreur serveur");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [refetchMembres]
  );

  return { handleGererUser, loading };
}
