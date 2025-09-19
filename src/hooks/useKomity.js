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
  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = localStorage.getItem("currentKomityPage");
    return savedPage ? Number(savedPage) : 1;
  });

  useEffect(() => {
    localStorage.setItem("currentKomityPage", currentPage);
  }, [currentPage]);

  const [totalPages, setTotalPages] = useState(1);
  const [komities, setKomities] = useState([]);
  const [mpinos, setMpinos] = useState([]);
  const [formData, setFormData] = useState({ titre_kom: "", id_mpin: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // --- Fetch Komities ---
  const fetchKomities = async (page = 1) => {
    try {
      setLoading(true);
      const res = await listeKomity(page);
      const data = Array.isArray(res.results.data) ? res.results.data : [];
      setKomities(data);
      setTotalPages(res.results.last_page || 1);
    } catch (error) {
      afficherToastErreur(getBackendMessage(error));
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
    fetchKomities(currentPage);
    fetchMpinos();
  }, [currentPage]);

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
  const filteredKomities = komities.filter(
    (k) =>
      (k.titre_kom || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (String(k.id_mpin) || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

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
  };
};
