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

export const useSampanaManag = () => {
  const { modal, openModal, closeModal, isOpen } = useModal();

  // --- Pagination ---
  const [currentPage, setCurrentPage] = useState(() => {
    const saved = localStorage.getItem("sampanaManagPage");
    return saved ? Number(saved) : 1;
  });
  useEffect(() => {
    localStorage.setItem("sampanaManagPage", currentPage);
  }, [currentPage]);

  const [totalPages, setTotalPages] = useState(1);

  // --- States ---
  const [sampanaManags, setSampanaManags] = useState([]);
  const [stats, setStats] = useState([]); // pour countMpinos
  const [formData, setFormData] = useState({ sampana_id: "", mpino_id: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // --- Fetch SampanaManags ---
  const fetchSampanaManags = async (page = 1) => {
    try {
      setLoading(true);
      const res = await listeSampanaManags(page);
        console.log("donne sampana", res);
      const data = Array.isArray(res.results.data) ? res.results.data : [];
      setSampanaManags(data);
      setTotalPages(res.results.last_page || 1);
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
    fetchSampanaManags(currentPage);
    fetchStats();
  }, [currentPage]);

    const [mpinos, setMpinos] = useState([]);
    const [sampanas, setSampanas] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resMpino = await listeMpinos();
                console.log('donne mpino', resMpino);
                setMpinos(resMpino.results?.data || []);

                const resFiang = await listeSampanas();
                console.log('donne sampana', resFiang);
                setSampanas(resFiang.results?.data || []);
            } catch (error) {
                afficherToastErreur(getBackendMessage(error));
            }
        };
        fetchData();
    }, []);
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
    openModal("edit", item);
    setFormData({
      sampana_id: item.sampana_id?.toString() || "",
      mpino_id: item.mpino_id?.toString() || "",
    });
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

  // --- Filtrage simple ---
  const filtered = sampanaManags.filter(
  (s) =>
    (s.sampana?.nom_samp || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.mpino?.nom || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.mpino?.prenom || "").toLowerCase().includes(searchTerm.toLowerCase())
);


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
    mpinos,
    sampanas
  };
};
