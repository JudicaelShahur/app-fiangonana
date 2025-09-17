import api from "../api"; 

// Liste de tous les Vola
// Liste de tous les Vola avec pagination
export const listeVola = async (page = 1, per_page = 10) => {
  try {
    const res = await api.get("/vola", { params: { page, per_page } });
    return res.data; 
  } catch (error) {
    throw error.response?.data || { message: "Erreur lors de la récupération des Vola." };
  }
};


//  Créer un Vola
export const ajoutVola = async (data) => {
  try {
    const res = await api.post("/vola", data);
    return res.data;
  } catch (error) {
    const errorData = error.response?.data || { message: "Erreur lors de l'ajout du Vola." };
    if (errorData.errors) {
      throw { message: "Erreur de validation", errors: errorData.errors };
    }
    throw errorData;
  }
};

//  Détails d'un Vola
export const getVola = async (id) => {
  try {
    const res = await api.get(`/vola/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Erreur lors de la récupération du Vola." };
  }
};

//  Mettre à jour un Vola
export const modifierVola = async (id, data) => {
  try {
    const res = await api.put(`/vola/${id}`, data);
    return res.data;
  } catch (error) {
    const errorData = error.response?.data || { message: "Erreur lors de la modification du Vola." };
    if (errorData.errors) {
      throw { message: "Erreur de validation", errors: errorData.errors };
    }
    throw errorData;
  }
};

// Supprimer un Vola
export const supprimerVola = async (id) => {
  try {
    const res = await api.delete(`/vola/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Erreur lors de la suppression du Vola." };
  }
};
