import { useState, useEffect } from "react";
import useModal from "./useModal";
import { ajoutFiangonana, modifierFiangonana, supprimerFiangonana, listeFiangonana } from "../services/fiangonanaService";

const useFiangonana = () => {
  const { modal, openModal, closeModal, isOpen } = useModal();

  const [fiangonanas, setFiangonanas] = useState([]);
  const [fiangonanaTerm, setFiangonanaTerm] = useState('');
  const [currentFiangonana, setCurrentFiangonana] = useState({
    name: '',
    photo: '',
    email: '',
    phone: ''
  });

  // Charger la liste depuis le backend au montage
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
        admin: f.admin_nom,
        address: f.fiang_address || ""
      }));
      setFiangonanas(fiangFormatted);
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
      setFiangonanas([]);
    }
  };
  fetchFiangonanas();
}, []);

  // Input change
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    const fieldMap = {
      fiang_nom: 'name',
      fiang_pho: 'photo',
      fiang_mail: 'email',
      fiang_num: 'phone'
    };
    const field = fieldMap[id];
    if (!field) return;
    setCurrentFiangonana({ ...currentFiangonana, [field]: value });
  };

  // Add / Edit submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modal.type === "add") {
        const newFiangonana = await ajoutFiangonana(currentFiangonana);
        setFiangonanas(prev => [...prev, newFiangonana]);
        alert('Église ajoutée avec succès !');
      } else if (modal.type === "edit") {
        const updated = await modifierFiangonana(currentFiangonana.id, currentFiangonana);
        setFiangonanas(prev => prev.map(f => f.id === updated.id ? updated : f));
        alert('Église modifiée avec succès !');
      }
      closeModal();
      setCurrentFiangonana({ name: '', photo: '', email: '', phone: '' });
    } catch (error) {
      alert("Erreur: " + (error.message || JSON.stringify(error)));
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
    setCurrentFiangonana(fiangonana);
    openModal("edit");
  };

  // Delete
  const openDelete = (fiangonana) => openModal("delete", fiangonana);
  const handleDelete = async (fiangonana) => {
    try {
      await supprimerFiangonana(fiangonana.id);
      setFiangonanas(prev => prev.filter(f => f.id !== fiangonana.id));
      closeModal();
      alert("Église supprimée avec succès !");
    } catch (error) {
      alert("Erreur: " + (error.message || JSON.stringify(error)));
    }
  };

  // Photo handling
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setCurrentFiangonana(prev => ({ ...prev, photo: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file?.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onloadend = () => setCurrentFiangonana(prev => ({ ...prev, photo: reader.result }));
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
