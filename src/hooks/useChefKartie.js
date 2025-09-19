import { useState, useEffect } from "react";
import useModal from "./useModal.js";
import {
  listeChefkartie,
  ajoutChefkartie,
  modifierChefkartie,
  supprimerChefkartie
} from "../services/chefkartieService.js";
import { afficherToastSuccès, afficherToastErreur, getBackendMessage } from "../utils/toast.js";
import { listeMpinos } from "../services/mpinoService.js";
import { listeKartie } from "../services/kartieService.js";

export const useChefKartie = () => {
  const { modal, openModal, closeModal, isOpen } = useModal();

  // Pagination persistante
  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = localStorage.getItem("chefCurrentPage");
    return savedPage ? Number(savedPage) : 1;
  });
  const [totalPages, setTotalPages] = useState(1);

  const [chefs, setChefs] = useState([]);
  const [formData, setFormData] = useState({ id_mpin: "", id_kar: "", annee_kar: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("chefCurrentPage", currentPage);
  }, [currentPage]);

  // --- Fetch ChefKartie ---
  const fetchChefs = async (page = 1) => {
    try {
      setLoading(true);
      const res = await listeChefkartie(page);
      const data = Array.isArray(res.results.data) ? res.results.data : [];
      setChefs(data);
      setTotalPages(res.results.last_page || 1);
    } catch (error) {
      afficherToastErreur(getBackendMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChefs(currentPage);
  }, [currentPage]);

    const [mpinos, setMpinos] = useState([]);
    const [karties, setKarties] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resMpino = await listeMpinos();
                setMpinos(resMpino.results?.data || []);
                const resFiang = await listeKartie();
                setKarties(resFiang.results?.data || []);
            } catch (error) {
                afficherToastErreur(getBackendMessage(error));
            }
        };
        fetchData();
    }, []);
  // --- Form Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addChefHandler = async () => {
    try {
      await ajoutChefkartie(formData);
      fetchChefs(currentPage);
      closeModal();
      afficherToastSuccès("ChefKartie ajouté avec succès !");
    } catch (error) {
      afficherToastErreur(getBackendMessage(error));
    }
  };

  const editChefHandler = async () => {
    try {
      await modifierChefkartie(modal.data.id, formData);
      fetchChefs(currentPage);
      closeModal();
      afficherToastSuccès("ChefKartie modifié avec succès !");
    } catch (error) {
      afficherToastErreur(getBackendMessage(error));
    }
  };

  const deleteChefHandler = async () => {
    try {
      await supprimerChefkartie(modal.data.id);
      fetchChefs(currentPage);
      closeModal();
      afficherToastSuccès("ChefKartie supprimé avec succès !");
    } catch (error) {
      afficherToastErreur(getBackendMessage(error));
    }
  };

  // --- Modals ---
  const openAdd = () => {
    setFormData({ id_mpin: "", id_kar: "", annee_kar: "" });
    openModal("add");
  };

  const openEdit = (chef) => {
    openModal("edit", chef);
    setFormData({
      id_mpin: chef.id_mpin || "",
      id_kar: chef.id_kar || "",
      annee_kar: chef.annee_kar || ""
    });
  };

  const openDelete = (chef) => openModal("delete", chef);

  // --- Pagination ---
  const nextPage = () => currentPage < totalPages && setCurrentPage(prev => prev + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(prev => prev - 1);
  const getPagesArray = () => Array.from({ length: totalPages }, (_, i) => i + 1);

  // --- Filtrage simple ---
  const filteredChefs = chefs.filter(c =>
    // (c.id_mpin || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    // (c.id_kar || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.kartie_nom || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.fiang_nom || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    chefs,
    formData,
    handleInputChange,
    searchTerm,
    setSearchTerm,
    filteredChefs,
    modal,
    isOpen,
    closeModal,
    openAdd,
    openEdit,
    openDelete,
    addChefHandler,
    editChefHandler,
    deleteChefHandler,
    currentPage,
    setCurrentPage,
    totalPages,
    nextPage,
    prevPage,
    getPagesArray,
    loading,
    mpinos,
    karties,
    setFormData
  };
};
