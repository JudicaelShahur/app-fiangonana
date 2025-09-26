import api from "../api";

/* Liste tous les Mpinos avec pagination et recherche */
export const listeMpinos = async (page = 1, per_page = 10, search = "") => {
  try {
    const res = await api.get("/mpinos", {
      params: { page, per_page, search } // mandefa search koa
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Erreur inconnue lors de la récupération des Mpinos." };
  }
};

export const getMpinoById = async (qrObj) => {
  try {
    const id = qrObj.id; // maka ny id fotsiny
    const res = await api.get(`/mpinos/${id}`);
    return res.data.success ? res.data.results : null;
  } catch (err) {
    console.error("Erreur getMpinoById:", err.response?.data || err);
    return null;
  }
};

/* Compter les Mpinos par Fiangonana pour l'utilisateur connecté */
export const countMpinosByFiangonana = async (period = "all", month = null, year = null) => {
  try {
    const params = { period };// envoie ?period=week, month ou year
    if (month) params.month = month;
    if (year) params.year = year;
    const res = await api.get("/mpinos/stats", {params});
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Erreur lors de la récupération du compteur de Mpinos." };
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
    return res.data; // blob
  } catch (error) {
    throw { message: error.response?.data?.message || "Erreur lors du téléchargement du PDF." };
  }
};

