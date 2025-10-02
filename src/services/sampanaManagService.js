import api from "../api";

/* Liste toutes les associations SampanaManag avec pagination */
export const listeSampanaManags = async (page = 1, perPage = 10, search = "") => {
  try {
    const res = await api.get("/sampana-manags", {
      params: { page, per_page: perPage,search },
    });
    return res.data; // { results: {...}, message: ... }
  } catch (error) {
    throw error.response?.data || { message: "Erreur inconnue lors du chargement des associations." };
  }
};

/* Compter les mpinos par sampana */
export const countMpinosParSampana = async () => {
  try {
    const res = await api.get("/sampanas/count-mpino");
    return res.data.results; // [{ sampana_id: 1, total_mpinos: 10 }, ...]
  } catch (error) {
    throw error.response?.data || { message: "Erreur inconnue lors du comptage des mpinos." };
  }
};

/* Récupérer les détails d'une association SampanaManag */
export const getSampanaManag = async (id) => {
  try {
    const res = await api.get(`/sampana-manags/${id}`);
    return res.data.results;
  } catch (error) {
    throw error.response?.data || { message: "Erreur inconnue lors de la récupération des détails." };
  }
};

/* Ajouter une association SampanaManag
   @param {Object} data - { sampana_id, mpino_id }
*/
export const ajoutSampanaManag = async (data) => {
  try {
    const response = await api.post("/sampana-manags", data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data.results;
  } catch (error) {
    throw error.response?.data || { message: "Erreur inconnue lors de l'ajout de l'association." };
  }
};

/* Modifier une association existante
   @param {number|string} id - ID de l'association
   @param {Object} data - { sampana_id, mpino_id }
*/
export const modifierSampanaManag = async (id, data) => {
  try {
    const response = await api.post(`/sampana-manags/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data.results;
  } catch (error) {
    throw error.response?.data || { message: "Erreur inconnue lors de la modification de l'association." };
  }
};

/* Supprimer une association
   @param {number|string} id - ID de l'association
*/
export const supprimerSampanaManag = async (id) => {
  try {
    const response = await api.delete(`/sampana-manags/${id}`);
    return response.data.message || "Association supprimée avec succès.";
  } catch (error) {
    throw error.response?.data || { message: "Erreur inconnue lors de la suppression de l'association." };
  }
};
/* Compter les mpino  par sampana  pour l'utilisateur connecté */
export const countBySampana = async (period = "week", month = null, year = null) => {
  try {
    const params = { period };// envoie ?period=week, month ou year
    if (month) params.month = month;
    if (year) params.year = year;
    const res = await api.get("/sampanas/count-mpino", {params});
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Erreur lors de la récupération du compteur de mpino par sampana." };
  }
};

