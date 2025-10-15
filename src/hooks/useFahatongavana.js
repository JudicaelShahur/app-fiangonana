import { useState, useEffect } from "react";
import useModal from "./useModal.js";
import { getFahatongavanas, ajoutFahatongavana, modifierFahatongavana, supprimerFahatongavana } from "../services/fahatongavanaService";
import { listeMpinos, countMpinosByFiangonana, getMpinoById } from "../services/mpinoService";
import { afficherToastSuccès, afficherToastErreur, getBackendMessage } from "../utils/toast.js";
import { listeVola } from "../services/volaService";
import { todayLocal } from "../utils/date";
import debounce from "lodash.debounce";
export const useFahatongavana = () => {
    const { modal, openModal, closeModal, isOpen } = useModal();

    // Pagination / Data
    const [presences, setPresences] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Form & Modal
    const [formData, setFormData] = useState({ mpino_id: "", has_paid: false, amount: null });
    const [currentPresence, setCurrentPresence] = useState(null);

    // Search / Filter
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDate, setSelectedDate] = useState(todayLocal());
    const [filteredPresences, setFilteredPresences] = useState([]);

    // Mpinos (autocomplete)
    const [mpinos, setMpinos] = useState([]);
    const [searchMpino, setSearchMpino] = useState("");
    const [filteredMpinos, setFilteredMpinos] = useState([]);
    const [totals, setTotals] = useState([]);

    const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
    const [isDebouncing, setIsDebouncing] = useState(false);
    // Debounce recherche //
    useEffect(() => {
      
        setIsDebouncing(true);
        const handler = setTimeout(() => {
        setDebouncedSearch(searchTerm);
        setIsDebouncing(false);
        }, 1000); return () => clearTimeout(handler);
    }, [searchTerm]);
    // Fetch Presences
    // Fetch Presences
    const fetchPresences = async (page = 1, search = "", date = selectedDate) => {
        try {
            setLoading(true);
            setError(null);
            const res = await getFahatongavanas(page, search, date);
            const data = res.results?.data || [];
            console.log("fahatongavana", data);
            const normalized = data.map(p => ({
                id: p.id,
                nom: p.nom || "",
                prenom: p.prenom || "",
                adresse: p.adresse || "",
                kartie: p.Kartie || "",
                fiangonana: p.fiangonana || "",
                status_presence: p.status_fahatongavana ? "Présent" : "Absent",
                status_payment: p.status_nandoa_vola ? "Payé" : "Non payé",
                amount: p.vola ? parseFloat(p.vola) : 0,
                date: p.created_at?.split("T")[0],
                raw: p,
            }));
            

            setPresences(normalized);
            setTotalPages(res.results?.last_page || 1);
        } catch (err) {
            setError(err.message || "Erreur lors du chargement des présences");
        } finally {
            setLoading(false);
        }
    };

    // Effects
    useEffect(() => {
        fetchPresences(currentPage, debouncedSearch, selectedDate);
        fetchTotals();
    }, [currentPage, debouncedSearch, selectedDate]);

    // Fetch Mpinos / Totals
    const loadMpinos = debounce(async (inputValue, callback) => {
        try {
            const res = await listeMpinos(1, 10, inputValue);
            const options = res.results?.data?.map(mp => ({
                value: mp.id_unique,
                label: `${mp.id_unique} - ${mp.nom} ${mp.prenom}`,
            })) || [];

            // Mitahiry mpinos amin'ny id_unique koa
            setMpinos((prev) => {
                const ids = new Set(prev.map(p => p.id));
                const newMpinos = res.results?.data?.filter(p => !ids.has(p.id)) || [];
                return [...prev, ...newMpinos];
            });

            callback(options);
        } catch {
            callback([]);
        }
    }, 500);
    const [volas, setVolas] = useState([]);

    const loadVolas = debounce(async (inputValue, callback) => {
        try {
            const res = await listeVola(1, 10, inputValue); // afaka mandefa search koa raha ilaina
            const options = res.results?.data?.map(v => ({
                value: v.id,
                label: `${v.montant.toLocaleString()} Ar - ${v.desc_vola}`,
            })) || [];

            // mitahiry vola ao amin'ny state raha mbola mila label ho an'ny value voafantina
            setVolas(res.results?.data || []);

            callback(options);
        } catch (err) {
            console.error("Erreur Volas:", err.message);
            callback([]);
        }
    },500);


    const fetchTotals = async () => {
        try {
            const res = await countMpinosByFiangonana();
            console.log("total mpino", res);
            if (res.success) setTotals(res);
        } catch (err) {
            console.error(err);
        }
    };


    // Filtered Presences
    useEffect(() => {
        const filtered = presences.filter(
            p =>
                p.nom.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                p.prenom.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                p.status_payment.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                p.amount.toString().includes(debouncedSearch) ||
                p.adresse.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
        setFilteredPresences(filtered);
    }, [presences, debouncedSearch]);
 


    // Form Handlers
    const handleInputChange = e => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const payload = {
                unique_id: formData.mpino_id,
                status_nandoa_vola: formData.has_paid,
                id_vola: formData.has_paid ? formData.amount : null,
            };
            if (currentPresence) await modifierFahatongavana(currentPresence.id, payload);
            else await ajoutFahatongavana(payload);
            await fetchPresences(currentPage);
            handleCloseModal();
            afficherToastSuccès("Présence enregistrée avec succès !");
        } catch (err) {
            afficherToastErreur(getBackendMessage(err));
        }
    };

    const handleDelete = async id => {
        try {
            await supprimerFahatongavana(id);
            await fetchPresences(currentPage);
            closeModal();
            afficherToastSuccès("Présence supprimée avec succès !");
        } catch (err) {
            afficherToastErreur(getBackendMessage(err));
        }
    };

    // Pagination helpers
    const nextPage = () => { if (currentPage < totalPages) setCurrentPage(prev => prev + 1); };
    const prevPage = () => { if (currentPage > 1) setCurrentPage(prev => prev - 1); };
    const getPagesArray = () => Array.from({ length: totalPages }, (_, i) => i + 1);

    // Stats
    const totalPresent = filteredPresences.filter(p => p.status_presence === "Présent").length;
    const totalPaid = filteredPresences.filter(p => p.status_payment === "Payé").length;
    const totalAmount = filteredPresences.reduce((sum, p) => sum + (p.amount || 0), 0);
    // Filtrage autocomplete sur id_unique
    const handleSearchMpino = async (e) => {
        const value = e.target.value;
        setSearchMpino(value);

        if (value.length === 0) {
            setFilteredMpinos([]);
            return;
        }
        // Filtrage local
        let filtered = mpinos.filter(m =>
            m.id_unique.toLowerCase().includes(value.toLowerCase()) ||
            m.nom.toLowerCase().includes(value.toLowerCase()) ||
            m.prenom.toLowerCase().includes(value.toLowerCase())
        );
        if (filtered.length === 0) {
            // Raha tsy hita amin'ny filtre local dia maka avy amin'ny API
            try {
                const mpinoFromApi = await getMpinoById(value);
                if (mpinoFromApi) filtered = [mpinoFromApi];
            } catch (err) {
                console.error("Erreur getMpinoById:", err);
            }
        }
        setFilteredMpinos(filtered);
    };


    const selectMpino = (m) => {
        setSearchMpino(m.id_unique);
        setFormData(prev => ({ ...prev, mpino_id: m.id_unique }));
        setFilteredMpinos([]);
    };
    // Close modal avec reset
    const resetForm = () => {
        setFormData({ mpino_id: "", has_paid: false, amount: null });
        setSearchMpino("");
        setFilteredMpinos([]);
        setCurrentPresence(null);
    };

    const handleCloseModal = () => {
        resetForm();
        closeModal(); // avy ao @ useModal
    };
    return {
        presences,
        filteredPresences,
        searchTerm,
        setSearchTerm,
        selectedDate,
        setSelectedDate,
        loading,
        error,
        totals,
        formData,
        handleInputChange,
        handleSubmit,
        handleDelete,
        modal,
        isOpen,
        openModal,
        closeModal: handleCloseModal,
        handleSearchMpino,
        selectMpino,
        currentPresence,
        setCurrentPresence,
        searchMpino,
        setSearchMpino,
        mpinos,
        filteredMpinos,
        nextPage,
        prevPage,
        getPagesArray,
        currentPage,
        totalPages,
        totalPresent,
        totalPaid,
        totalAmount,
        volas,
        isDebouncing,
        setFormData,
        loadMpinos,
        loadVolas,
        setCurrentPage
    };
};
