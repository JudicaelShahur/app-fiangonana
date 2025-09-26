import { useState, useEffect } from "react";
import { listeUsers, ajoutUser, modifierUser, supprimerUser } from "../services/utilisateurService";

export const useUtilisateurs = () => {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [formData, setFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // --- Pagination ---
  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = localStorage.getItem("utilisateurPage");
    return savedPage ? Number(savedPage) : 1;
  });
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    localStorage.setItem("utilisateurPage", currentPage);
  }, [currentPage]);

  // --- Fetch utilisateurs ---
    const fetchUtilisateurs = async (page = 1) => {
        setLoading(true);
        try {
            const res = await listeUsers(page);
            setUtilisateurs(res.data || []);
            setTotalPages(res.last_page || 1);
        } catch (error) {
            console.error("Erreur lors du chargement des utilisateurs :", error);
        } finally {
            setLoading(false);
        }
    };


  useEffect(() => {
    fetchUtilisateurs(currentPage);
  }, [currentPage]);

  const filteredUtilisateurs = utilisateurs.filter(
    u =>
      u.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.fiang_nom?.toLowerCase().includes(searchTerm.toLowerCase())||
      u.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- CRUD ---
  const addUtilisateur = async () => {
    try {
      await ajoutUser(formData);
      fetchUtilisateurs(currentPage);
      setFormData({});
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
    }
  };

  const editUtilisateur = async (id) => {
    try {
      await modifierUser(id, formData);
      fetchUtilisateurs(currentPage);
      setFormData({});
    } catch (error) {
      console.error("Erreur lors de la modification :", error);
    }
  };

  const deleteUtilisateur = async (id) => {
    try {
      await supprimerUser(id);
      fetchUtilisateurs(currentPage);
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- Pagination helpers ---
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const getPagesArray = () => Array.from({ length: totalPages }, (_, i) => i + 1);

  return {
    utilisateurs,
    filteredUtilisateurs,
    formData,
    setFormData,
    searchTerm,
    setSearchTerm,
    handleInputChange,
    addUtilisateur,
    editUtilisateur,
    deleteUtilisateur,
    loading,
    fetchUtilisateurs,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    getPagesArray,
    setCurrentPage
  };
};
