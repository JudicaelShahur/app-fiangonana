import { useState, useEffect } from "react";
import useModal from "./useModal";
import { 
  ajoutFiangonana, 
  modifierFiangonana, 
  supprimerFiangonana, 
  listeFiangonana 
} from "../services/fiangonanaService";
import { afficherToastSuccès, afficherToastErreur, getBackendMessage } from "../utils/toast";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const useFiangonana = () => {
  const { modal, openModal, closeModal, isOpen } = useModal();

  const [loading, setLoading] = useState(true);
  const [fiangonanas, setFiangonanas] = useState([]);
  const [fiangonanaTerm, setFiangonanaTerm] = useState('');

  const [currentFiangonana, setCurrentFiangonana] = useState({
    name: '',
    photo: '',
    photoFile: null,
    email: '',
    phone: ''
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState(fiangonanaTerm);
  const [isDebouncing, setIsDebouncing] = useState(false);
  // Debounce search
  useEffect(() => {
    setCurrentPage(1);
    setIsDebouncing(true);
    const handler = setTimeout(() => {
      setDebouncedSearch(fiangonanaTerm);
      setIsDebouncing(false);
    }, 1000);
    return () => clearTimeout(handler);
  }, [fiangonanaTerm]);

  const parsePhoto = (pho) => {
    if (!pho) return "";
    try {
      // Cas 1: c'est une string JSON
      if (typeof pho === "string") {
        const parsed = JSON.parse(pho);
        return BASE_URL + parsed.url;
      }
      // Cas 2: c'est déjà un objet (grâce à $casts dans Laravel)
      if (typeof pho === "object" && pho.url) {
        return BASE_URL + pho.url;
      }
      return "";
    } catch (e) {
      console.error("Erreur parsing photo:", e);
      return "";
    }
  };

  // Fetch fiangonanas
  const fetchFiangonanas = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const res = await listeFiangonana(page, perPage, search);
      const data = res?.results?.data || [];
      setFiangonanas(data.map(f => ({
        id: f.id,
        name: f.fiang_nom,
        photo: parsePhoto(f.fiang_pho),
        email: f.fiang_mail,
        phone: f.fiang_num,
        admin: f.admin_nom || "",
        address: f.fiang_kartie || ""
      })));
      setTotalPages(res?.results?.last_page || 1);
    } catch (err) {
      afficherToastErreur(getBackendMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiangonanas(currentPage, debouncedSearch);
  }, [currentPage, debouncedSearch]);


  // Input change
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    const fieldMap = { fiang_nom: 'name', fiang_mail: 'email', fiang_num: 'phone' };
    const field = fieldMap[id];
    if (!field) return;
    setCurrentFiangonana(prev => ({ ...prev, [field]: value }));
  };

  // Add / Edit submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modal.type === "add") {
        const response = await ajoutFiangonana(currentFiangonana);
        const newFiangonana = {
          id: response.id,
          name: response.fiang_nom,
          photo: parsePhoto(response.fiang_pho),
          email: response.fiang_mail,
          phone: response.fiang_num,
          admin: response.admin_nom || "",
          address: response.fiang_address || ""
        };
        setFiangonanas(prev => [newFiangonana, ...prev]);
        afficherToastSuccès(response.data || response.message || "Église ajoutée avec succès !");
      } else if (modal.type === "edit") {
        const response = await modifierFiangonana(currentFiangonana.id, currentFiangonana);
        const updated = {
          id: response.id,
          name: response.fiang_nom,
          photo: parsePhoto(response.fiang_pho),
          email: response.fiang_mail,
          phone: response.fiang_num,
          admin: response.admin_nom || "",
          address: response.fiang_address || ""
        };
        setFiangonanas(prev => prev.map(f => f.id === updated.id ? updated : f));
        afficherToastSuccès(response.data || response.message || "Église modifiée avec succès !");
      }
      closeModal();
      setCurrentFiangonana({ name: '', photo: '', photoFile: null, email: '', phone: '' });
    } catch (error) {
      const messageErreur = getBackendMessage(error.response?.data || error);
      afficherToastErreur(messageErreur);
    }
  };

  // Filter frontend
  const normalize = str => str?.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const filteredFiangonanas = fiangonanas.filter(f => {
    const search = normalize(debouncedSearch);
    return (
      normalize(f.name || "").includes(search) ||
      normalize(f.address || "").includes(search) ||
      (f.phone || "").includes(debouncedSearch) ||
      normalize(f.admin || "").includes(search)
    );
  });

  // Edit
  const handleEdit = (fiangonana) => {
    setCurrentFiangonana({ ...fiangonana, photoFile: null });
    openModal("edit");
  };

  // Delete
  const openDelete = (fiangonana) => openModal("delete", fiangonana);
  const handleDelete = async (fiangonana) => {
    try {
      await supprimerFiangonana(fiangonana.id);
      setFiangonanas(prev => prev.filter(f => f.id !== fiangonana.id));
      closeModal();
      afficherToastSuccès("Église supprimée avec succès !");
    } catch (error) {
      const messageErreur = getBackendMessage(error.response?.data || error);
      afficherToastErreur(messageErreur);
    }
  };

  // Photo handling
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setCurrentFiangonana(prev => ({ ...prev, photo: reader.result, photoFile: file }));
    reader.readAsDataURL(file);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file?.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onloadend = () => setCurrentFiangonana(prev => ({ ...prev, photo: reader.result, photoFile: file }));
    reader.readAsDataURL(file);
  };
  const handleDragOver = (e) => e.preventDefault();

  return {
    fiangonanas: filteredFiangonanas,
    currentFiangonana,
    modal,
    isOpen,
    handleInputChange,
    handleSubmit,
    handleSearch: (e) => setFiangonanaTerm(e.target.value),
    handleEdit,
    openDelete,
    handleDelete,
    handleFileChange,
    handleDrop,
    handleDragOver,
    openModal,
    closeModal,
    fiangonanaTerm,
    loading,
    currentPage,
    totalPages,
    perPage,
    setCurrentPage,
    isDebouncing,
  };
};

export default useFiangonana;
