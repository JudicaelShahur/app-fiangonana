import { toast } from "react-toastify";

// Toast de succès
export const afficherToastSuccès = (message = "Succès !") => {
    toast.success(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
};

//  Toast d'erreur
export const afficherToastErreur = (message = "Une erreur est survenue") => {
    toast.error(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
};

// Toast de chargement (retourne un ID pour mise à jour)
export const afficherToastChargement = (message = "Chargement...") => {
    return toast.loading(message, {
        position: "top-right",
        closeOnClick: false,
        draggable: false,
    });
};

// Mettre à jour un toast existant (succès ou erreur)
export const mettreÀJourToast = (idToast, message, type = "success") => {
    toast.update(idToast, {
        render: message,
        type: type,
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
    });
};