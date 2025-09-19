import { useState, useEffect } from "react";
import useModal from "./useModal.js";
import {listeMpitondra,ajoutMpitondra,modifierMpitondra,supprimerMpitondra,} from "../services/mpitondraService.js";
import {afficherToastSuccès,afficherToastErreur,getBackendMessage,} from "../utils/toast.js";
import { listeMpinos } from "../services/mpinoService";
import {listeFiangonana} from "../services/fiangonanaService";
export const useMpitondra = () => {
    const { modal, openModal, closeModal, isOpen } = useModal();

    // --- Current page persistent ---
    const [currentPage, setCurrentPage] = useState(() => {
        const savedPage = localStorage.getItem("mpitondraPage");
        return savedPage ? Number(savedPage) : 1;
    });

    useEffect(() => {
        localStorage.setItem("mpitondraPage", currentPage);
    }, [currentPage]);

    const [totalPages, setTotalPages] = useState(1);
    const [mpitondras, setMpitondras] = useState([]);
    const [formData, setFormData] = useState({
        id_mpin: "",
        annee_mpitondra: "",
        titre_mpitondra: "",
        desc_mpitondra: "",
        id_fiang: "",
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);

    // --- Fetch Mpitondra ---
    const fetchMpitondra = async (page = 1) => {
        try {
            setLoading(true);
            const res = await listeMpitondra(page);
            console.log('donne mpitondra', res);
            const data = Array.isArray(res.results.data) ? res.results.data : [];
            setMpitondras(data);
            setTotalPages(res.results.last_page || 1);
        } catch (error) {
            afficherToastErreur(getBackendMessage(error));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMpitondra(currentPage);
    }, [currentPage]);

    const [mpinos, setMpinos] = useState([]);
    const [fiangonanas, setFiangonanas] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resMpino = await listeMpinos();
                console.log('donne mpino', resMpino);
                setMpinos(resMpino.results?.data || []);

                const resFiang = await listeFiangonana();
                console.log('donne fiangonana', resFiang);
                setFiangonanas(resFiang.results?.data || []);
            } catch (error) {
                afficherToastErreur(getBackendMessage(error));
            }
        };
        fetchData();
    }, []);

    // --- Form Handlers ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const addMpitondraHandler = async () => {
        try {
            await ajoutMpitondra(formData);
            fetchMpitondra(currentPage);
            closeModal();
            afficherToastSuccès("Mpitondra ajouté avec succès !");
        } catch (error) {
            afficherToastErreur(getBackendMessage(error));
        }
    };

    const editMpitondraHandler = async () => {
        try {
            await modifierMpitondra(modal.data.id, formData);
            fetchMpitondra(currentPage);
            closeModal();
            afficherToastSuccès("Mpitondra modifié avec succès !");
        } catch (error) {
            afficherToastErreur(getBackendMessage(error));
        }
    };

    const deleteMpitondraHandler = async () => {
        try {
            await supprimerMpitondra(modal.data.id);
            fetchMpitondra(currentPage);
            closeModal();
            afficherToastSuccès("Mpitondra supprimé avec succès !");
        } catch (error) {
            afficherToastErreur(getBackendMessage(error));
        }
    };

    // --- Modals ---
    const openAdd = () => {
        setFormData({
            id_mpin: "",
            annee_mpitondra: "",
            titre_mpitondra: "",
            desc_mpitondra: "",
            id_fiang: "",
        });
        openModal("add");
    };

    const openEdit = (m) => {
        openModal("edit", m);
        setFormData({
            id_mpin: m.id_mpin || "",
            annee_mpitondra: m.annee_mpitondra || "",
            titre_mpitondra: m.titre_mpitondra || "",
            desc_mpitondra: m.desc_mpitondra || "",
            id_fiang: m.id_fiang?.toString() || "",
        });
    };

    const openDelete = (m) => openModal("delete", m);

    // --- Pagination ---
    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    const getPagesArray = () => {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    };

    // --- Filtrage simple ---
    const filteredMpitondras = mpitondras.filter((m) =>
        // (m.id_mpin || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.titre_mpitondra || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.annee_mpitondra || "").toString().includes(searchTerm)
    );

    return {
        mpitondras,
        formData,
        handleInputChange,
        searchTerm,
        setSearchTerm,
        filteredMpitondras,
        modal,
        isOpen,
        closeModal,
        openAdd,
        openEdit,
        openDelete,
        addMpitondraHandler,
        editMpitondraHandler,
        deleteMpitondraHandler,
        currentPage,
        setCurrentPage,
        totalPages,
        nextPage,
        prevPage,
        getPagesArray,
        loading,
        fiangonanas,
        mpinos,
        setFormData
    };
};
