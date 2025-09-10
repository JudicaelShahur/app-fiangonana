import api from "../api";

// Enregistrer un utilisateur
export const registerUser = async(data) => {
    try {
        const response = await api.post("/auth/create-account", data);
        return response.data; 
    } catch (error) {
        throw error;
    }
};


// Login utilisateur
export const loginUser = async(data) => {
    try {
        const response = await api.post("/auth/login", data);
        return response.data; 
    } catch (error) {
        throw error;
    }
};

// Logout utilisateur
export const logoutUser = async () => {
  try {
    const response = await api.post("/auth/logout");
    return response.data;
  } catch (error) {
    throw error;
  }
};
// profile 'dutilisateur
export const profile = async() => {
    try {
        const response = await api.get("/auth/profile");
        return response.data;
    } catch (error) {
        throw error;
    }
};
// Liste en attente un utilisateur
export const listeEn_attenteUser = async() => {
    try {
        const response = await api.get("/membres/en_attente");
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Accepter ou supprimer un utilisateur
export const gererUser = async(userId, action, token) => {
    try {
        const response = await api.post( `/gerer/${userId}`,{ action });
        return response.data;
    } catch (error) {
        throw error;
    }
};

