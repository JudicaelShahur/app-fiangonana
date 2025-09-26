import api from "../api";

/* Liste tous les utilisateurs avec pagination*/
export const listeUsers = async (page = 1, perPage = 10) => {
  try {
    const res = await api.get("/users", {
      params: { page, per_page: perPage },
    });
    return res.data.results || res.data;
  } catch (error) {
    throw error.response?.data || { message: "Erreur inconnue lors de la récupération des utilisateurs." };
  }
};

/* Les autres fonctions restent identiques */
export const getUser = async (id) => {
  try {
    const res = await api.get(`/users/${id}`);
    return res.data.results || res.data;
  } catch (error) {
    throw error.response?.data || { message: "Erreur inconnue lors de la récupération de l'utilisateur." };
  }
};

export const ajoutUser = async (data) => {
  try {
    const res = await api.post("/users", data, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data.results || res.data;
  } catch (error) {
    throw error.response?.data || { message: "Erreur inconnue lors de l'ajout de l'utilisateur." };
  }
};

export const modifierUser = async (id, data) => {
  try {
    const res = await api.put(`/users/${id}`, data, {  
      headers: { "Content-Type": "application/json" },
    });
    return res.data.results || res.data;
  } catch (error) {
    throw error.response?.data || { message: "Erreur inconnue lors de la modification de l'utilisateur." };
  }
};

export const changePasswordUser = async (data) => {
  try {
    const res = await api.post("/update-password/users", data, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data.message || "Mot de passe mis à jour avec succès.";
  } catch (error) {
    throw error.response?.data || { message: "Erreur inconnue lors de la mise à jour du mot de passe." };
  }
};

export const supprimerUser = async (id) => {
  try {
    const res = await api.delete(`/users/${id}`);
    return res.data.message || "Utilisateur supprimé avec succès.";
  } catch (error) {
    throw error.response?.data || { message: "Erreur inconnue lors de la suppression de l'utilisateur." };
  }
};
