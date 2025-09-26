import { useState, useEffect } from "react";
import { listeVola, ajoutVola, modifierVola, supprimerVola } from "../services/volaService";
import { afficherToastSuccès, afficherToastErreur } from "../utils/toast";

export const useVola = () => {
  // --- Modal & form states ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newVola, setNewVola] = useState({ montant: '', desc_vola: ''});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Search ---
  const [searchTerm, setSearchTerm] = useState('');

  // --- Pagination persistent ---
  const [currentPage, setCurrentPage] = useState(() => {});
  const [lastPage, setLastPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  // --- Volas data ---
  const [volas, setVolas] = useState([]);
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

  // --- Fetch Volas ---
  const fetchVolas = async (page = 1,search = "") => {
    setLoading(true);
    try {
      const data = await listeVola(page, perPage,search);

      const results = data.results;
      if (results && Array.isArray(results.data)) {
        setVolas(results.data);
        setCurrentPage(results.current_page);
        setLastPage(results.last_page);
        setTotal(results.total);
      } else {
        setVolas([]);
      }
    } catch (err) {
      setError(err.message || "Erreur lors du chargement des Vola.");
      afficherToastErreur(err.message || "Erreur lors du chargement des Vola.");
      setVolas([]);
    } finally {
      setLoading(false);
    }
  };

  // --- Auto fetch on page/perPage change ---
  useEffect(() => {
    fetchVolas(currentPage, debouncedSearch);
  }, [currentPage, perPage, debouncedSearch]);

  // --- Modal handlers ---
  const openModal = (vola = null) => {
    if (vola) {
      setNewVola(vola);
      setEditingId(vola.id);
    } else {
      setNewVola({ montant: '', desc_vola: ''});
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewVola({ montant: '', desc_vola: ''});
    setEditingId(null);
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVola({ ...newVola, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await modifierVola(editingId, newVola);
        afficherToastSuccès("Vola modifié avec succès !");
      } else {
        await ajoutVola(newVola);
        afficherToastSuccès("Vola ajouté avec succès !");
      }
      fetchVolas(currentPage);
      closeModal();
    } catch (err) {
      setError(err.message || "Erreur lors de la sauvegarde du Vola.");
      afficherToastErreur(err.message || "Erreur lors de la sauvegarde du Vola.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await supprimerVola(id);
      setVolas(volas.filter(v => v.id !== id));
      afficherToastSuccès("Vola supprimé avec succès !");
    } catch (err) {
      afficherToastErreur(err.message || "Erreur lors de la suppression.");
    } finally {
      setLoading(false);
    }
  };

  // --- Filtering ---
  const normalize = str => str?.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const filteredVolas = volas.filter(v => {
    const search = normalize(debouncedSearch);
    return (
      normalize(v.desc_vola || "").includes(search) ||
      (v.montant || "").includes(search)
     
    );
  });
  // --- Pagination handlers ---
  const nextPage = () => {
    if (currentPage < lastPage) setCurrentPage(prev => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= lastPage) setCurrentPage(page);
  };

  const getPagesArray = () => Array.from({ length: lastPage }, (_, i) => i + 1);

  return {
    volas,
    filteredVolas,
    searchTerm,
    setSearchTerm,
    isModalOpen,
    editingId,
    newVola,
    openModal,
    closeModal,
    handleInputChange,
    handleSubmit,
    handleDelete,
    loading,
    error,
    currentPage,
    setCurrentPage,
    lastPage,
    total,
    perPage,
    setPerPage,
    nextPage,
    prevPage,
    goToPage,
    getPagesArray,
    fetchVolas,
    isDebouncing
  };
};
