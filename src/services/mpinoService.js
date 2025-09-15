import api from "../api";

/* Liste tous les Mpinos avec pagination */
export const listeMpinos = async (page = 1, per_page = 10) => {
  try {
    const res = await api.get("/mpinos", { params: { page, per_page } });
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Erreur inconnue lors de la récupération des Mpinos." };
  }
};

/* Ajouter un Mpino (FormData pour inclure la photo) */
export const ajoutMpino = async (data) => {
  try {
    const res = await api.post("/mpinos", data, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data;
  } catch (error) {
    const errorData = error.response?.data || { message: "Erreur lors de l'ajout du Mpino." };
    if (errorData.errors) {
      throw { message: "Erreur de validation", errors: errorData.errors };
    }
    throw errorData;
  }
};

/* Modifier un Mpino (FormData pour inclure la photo) */
export const modifierMpino = async (id, data) => {
  try {
    const res = await api.post(`/mpinos/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data;
  } catch (error) {
    const errorData = error.response?.data || { message: "Erreur lors de la modification du Mpino." };
    if (errorData.errors) {
      throw { message: "Erreur de validation", errors: errorData.errors };
    }
    throw errorData;
  }
};

/* Supprimer un Mpino */
export const supprimerMpino = async (id) => {
  try {
    const res = await api.delete(`/mpinos/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Erreur lors de la suppression du Mpino." };
  }
};

/* Télécharger la fiche PDF d'un Mpino */
export const telechargerPdfMpino = async (id) => {
  try {
    const res = await api.get(`/mpinos/${id}/telecharger-pdf`, {
      responseType: 'blob'
    });
    return res.data; 
  } catch (error) {
    throw error.response?.data || { message: "Erreur lors du téléchargement du PDF." };
  }
};
