import api from "../api";

// Lister avec pagination
export const getFahatongavanas = async (page = 1, per_page = 10) => {
    try {
        const res = await api.get("/fahatongavana", { params: { page, per_page } });
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Erreur lors de la récupération des Fahatongavanas." };
    }
};

// Créer un nouveau
export const ajoutFahatongavana = async (data) => {
    try {
        const res = await api.post("/fahatongavana", data);
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Erreur lors de la création du Fahatongavana." };
    }
};

// Modifier un existant
export const modifierFahatongavana = async (id, data) => {
    try {
        const res = await api.put(`/fahatongavana/${id}`, data);
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Erreur lors de la modification du Fahatongavana." };
    }
};

// Supprimer
export const supprimerFahatongavana = async (id) => {
    try {
        const res = await api.delete(`/fahatongavana/${id}`);
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Erreur lors de la suppression du Fahatongavana." };
    }
};

// Récupérer par ID
export const getFahatongavanaById = async (id) => {
    try {
        const res = await api.get(`/fahatongavana/${id}`);
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Erreur lors de la récupération du Fahatongavana." };
    }
};
