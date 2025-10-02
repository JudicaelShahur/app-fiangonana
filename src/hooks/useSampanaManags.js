import { useState, useEffect } from "react";
import useModal from "./useModal.js";
import {
  listeSampanaManags,
  ajoutSampanaManag,
  modifierSampanaManag,
  supprimerSampanaManag,
  countMpinosParSampana,
} from "../services/sampanaManagService.js";
import { afficherToastSuccès, afficherToastErreur, getBackendMessage } from "../utils/toast.js";
import { listeMpinos } from "../services/mpinoService.js";
import { listeSampanas } from "../services/sampanaService.js";
import debounce from "lodash.debounce";

export const useSampanaManag = () => {
  const { modal, openModal, closeModal, isOpen } = useModal();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sampanaManags, setSampanaManags] = useState([]);
  const [stats, setStats] = useState([]);
  const [formData, setFormData] = useState({ sampana_id: "", mpino_id: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [loading, setLoading] = useState(false);
  const [isDebouncing, setIsDebouncing] = useState(false);

  // --- Debounce recherche ---
  useEffect(() => {
    setCurrentPage(1);
    setIsDebouncing(true);
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setIsDebouncing(false);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // --- Fetch SampanaManags ---
  const fetchSampanaManags = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const res = await listeSampanaManags(page, search);
      const data = Array.isArray(res.results?.data) ? res.results.data : [];
      setSampanaManags(data);
      setTotalPages(res.results?.last_page || 1);
    } catch (error) {
      afficherToastErreur(getBackendMessage(error));
    } finally {
      setLoading(false);
    }
  };

  // --- Fetch Stats ---
  const fetchStats = async () => {
    try {
      const res = await countMpinosParSampana();
      setStats(Array.isArray(res) ? res : []);
    } catch (error) {
      afficherToastErreur(getBackendMessage(error));
    }
  };

  useEffect(() => {
    fetchSampanaManags(currentPage, debouncedSearch);
    fetchStats();
  }, [currentPage, debouncedSearch]);


  const [mpinos, setMpinos] = useState([]);
  const [sampanas, setSampanas] = useState([]);

  // --- Async loaders ---
  const loadMpinos = debounce(async (inputValue, callback) => {
    try {
      const res = await listeMpinos(1, 10, inputValue);
      const options = res.results?.data?.map((mp) => ({
        value: mp.id,
        label: `${mp.nom} ${mp.prenom}`,
      })) || [];

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
  const loadSampanas = debounce(async (inputValue, callback) => {
    try {
      const res = await listeSampanas(1, 10, inputValue);
      const options = res.results?.data?.map((s) => ({
        value: s.id,
        label: s.nom_samp,
      })) || [];

      setSampanas((prev) => {
        const ids = new Set(prev.map(p => p.id));
        const newSampanas = res.results?.data?.filter(p => !ids.has(p.id)) || [];
        return [...prev, ...newSampanas];
      });

      callback(options);
    } catch {
      callback([]);
    }
  }, 500);


  // --- Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addHandler = async () => {
    try {
      await ajoutSampanaManag(formData);
      fetchSampanaManags(currentPage);
      closeModal();
      afficherToastSuccès("Association ajoutée avec succès !");
    } catch (error) {
      afficherToastErreur(getBackendMessage(error));
    }
  };

  const editHandler = async () => {
    try {
      await modifierSampanaManag(modal.data.id, formData);
      fetchSampanaManags(currentPage);
      closeModal();
      afficherToastSuccès("Association modifiée avec succès !");
    } catch (error) {
      afficherToastErreur(getBackendMessage(error));
    }
  };

  const deleteHandler = async () => {
    try {
      await supprimerSampanaManag(modal.data.id);
      fetchSampanaManags(currentPage);
      closeModal();
      afficherToastSuccès("Association supprimée avec succès !");
    } catch (error) {
      afficherToastErreur(getBackendMessage(error));
    }
  };

  // --- Modals ---
  const openAdd = () => {
    setFormData({ sampana_id: "", mpino_id: "" });
    openModal("add");
  };

  const openEdit = (item) => {
    setFormData({
      sampana_id: item.sampana_id?.toString() || "",
      mpino_id: item.mpino_id?.toString() || "",
    });
    openModal("edit", item);
  };

  const openDelete = (item) => {
    openModal("delete", {
      id: item.id,
      mpinoNom: `${item.mpino?.nom || ""} ${item.mpino?.prenom || ""}`.trim(),
      sampanaNom: item.sampana?.nom_samp || "",
    });
  };

  // --- Pagination utils ---
  const nextPage = () => currentPage < totalPages && setCurrentPage((p) => p + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage((p) => p - 1);
  const getPagesArray = () => Array.from({ length: totalPages }, (_, i) => i + 1);

  // --- Filtrage client-side simple ---
  const normalize = (str) =>
    str ? str.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";

  const filtered = sampanaManags.filter((s) => {
    const search = normalize(debouncedSearch);
    return (
      normalize(s.sampana?.nom_samp).includes(search) ||
      normalize(s.mpino?.nom).includes(search) ||
      normalize(s.mpino?.prenom).includes(search) ||
      normalize(new Date(s.created_at).toLocaleString()).includes(search)
    );
  });

  return {
    sampanaManags,
    stats,
    formData,
    handleInputChange,
    searchTerm,
    setSearchTerm,
    filtered,
    modal,
    isOpen,
    closeModal,
    openAdd,
    openEdit,
    openDelete,
    addHandler,
    editHandler,
    deleteHandler,
    currentPage,
    setCurrentPage,
    totalPages,
    nextPage,
    prevPage,
    getPagesArray,
    loading,
    setFormData,
    loadMpinos,
    loadSampanas,
    isDebouncing,
    mpinos,
    sampanas
  };
};
