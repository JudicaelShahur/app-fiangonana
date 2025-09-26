import api from "../api";

/* Liste toutes les Mpitondra */
export const listeMpitondra = async (page = 1, perPage = 10, search = "") => {
    try {
        const res = await api.get("/mpitondras", {
            params: { page, per_page: perPage, search},
        });
        return res.data; 
    } catch (error) {
        throw error.response?.data || { message: "Erreur inconnue" };
    }
};

/* Détails d’un Mpitondra */
export const detailsMpitondra = async (id) => {
    try {
        const res = await api.get(`/mpitondras/${id}`);
        return res.data.results;
    } catch (error) {
        throw error.response?.data || { message: "Erreur inconnue lors de la récupération du Mpitondra." };
    }
};

/* Ajout d’un Mpitondra
   @param {Object} data - { id_mpin, annee_mpitondra, titre_mpitondra, desc_mpitondra, id_fiang }
*/
export const ajoutMpitondra = async (data) => {
    try {
        const res = await api.post("/mpitondras", data, {
            headers: { "Content-Type": "application/json" },
        });
        return res.data.results;
    } catch (error) {
        throw error.response?.data || { message: "Erreur inconnue lors de l'ajout du Mpitondra." };
    }
};

/* Modification d’un Mpitondra
   @param {number|string} id
   @param {Object} data
*/
export const modifierMpitondra = async (id, data) => {
    try {
        const res = await api.post(`/mpitondras/${id}`, data, {
            headers: { "Content-Type": "application/json" },
        });
        return res.data.results;
    } catch (error) {
        throw error.response?.data || { message: "Erreur inconnue lors de la modification du Mpitondra." };
    }
};

/* Suppression d’un Mpitondra */
export const supprimerMpitondra = async (id) => {
    try {
        const res = await api.delete(`/mpitondras/${id}`);
        return res.data.message || "Mpitondra supprimé avec succès.";
    } catch (error) {
        throw error.response?.data || { message: "Erreur inconnue lors de la suppression du Mpitondra." };
    }
};
