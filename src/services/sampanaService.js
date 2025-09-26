import api from "../api"; 

// --- Liste avec pagination + recherche ---
export const listeSampanas = async (page = 1, perPage = 10, search = "") => {
  try {
    const response = await api.get("/sampanas", {params: {page,per_page: perPage,search},});
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des Sampanas :", error);
    throw error.response?.data || error;
  }
};


// --- Détails d'un Sampana ---
export const getSampana = async (id) => {
  try {
    const response = await api.get(`/sampanas/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération du Sampana :", error);
    throw error.response?.data || error;
  }
};

// --- Ajout d'un Sampana ---
export const ajoutSampana = async (data) => {
  try {
    const response = await api.post(`/sampanas`, data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout du Sampana :", error);
    throw error.response?.data || error;
  }
};

// --- Modification d'un Sampana ---
export const modifierSampana = async (id, data) => {
  try {
    const response = await api.post(`/sampanas/${id}`, data); // ton API utilise POST
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la modification du Sampana :", error);
    throw error.response?.data || error;
  }
};

// --- Suppression d'un Sampana ---
export const supprimerSampana = async (id) => {
  try {
    const response = await api.delete(`/sampanas/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la suppression du Sampana :", error);
    throw error.response?.data || error;
  }
};
