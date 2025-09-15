import api from "../api";

/* Liste toutes les Kartie*/
export const listeKartie = async (page = 1) => {
  try {
    const res = await api.get("/karties", { params: { page } });
    return res.data; // satria ny API-nao dia manana { results: {...}, message: ... }
  } catch (error) {
    throw error.response?.data || { message: "Erreur inconnue" };
  }
};


/* Les données de la Kartie
@param {Object} data - { nom_kar, desc_kar, fiang_id }*/
export const ajoutKartie = async (data) => {
  try {
    const response = await api.post("/karties", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    // Retourne le Kartie créé
    return response.data.results;
  } catch (error) {
    throw error.response?.data || { message: "Erreur inconnue lors de l'ajout du Kartie." };
  }
};

/*
  Modifie un Kartie existant
  @param {number|string} id - ID du Kartie
  @param {Object} data - { nom_kar, desc_kar, fiang_id }
 */
export const modifierKartie = async (id, data) => {
  try {
    const response = await api.post(`/karties/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data.results;
  } catch (error) {
    throw error.response?.data || { message: "Erreur inconnue lors de la modification du Kartie." };
  }
};

/**
 * Supprime un Kartie
 * @param {number|string} id - ID du Kartie
 */
export const supprimerKartie = async (id) => {
  try {
    const response = await api.delete(`/karties/${id}`);
    return response.data.message || "Kartie supprimé avec succès.";
  } catch (error) {
    throw error.response?.data || { message: "Erreur inconnue lors de la suppression du Kartie." };
  }
};

/**
 * Optionnel : récupérer toutes les Fiangonanas pour le select
 */
export const listeFiangonanas = async () => {
  try {
    const res = await api.get("/fiangonanas");
    return res.data.results.data || [];
  } catch (error) {
    throw error.response?.data || { message: "Erreur inconnue" };
  }
};  

