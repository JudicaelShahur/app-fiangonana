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
        const formData = new FormData();
        formData.append('fiang_nom', data.name);
        formData.append('fiang_mail', data.email);
        formData.append('fiang_num', data.phone);
        
        // Ajouter le fichier photo seulement s'il existe
        if (data.photoFile) {
            formData.append('fiang_pho', data.photoFile);
        }
        
        const res = await api.post("/fiangonanas", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return res.data.results;
    } catch (error) {
        throw error.response?.data || { message: "Erreur inconnue" };
    }
}

// Modifier une fiangonana existante
export const modifierFiangonana = async (id, data) => {
    try {
        const formData = new FormData();
        formData.append('fiang_nom', data.name);
        formData.append('fiang_mail', data.email);
        formData.append('fiang_num', data.phone);
        formData.append('_method', 'POST'); 
        // Ajouter le fichier photo seulement s'il existe
        if (data.photoFile) {
            formData.append('fiang_pho', data.photoFile);
        }
        
        const res = await api.post(`/fiangonanas/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return res.data.results;
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
export const listeFiangonana = async (page = 1, per_page = 10) => {
  try {
    const res = await api.get("/fiangonanas", { params: { page, per_page } });
    return res.data; 
  } catch (error) {
    throw error.response?.data || { message: "Erreur inconnue lors de la récupération des Fiangonanas." };
  }
};

// Récupérer une fiangonana par ID
export const getFiangonanaById = async (id) => {
  try {
    const res = await api.get(`/fiangonanas/${id}`);
    return res.data;
    
  } catch (error) {
    throw error.response?.data || { message: "Erreur inconnue" };
  }
};

