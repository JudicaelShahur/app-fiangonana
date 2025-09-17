// src/hooks/useRegisterForm.js
import { useState } from "react";
import { registerUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { afficherToastSuccès, afficherToastErreur,getBackendMessage } from "../utils/toast"; 
export default function useRegisterForm() {
    const [rôleActif, setRôleActif] = useState("admin");

    const [formulaireAdmin, setFormulaireAdmin] = useState({
        nomUtilisateur: "",
        motDePasse: "",
        confirmerMotDePasse: "",
        rôle: "Admin Fiangonana",
    });

    const [formulaireUtilisateur, setFormulaireUtilisateur] = useState({
        nomUtilisateur: "",
        motDePasse: "",
        confirmerMotDePasse: "",
        rôle: "",
        église: "",
    });

    const [afficherMotDePasseAdmin, setAfficherMotDePasseAdmin] = useState(false);
    const [afficherConfirmationMotDePasseAdmin, setAfficherConfirmationMotDePasseAdmin] = useState(false);
    const [afficherMotDePasseUtilisateur, setAfficherMotDePasseUtilisateur] = useState(false);
    const [afficherConfirmationMotDePasseUtilisateur, setAfficherConfirmationMotDePasseUtilisateur] = useState(false);

    const gérerChangementRôle = (rôle) => setRôleActif(rôle);

    const gérerChangementAdmin = (e) => {
        const { name, value } = e.target;
        setFormulaireAdmin((précédent) => ({ ...précédent, [name]: value }));
    };

    const gérerChangementUtilisateur = (e) => {
        const { name, value } = e.target;
        setFormulaireUtilisateur((précédent) => ({ ...précédent, [name]: value }));
    };

    const vérifierSoliditéMotDePasse = (motDePasse) => {
        let solidité = 0;
        if (motDePasse.length > 5) solidité += 20;
        if (motDePasse.length > 7) solidité += 20;
        if (/[A-Z]/.test(motDePasse)) solidité += 20;
        if (/[0-9]/.test(motDePasse)) solidité += 20;
        if (/[^A-Za-z0-9]/.test(motDePasse)) solidité += 20;
        return solidité;
    };
    const navigate = useNavigate();
    const gérerSoumission = async (e) => {
        e.preventDefault();

        try {
            let dataToSend = rôleActif === "admin"
                ? {
                    nom_user: formulaireAdmin.nomUtilisateur,
                    mdp_user: formulaireAdmin.motDePasse,
                    mdp_user_confirmation: formulaireAdmin.confirmerMotDePasse, 
                    role: "admin_fiangonana",
                }
                : {
                    nom_user: formulaireUtilisateur.nomUtilisateur,
                    mdp_user: formulaireUtilisateur.motDePasse,
                    mdp_user_confirmation: formulaireUtilisateur.confirmerMotDePasse, 
                    role: formulaireUtilisateur.rôle,
                    fiang_id: formulaireUtilisateur.église,
                };

            const res = await registerUser(dataToSend);
            // Toast succès avec message backend
            afficherToastSuccès(res.data || res.message || "Inscription réussie !");
            // Reset formulaires
            setFormulaireAdmin({ nomUtilisateur: "", motDePasse: "", confirmerMotDePasse: "", rôle: "Admin Fiangonana" });
            setFormulaireUtilisateur({ nomUtilisateur: "", motDePasse: "", confirmerMotDePasse: "", rôle: "", église: "" });
            
            navigate("/login"); 

        } catch (err) {
           // Maka mivantana ilay data avy amin'ny Axios
            const messageErreur = getBackendMessage(err.response?.data || err);
            afficherToastErreur(messageErreur);
        }
    };

    return {
        rôleActif,
        formulaireAdmin,
        formulaireUtilisateur,
        afficherMotDePasseAdmin,
        afficherConfirmationMotDePasseAdmin,
        afficherMotDePasseUtilisateur,
        afficherConfirmationMotDePasseUtilisateur,
        gérerChangementRôle,
        gérerChangementAdmin,
        gérerChangementUtilisateur,
        vérifierSoliditéMotDePasse,
        gérerSoumission,
        setAfficherMotDePasseAdmin,
        setAfficherConfirmationMotDePasseAdmin,
        setAfficherMotDePasseUtilisateur,
        setAfficherConfirmationMotDePasseUtilisateur,
    };
}
