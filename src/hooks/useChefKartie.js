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
import debounce from "lodash.debounce";
export const useChefKartie = () => {
  const { modal, openModal, closeModal, isOpen } = useModal();

  // Pagination persistante
  const [currentPage, setCurrentPage] = useState(() => {});
  const [totalPages, setTotalPages] = useState(1);

  const [chefs, setChefs] = useState([]);
  const [formData, setFormData] = useState({ id_mpin: "", id_kar: "", annee_kar: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [isDebouncing, setIsDebouncing] = useState(false);

  // --- Debounce recherche ---
  useEffect(() => {
    setCurrentPage(1);
    setIsDebouncing(true);
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setIsDebouncing(false);
    }, 1000);
    return () => clearTimeout(handler);
  }, [searchTerm]);
  // --- Fetch ChefKartie ---
  const fetchChefs = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const res = await listeChefkartie(page, search);
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
    fetchChefs(currentPage, debouncedSearch);
  }, [currentPage, debouncedSearch]);

    const [mpinos, setMpinos] = useState([]);
    const [karties, setKarties] = useState([]);

  // --- Async loaders ---
  const loadMpinos = debounce(async (inputValue, callback) => {
    try {
      const res = await listeMpinos(1, 10, inputValue);
      const options = res.results?.data?.map((mp) => ({
        value: mp.id,
        label: `${mp.nom} ${mp.prenom}`,
      })) || [];
      console.log("ity lery1", options)

      // Mitahiry ny mpinos efa nalaina
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
  const loadKarties = debounce(async (inputValue, callback) => {
    try {
      const res = await listeKartie(1,inputValue); 
      const options = res.results?.data?.map((k) => ({
        value: k.id,
        label: `${k.nom_kar}-${k.fiang_nom}`,
      })) || [];
      console.log("ity lery",options)

      setKarties(prev => {
        const ids = new Set(prev.map(p => p.id));
        const newKarties = res.results?.data?.filter(k => !ids.has(k.id)) || [];
        return [...prev, ...newKarties];
      });

      callback(options);
    } catch {
      callback([]);
    }
  }, 500);

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
  const normalize = str => str?.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const filteredChefs = chefs.filter(c => {
    const search = normalize(debouncedSearch);
    return (
      normalize(c.mpino_nom || "").includes(search) ||
      normalize(c.mpino_prenom || "").includes(search) ||
      normalize(c.kartie_nom || "").includes(search) ||
      (c.annee_kar ? c.annee_kar.toString() : "").includes(search)
    );
  });

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
    loadMpinos,
    karties,
    loadKarties,
    setFormData,
    isDebouncing
  };
};
