import api from "../api";

/**
 * Liste tous les Komity avec pagination
 * @param {number} page - Numéro de la page (par défaut 1)
 */
export const listeKomity = async (page = 1, search = "") => {
  try {
    const res = await api.get("/komities", { params: { page, search } });
    return res.data; 
  } catch (error) {
    throw error.response?.data || { message: "Erreur inconnue lors du chargement des Komity." };
  }
};

/**
 * Récupère un Komity par son ID
 * @param {number|string} id - ID du Komity
 */
export const getKomity = async (id) => {
  try {
    const response = await api.get(`/komities/${id}`);
    return response.data.results;
  } catch (error) {
    throw error.response?.data || { message: "Erreur inconnue lors de la récupération du Komity." };
  }
};

/**
 * Crée un nouveau Komity
 * @param {Object} data - { id_mpin, titre_kom }
 */
export const ajoutKomity = async (data) => {
  try {
    const response = await api.post("/komities", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data.results;
  } catch (error) {
    throw error.response?.data || { message: "Erreur inconnue lors de l'ajout du Komity." };
  }
};

/**
 * Met à jour un Komity existant
 * @param {number|string} id - ID du Komity
 * @param {Object} data - { titre_kom }
 */
export const modifierKomity = async (id, data) => {
  try {
    const response = await api.post(`/komities/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data.results;
  } catch (error) {
    throw error.response?.data || { message: "Erreur inconnue lors de la modification du Komity." };
  }
};

/**
 * Supprime un Komity
 * @param {number|string} id - ID du Komity
 */
export const supprimerKomity = async (id) => {
  try {
    const response = await api.delete(`/komities/${id}`);
    return response.data.message || "Komity supprimé avec succès.";
  } catch (error) {
    throw error.response?.data || { message: "Erreur inconnue lors de la suppression du Komity." };
  }
};
