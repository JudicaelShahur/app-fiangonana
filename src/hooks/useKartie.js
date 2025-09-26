import { useState, useEffect } from "react";
import useModal from "./useModal.js";
import {
  listeKartie,
  ajoutKartie,
  modifierKartie,
  supprimerKartie,
  listeFiangonanas
} from "../services/kartieService.js";
import { afficherToastSuccès, afficherToastErreur, getBackendMessage } from "../utils/toast.js";

export const useKartie = () => {
  const { modal, openModal, closeModal, isOpen } = useModal();

  // --- Current page persistent ---
  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = localStorage.getItem("currentPage");
    return savedPage ? Number(savedPage) : 1;
  });

  useEffect(() => {
    localStorage.setItem("currentPage", currentPage);
  }, [currentPage]);

  const [totalPages, setTotalPages] = useState(1);
  const [kartie, setKartie] = useState([]);
  const [fiangonanas, setFiangonanas] = useState([]);
  const [formData, setFormData] = useState({ nom_kar: "", desc_kar: "", fiang_id: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [isDebouncing, setIsDebouncing] = useState(false);

  // --- Debounce recherche ---
  useEffect(() => {
    setCurrentPage(1); // reset page rehefa manova search
    setIsDebouncing(true);
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setIsDebouncing(false);
    }, 1000);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // --- Fetch Kartie ---
  const fetchKartie = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const res = await listeKartie(page, search);
      const data = Array.isArray(res.results.data) ? res.results.data : [];
      setKartie(data);
      setTotalPages(res.results.last_page || 1);
    } catch (error) {
      afficherToastErreur(getBackendMessage(error));
    } finally {
      setLoading(false);
    }
  };

  // --- Fetch Fiangonanas ---
  const fetchFiangonanas = async () => {
    try {
      const fList = await listeFiangonanas();
      setFiangonanas(Array.isArray(fList) ? fList : []);
    } catch (error) {
      afficherToastErreur(getBackendMessage(error));
    }
  };

  // --- Effet principal ---
  useEffect(() => {
    fetchKartie(currentPage, debouncedSearch);
    fetchFiangonanas();
  }, [currentPage, debouncedSearch]);

  // --- Form Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addKartieHandler = async () => {
    try {
      await ajoutKartie({ ...formData, fiang_id: Number(formData.fiang_id) });
      fetchKartie(currentPage);
      closeModal();
      afficherToastSuccès("Kartie ajouté avec succès !");
    } catch (error) {
      afficherToastErreur(getBackendMessage(error));
    }
  };

  const editKartieHandler = async () => {
    try {
      await modifierKartie(modal.data.id, { ...formData, fiang_id: Number(formData.fiang_id) });
      fetchKartie(currentPage);
      closeModal();
      afficherToastSuccès("Kartie modifié avec succès !");
    } catch (error) {
      afficherToastErreur(getBackendMessage(error));
    }
  };

  const deleteKartieHandler = async () => {
    try {
      await supprimerKartie(modal.data.id);
      fetchKartie(currentPage);
      closeModal();
      afficherToastSuccès("Kartie supprimé avec succès !");
    } catch (error) {
      afficherToastErreur(getBackendMessage(error));
    }
  };

  // --- Modals ---
  const openAdd = () => {
    setFormData({ nom_kar: "", desc_kar: "", fiang_id: "" });
    openModal("add");
  };

  const openEdit = (k) => {
    openModal("edit", k);
    setFormData({
      nom_kar: k.nom_kar || "",
      desc_kar: k.desc_kar || "",
      fiang_id: k.fiang_id?.toString() || ""
    });
  };

  const openDelete = (k) => openModal("delete", k);

  // --- Pagination ---
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const getPagesArray = () => {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  };

  // --- Filtrage simple ---
  const normalize = str => str?.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const filteredKartie = kartie.filter(k => {
    const search = normalize(debouncedSearch); 
    return (
      normalize(k.nom_kar ||  "").includes(search) ||
      normalize(k.desc_kar ||  "").includes(search) ||
      normalize(k.fiang_nom || "").includes(search)
    );
  });
  return {
    kartie,
    isDebouncing,
    fiangonanas,
    formData,
    handleInputChange,
    searchTerm,
    setSearchTerm,
    filteredKartie,
    modal,
    isOpen,
    closeModal,
    openAdd,
    openEdit,
    openDelete,
    addKartieHandler,
    editKartieHandler,
    deleteKartieHandler,
    currentPage,
    setCurrentPage,
    totalPages,
    nextPage,
    prevPage,
    getPagesArray,
    loading
  };
};
