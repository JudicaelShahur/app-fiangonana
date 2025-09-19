import { useState, useEffect } from "react";
import useModal from "./useModal.js";
import {
  listeSampanas,
  ajoutSampana,
  modifierSampana,
  supprimerSampana
} from "../services/sampanaService.js";
import { afficherToastSuccès, afficherToastErreur, getBackendMessage } from "../utils/toast.js";

export const useSampana = () => {
  const { modal, openModal, closeModal, isOpen } = useModal();

  // --- Pagination ---
  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = localStorage.getItem("sampanaCurrentPage");
    return savedPage ? Number(savedPage) : 1;
  });
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    localStorage.setItem("sampanaCurrentPage", currentPage);
  }, [currentPage]);

  // --- Données ---
  const [sampanas, setSampanas] = useState([]);
  const [formData, setFormData] = useState({ nom_samp: "", desc_samp: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // --- Fetch Sampanas ---
  const fetchSampanas = async (page = 1) => {
    try {
      setLoading(true);
      const res = await listeSampanas(page);
      setSampanas(res.results?.data || []);
      setTotalPages(res.results?.last_page || 1);
    } catch (error) {
      afficherToastErreur(getBackendMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSampanas(currentPage);
  }, [currentPage]);

  // --- Form Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- Ajouter Sampana ---
  const addSampanaHandler = async () => {
    try {
      await ajoutSampana(formData);
      fetchSampanas(currentPage);
      closeModal();
      afficherToastSuccès("Sampana ajouté avec succès !");
    } catch (error) {
      afficherToastErreur(getBackendMessage(error));
    }
  };

  // --- Modifier Sampana ---
  const editSampanaHandler = async () => {
    try {
      await modifierSampana(modal.data.id, formData);
      fetchSampanas(currentPage);
      closeModal();
      afficherToastSuccès("Sampana modifié avec succès !");
    } catch (error) {
      afficherToastErreur(getBackendMessage(error));
    }
  };

  // --- Supprimer Sampana ---
  const deleteSampanaHandler = async () => {
    try {
      await supprimerSampana(modal.data.id);
      fetchSampanas(currentPage);
      closeModal();
      afficherToastSuccès("Sampana supprimé avec succès !");
    } catch (error) {
      afficherToastErreur(getBackendMessage(error));
    }
  };

  // --- Modals ---
  const openAdd = () => {
    setFormData({ nom_samp: "", desc_samp: "" });
    openModal("add");
  };

  const openEdit = (sampana) => {
    setFormData({ nom_samp: sampana.nom_samp, desc_samp: sampana.desc_samp });
    openModal("edit", sampana);
  };

  const openDelete = (sampana) => openModal("delete", sampana);

  // --- Pagination helpers ---
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const getPagesArray = () => Array.from({ length: totalPages }, (_, i) => i + 1);

  // --- Filtrage simple ---
  const filteredSampanas = sampanas.filter(
    s =>
      (s.nom_samp || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.desc_samp || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    sampanas,
    filteredSampanas,
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
    addSampanaHandler,
    editSampanaHandler,
    deleteSampanaHandler,
    currentPage,
    setCurrentPage,
    totalPages,
    nextPage,
    prevPage,
    getPagesArray,
    loading
  };
};
