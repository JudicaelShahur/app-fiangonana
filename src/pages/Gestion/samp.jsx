import { useState, useEffect } from "react";
import useModal from "./useModal";
import {
    ajoutFiangonana,
    modifierFiangonana,
    supprimerFiangonana,
    listeFiangonana
} from "../services/fiangonanaService";
import { afficherToastSuccès, afficherToastErreur, getBackendMessage } from "../utils/toast";

const useFiangonana = () => {
    const { modal, openModal, closeModal, isOpen } = useModal();

    const [fiangonanas, setFiangonanas] = useState([]);
    const [currentFiangonana, setCurrentFiangonana] = useState({
        name: '', photo: '', photoFile: null, email: '', phone: ''
    });
    const [fiangonanaTerm, setFiangonanaTerm] = useState('');
    const [loading, setLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(() => {
    });
    const [totalPages, setTotalPages] = useState(1);
    const [perPage] = useState(10);

    const [debouncedSearch, setDebouncedSearch] = useState(fiangonanaTerm);
    const [isDebouncing, setIsDebouncing] = useState(false);

    // Debounce search
    useEffect(() => {
        setCurrentPage(1);
        setIsDebouncing(true);
        const handler = setTimeout(() => {
            setDebouncedSearch(fiangonanaTerm);
            setIsDebouncing(false);
        }, 1000);
        return () => clearTimeout(handler);
    }, [fiangonanaTerm]);

    // Persist current page
    useEffect(() => {
        localStorage.setItem("currentFiangonanaPage", currentPage);
    }, [currentPage]);

    // Fetch fiangonanas
    const fetchFiangonanas = async (page = 1, search = "") => {
        try {
            setLoading(true);
            const res = await listeFiangonana(page, perPage, search);
            const data = res?.results?.data || [];
            setFiangonanas(data.map(f => ({
                id: f.id,
                name: f.fiang_nom,
                photo: f.fiang_pho ? JSON.parse(f.fiang_pho).url : "",
                email: f.fiang_mail,
                phone: f.fiang_num,
                admin: f.admin_nom || "",
                address: f.fiang_kartie || ""
            })));
            setTotalPages(res?.results?.last_page || 1);
        } catch (err) {
            afficherToastErreur(getBackendMessage(err));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFiangonanas(currentPage, debouncedSearch);
    }, [currentPage, debouncedSearch]);

    // Input change
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        const map = { fiang_nom: 'name', fiang_mail: 'email', fiang_num: 'phone' };
        if (!map[id]) return;
        setCurrentFiangonana(prev => ({ ...prev, [map[id]]: value }));
    };

    // Add / Edit
    const addFiangonanaHandler = async () => {
        try {
            await ajoutFiangonana(currentFiangonana);
            fetchFiangonanas(currentPage, debouncedSearch);
            closeModal();
            afficherToastSuccès("Église ajoutée avec succès !");
        } catch (err) {
            afficherToastErreur(getBackendMessage(err));
        }
    };

    const editFiangonanaHandler = async () => {
        try {
            await modifierFiangonana(modal.data.id, currentFiangonana);
            fetchFiangonanas(currentPage, debouncedSearch);
            closeModal();
            afficherToastSuccès("Église modifiée avec succès !");
        } catch (err) {
            afficherToastErreur(getBackendMessage(err));
        }
    };

    // Delete
    const deleteFiangonanaHandler = async () => {
        try {
            await supprimerFiangonana(modal.data.id);
            fetchFiangonanas(currentPage, debouncedSearch);
            closeModal();
            afficherToastSuccès("Église supprimée avec succès !");
        } catch (err) {
            afficherToastErreur(getBackendMessage(err));
        }
    };

    // Modal open
    const openAdd = () => {
        setCurrentFiangonana({ name: '', photo: '', photoFile: null, email: '', phone: '' });
        openModal("add");
    };

    const openEdit = (f) => {
        setCurrentFiangonana({ ...f, photoFile: null });
        openModal("edit", f);
    };

    const openDeleteModal = (f) => openModal("delete", f);

    // Pagination helpers
    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
    const getPagesArray = () => Array.from({ length: totalPages }, (_, i) => i + 1);

    // Filter frontend
    const normalize = str => str?.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    const filteredFiangonanas = fiangonanas.filter(f => {
        const search = normalize(debouncedSearch);
        return (
            normalize(f.name || "").includes(search) ||
            normalize(f.address || "").includes(search) ||
            (f.phone || "").includes(debouncedSearch) ||
            normalize(f.admin || "").includes(search)
        );
    });
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setCurrentFiangonana(prev => ({ ...prev, photo: reader.result, photoFile: file }));
        reader.readAsDataURL(file);
    };
    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (!file?.type.startsWith("image/")) return;
        const reader = new FileReader();
        reader.onloadend = () => setCurrentFiangonana(prev => ({ ...prev, photo: reader.result, photoFile: file }));
        reader.readAsDataURL(file);
    };
    const handleDragOver = (e) => e.preventDefault();

    return {
        fiangonanas: filteredFiangonanas,
        currentFiangonana,
        modal,
        isOpen,
        handleInputChange,
        handleSubmit,
        handleSearch: (e) => setFiangonanaTerm(e.target.value),
        handleEdit,
        openDelete,
        handleDelete,
        handleFileChange,
        handleDrop,
        handleDragOver,
        openModal,
        closeModal,
        fiangonanaTerm,
        loading,
        currentPage,
        totalPages,
        perPage,
        setCurrentPage,
        isDebouncing,
        //
        fiangonanas: filteredFiangonanas,
        currentFiangonana,
        modal,
        isOpen,
        handleInputChange,
        handleSubmit,
        handleSearch: (e) => setFiangonanaTerm(e.target.value),
        handleEdit,
        openDelete,
        handleDelete,
        handleFileChange,
        handleDrop,
        handleDragOver,
        openModal,
        closeModal,
        fiangonanaTerm,
        loading,
        currentPage,
        totalPages,
        perPage,
        setCurrentPage,

    };
};

export default useFiangonana;
