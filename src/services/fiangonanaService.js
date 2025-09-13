//services/fiangonanaService.js
import api from "../api";

export const getFiangonanas = async (data) => {
    try {
        const res = await api.get("/fiangonanas-list-public", data);
        return res.data.results || [];
    } catch (error) {
        throw error.response?.data || { message: "Erreur inconnue" };
    }
}
// Ajouter une nouvelle fiangonana
export const ajoutFiangonana = async (data) => {
    try {
        const res = await api.post("/fiangonanas", data);
        return res.data.results || [];
    } catch (error) {
        throw error.response?.data || { message: "Erreur inconnue" };
    }
}

// Modifier une fiangonana existante
export const modifierFiangonana = async (id, data) => {
    try {
        const res = await api.put(`/fiangonanas/${id}`, data);
        return res.data.results || [];
    } catch (error) {
        throw error.response?.data || { message: "Erreur inconnue" };
    }
}

// Supprimer une fiangonana
export const supprimerFiangonana = async (id) => {
    try {
        const res = await api.delete(`/fiangonanas/${id}`);
        return res.data.results || [];
    } catch (error) {
        throw error.response?.data || { message: "Erreur inconnue" };
    }
}

// Lister toutes les fiangonanas
export const listeFiangonana = async () => {
  try {
    const res = await api.get("/fiangonanas");
    return res.data.results.data || [];
  } catch (error) {
    throw error.response?.data || { message: "Erreur inconnue" };
  }
};


