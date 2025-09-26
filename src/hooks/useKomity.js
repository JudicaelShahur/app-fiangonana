import { useState, useEffect } from "react";
import useModal from "./useModal.js";
import {
  listeKomity,
  ajoutKomity,
  modifierKomity,
  supprimerKomity,
} from "../services/komityService.js";
import {
  afficherToastSuccès,
  afficherToastErreur,
  getBackendMessage,
} from "../utils/toast.js";
import { listeMpinos } from "../services/mpinoService.js";

export const useKomity = () => {
  const { modal, openModal, closeModal, isOpen } = useModal();

  // --- Current page persistent ---
  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);
  const [komities, setKomities] = useState([]);
  const [mpinos, setMpinos] = useState([]);
  const [formData, setFormData] = useState({ titre_kom: "", id_mpin: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // --- Fetch Komities ---
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [isDebouncing, setIsDebouncing] = useState(false);

  // Debounce search
  useEffect(() => {
    setCurrentPage(1);
    setIsDebouncing(true);
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setIsDebouncing(false);
    }, 1000);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchKomities = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const res = await listeKomity(page, search);
      console.log("donnee",res);
      setKomities(res.results.data || []);
      setTotalPages(res.results.last_page || 1);
    } catch (err) {
      afficherToastErreur(getBackendMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // --- Fetch Mpinos ---
  const fetchMpinos = async () => {
    try {
      const resMpino = await listeMpinos();
      setMpinos(resMpino.results?.data || []);
    } catch (error) {
      afficherToastErreur(getBackendMessage(error));
    }
  };

  useEffect(() => {
    fetchKomities(currentPage, debouncedSearch);
    fetchMpinos();
  }, [currentPage, debouncedSearch]);

  // --- Form Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- Ajouter ---
  const addKomityHandler = async () => {
    try {
      await ajoutKomity(formData);
      fetchKomities(currentPage);
      closeModal();
      afficherToastSuccès("Komity ajouté avec succès !");
    } catch (error) {
      afficherToastErreur(getBackendMessage(error));
    }
  };

  // --- Modifier ---
  const editKomityHandler = async () => {
    try {
      await modifierKomity(modal.data.id, formData);
      fetchKomities(currentPage);
      closeModal();
      afficherToastSuccès("Komity modifié avec succès !");
    } catch (error) {
      afficherToastErreur(getBackendMessage(error));
    }
  };

  // --- Supprimer ---
  const deleteKomityHandler = async () => {
    try {
      await supprimerKomity(modal.data.id);
      fetchKomities(currentPage);
      closeModal();
      afficherToastSuccès("Komity supprimé avec succès !");
    } catch (error) {
      afficherToastErreur(getBackendMessage(error));
    }
  };

  // --- Modals ---
  const openAdd = () => {
    setFormData({ titre_kom: "", id_mpin: "" });
    openModal("add");
  };

  const openEdit = (kom) => {
    setFormData({ titre_kom: kom.titre_kom, id_mpin: kom.id_mpin });
    openModal("edit", kom);
  };

  const openDelete = (kom) => openModal("delete", kom);

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

  // --- Filtrage ---

  const normalize = str => str?.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const filteredKomities = komities.filter(k => {
    const search = normalize(debouncedSearch);
    return (
      normalize(k.titre_kom || "").includes(search) ||
      normalize(k.nom || "").includes(search) ||
      normalize(k.prenom || "").includes(search)
    );
  });

  return {
    komities,
    filteredKomities,
    formData,
    handleInputChange,
    searchTerm,
    setSearchTerm,
    modal,
    isOpen,
    openAdd,
    openEdit,
    openDelete,
    closeModal,
    addKomityHandler,
    editKomityHandler,
    deleteKomityHandler,
    loading,
    mpinos,
    setFormData,
    currentPage,
    setCurrentPage,
    totalPages,
    nextPage,
    prevPage,
    getPagesArray,
    isDebouncing,
  };
};
