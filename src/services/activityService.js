import api from "../api";

/* Liste toutes les activités avec pagination + filtres */
export const listeActivity = async ({page = 1,per_page = 20,period = "week",month=null,year=null} = {}) => {
    try {
        const params = { page, per_page, period };

        if (month) params.month = month;
        if (year) params.year = year;

        const res = await api.get("/activities/recent", { params });
        return res.data;
    } catch (error) {
        throw error.response?.data || {
            message: "Erreur inconnue lors de la récupération des activités."
        };
    }
};
