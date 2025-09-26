import api from "../api";

/**
 * Récupère la liste paginée des Chefkarties
 * @param {number} page - Numéro de la page (1 par défaut)
 * @param {number} perPage - Nombre d'éléments par page (10 par défaut)
 * @returns {Promise<Object>} - { data, current_page, last_page, per_page, total }
 */
export const listeChefkartie = async (page = 1, search = "") => {
    try {
        const res = await api.get("/chefkarties", {
            params: { page, search },
        });
        return res.data; // l'API retourne déjà { data, current_page, last_page, per_page, total, message }
    } catch (error) {
        throw error.response?.data || { message: "Erreur inconnue lors de la récupération des Chefkarties." };
    }
};

/**
 * Crée un nouveau Chefkartie
 * @param {Object} data - { id_mpin, id_kar, annee_kar }
 * @returns {Promise<Object>} - Chefkartie créé
 */
export const ajoutChefkartie = async (data) => {
    try {
        const res = await api.post("/chefkarties", data, {
            headers: { "Content-Type": "application/json" },
        });
        return res.data.results;
    } catch (error) {
        throw error.response?.data || { message: "Erreur inconnue lors de l'ajout d'un Chefkartie." };
    }
};

/**
 * Modifie un Chefkartie existant
 * @param {number|string} id - ID du Chefkartie
 * @param {Object} data - { id_mpin, id_kar, annee_kar }
 * @returns {Promise<Object>} - Chefkartie mis à jour
 */
export const modifierChefkartie = async (id, data) => {
    try {
        const res = await api.post(`/chefkarties/${id}`, data, {
            headers: { "Content-Type": "application/json" },
        });
        return res.data.results;
    } catch (error) {
        throw error.response?.data || { message: "Erreur inconnue lors de la modification du Chefkartie." };
    }
};

/**
 * Supprime un Chefkartie
 * @param {number|string} id - ID du Chefkartie
 * @returns {Promise<string>} - Message de succès
 */
export const supprimerChefkartie = async (id) => {
    try {
        const res = await api.delete(`/chefkarties/${id}`);
        return res.data.message || "Chefkartie supprimé avec succès.";
    } catch (error) {
        throw error.response?.data || { message: "Erreur inconnue lors de la suppression du Chefkartie." };
    }
};
