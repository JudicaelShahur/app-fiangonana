import api from "../api";

// Lister avec pagination + recherche + date
export const getFahatongavanas = async (page = 1, search = "", date = null) => {
    try {
        const res = await api.get("/fahatongavana", { 
            params: { page, search, date }
        });
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Erreur lors de la récupération des Fahatongavanas." };
    }
};

// Récupérer status des mpinos aujourd'hui
export const getMpinosStatusToday = async () => {
    try {
        const res = await api.get("/fahatongavana/status-today");
        return res.data;
    } catch (err) {
        throw err.response?.data || { message: "Erreur lors de la récupération des statuses des mpinos." };
    }
};

/* Compter les Fahatongavana par Fiangonana pour l'utilisateur connecté */
export const countFahatongavanaByFiangonana = async (period = "all", month = null, year = null) => {
    try {
        const params = { period };// envoie ?period=week, month ou year
        if (month) params.month = month;
        if (year) params.year = year;
        const res = await api.get("/fahatongavana/count", { params });
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Erreur lors de la récupération du compteur de Fahatongavana." };
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
/* Compter les vola recu par Fiangonana pour l'utilisateur connecté */
export const sommeVolas = async (period = "week", month = null, year = null) => {
    try {
        const params = { period };
        if (month) params.month = month;
        if (year) params.year = year;
        const res = await api.get("/fahatongavana/sommeVola", {params});
        return res.data;
    } catch (err) {
        throw err.response?.data || { message: "Erreur lors du fetch somme" };
    }
};

