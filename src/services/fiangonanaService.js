//services/fiangonanaService.js
import api from "../api";

export const getFiangonanas = async (data) => {
    try {
        const res = await api.get("/fiangonanas-list-public",data);
        return res.data.results || [];
    } catch (error) {
        throw error.response?.data || { message: "Erreur inconnue" };
    }
  
   
};