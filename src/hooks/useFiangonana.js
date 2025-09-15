// src/hooks/useFiangonana.js
import { useState, useEffect } from "react";
import useModal from "./useModal";
import { 
  ajoutFiangonana, 
  modifierFiangonana, 
  supprimerFiangonana, 
  listeFiangonana 
} from "../services/fiangonanaService";
import { afficherToastSuccès, afficherToastErreur,getBackendMessage } from "../utils/toast";
import { saveToLocalStorage, loadFromLocalStorage } from "../utils/localStorageCrypto";

const STORAGE_KEY = "fiangonanas"; // Key ho an'ny cache

const useFiangonana = () => {
  const { modal, openModal, closeModal, isOpen } = useModal();

  //  State miaraka amin'ny cache encrypted
  const [fiangonanas, setFiangonanas] = useState(() => loadFromLocalStorage(STORAGE_KEY) || []);
  const [fiangonanaTerm, setFiangonanaTerm] = useState('');
  const [currentFiangonana, setCurrentFiangonana] = useState({
    name: '',
    photo: '',
    photoFile: null,
    email: '',
    phone: ''
  });

  // Fetch API sy update cache
  useEffect(() => {
    const fetchFiangonanas = async () => {
      try {
        const res = await listeFiangonana();
        const fiangFormatted = res.map(f => ({
          id: f.id,
          name: f.fiang_nom,
          photo: f.fiang_pho ? JSON.parse(f.fiang_pho).url : "",
          email: f.fiang_mail,
          phone: f.fiang_num,
          admin: f.admin_nom || "",
          address: f.fiang_kartie || ""
        }));
        setFiangonanas(fiangFormatted);
        saveToLocalStorage(STORAGE_KEY, fiangFormatted); 
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
      }
    };
    fetchFiangonanas();
  }, []);

  // Input change
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    const fieldMap = { fiang_nom: 'name', fiang_mail: 'email', fiang_num: 'phone' };
    const field = fieldMap[id];
    if (!field) return;
    setCurrentFiangonana({ ...currentFiangonana, [field]: value });
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
          photo: response.fiang_pho ? JSON.parse(response.fiang_pho).url : "",
          email: response.fiang_mail,
          phone: response.fiang_num,
          admin: response.admin_nom || "",
          address: response.fiang_address || ""
        };
        const updatedList = [...fiangonanas, newFiangonana];
        setFiangonanas(updatedList);
        saveToLocalStorage(STORAGE_KEY, updatedList);
        afficherToastSuccès(response.data || response.message || "Église ajoutée avec succès !");
      } else if (modal.type === "edit") {
        const response = await modifierFiangonana(currentFiangonana.id, currentFiangonana);
        const updated = {
          id: response.id,
          name: response.fiang_nom,
          photo: response.fiang_pho ? JSON.parse(response.fiang_pho).url : "",
          email: response.fiang_mail,
          phone: response.fiang_num,
          admin: response.admin_nom || "",
          address: response.fiang_address || ""
        };
        const updatedList = fiangonanas.map(f => f.id === updated.id ? updated : f);
        setFiangonanas(updatedList);
        saveToLocalStorage(STORAGE_KEY, updatedList);
        afficherToastSuccès(response.data || response.message || "Église modifiée avec succès !");
      }
      closeModal();
      setCurrentFiangonana({ name: '', photo: '', photoFile: null, email: '', phone: '' });
    } catch (error) {
      const messageErreur = getBackendMessage(error.response?.data || error);
      afficherToastErreur(messageErreur);
    }
  };

  // Search
  const handleSearch = (e) => setFiangonanaTerm(e.target.value);
  const filteredFiangonanas = fiangonanas.filter(f =>
    f.name.toLowerCase().includes(fiangonanaTerm.toLowerCase()) ||
    f.address?.toLowerCase().includes(fiangonanaTerm.toLowerCase()) ||
    f.admin?.toLowerCase().includes(fiangonanaTerm.toLowerCase())
  );

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
      const updatedList = fiangonanas.filter(f => f.id !== fiangonana.id);
      setFiangonanas(updatedList);
      saveToLocalStorage(STORAGE_KEY, updatedList);
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
    handleSearch,
    handleEdit,
    openDelete,
    handleDelete,
    handleFileChange,
    handleDrop,
    handleDragOver,
    openModal,
    closeModal,
    fiangonanaTerm,
  };
};

export default useFiangonana;
