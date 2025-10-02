import api from "../api";

/* Liste toutes les activités avec pagination + filtres */
export const listeActivity = async ({
    page = 1,
    per_page = 20,
    period = "week",
    month = null,
    year = null,
    search = "",
    nom_kartie = "",
    nom_fiangonana = "",
    vita_soratra = ""
} = {}) => {
    try {
        const params = { page, per_page, period };

        if (month) params.month = month;
        if (year) params.year = year;
        if (search) params.search = search;
        if (nom_kartie) params.nom_kartie = nom_kartie;
        if (nom_fiangonana) params.nom_fiangonana = nom_fiangonana;
        if (vita_soratra) params.vita_soratra = vita_soratra;

        const res = await api.get("/activities/recent", { params });
        return res.data;
    } catch (error) {
        throw error.response?.data || {
            message: "Erreur inconnue lors de la récupération des activités."
        };
    }
};
