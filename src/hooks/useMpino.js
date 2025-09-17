import { useState, useEffect } from "react";
import useModal from "./useModal";
import {
  listeMpinos,
  ajoutMpino,
  modifierMpino,
  supprimerMpino,
  telechargerPdfMpino
} from "../services/mpinoService";
import { listeKartie } from "../services/kartieService";
import { afficherToastSuccès, afficherToastErreur } from "../utils/toast";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useMpino = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [mpinoList, setMpinoList] = useState([]);
  const [kartieList, setKartieList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    nom_mpin: "",
    prenom_mpin: "",
    naiss_mpin: "",
    is_vitaBatisa: false,
    date_batisa: "",
    num_mpin: "",
    sexe_mpin: "",
    talenta_mpin: "",
    is_mpandray: false,
    is_mpiandry: false,
    is_manambady: false,
    is_vitaSoratra: false,
    is_vitaMariazy: false,
    adress_mpin: "",
    id_kartie: "",
    photo_mpin: null
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  const { modal, openModal, closeModal, isOpen } = useModal();

  

  //  Charger Mpino + Kartie
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await listeMpinos(currentPage, perPage);
        const list = res.results?.data.map(mpino => {
          let photoObj = null;
          try { photoObj = mpino.photo ? JSON.parse(mpino.photo) : null; } catch {}
          let qrCodeObj = null;
          try { qrCodeObj = mpino.qrcode ? JSON.parse(mpino.qrcode) : null; } catch {}
          return { ...mpino, photo: photoObj, qrcode: qrCodeObj };
        });
        setMpinoList(list);
        setTotalPages(res.results?.last_page || 1);
      } catch (error) {
        console.error("Erreur Mpino:", error.message);
        setMpinoList([]);
        afficherToastErreur("Erreur lors du chargement des mpinos");
      } finally {
        setLoading(false);
      }
    };

    const fetchKartie = async () => {
      try {
        const res = await listeKartie();
        const data = Array.isArray(res.results.data) ? res.results.data : [];
        setKartieList(data);
      } catch (error) {
        console.error("Erreur Kartie:", error.message);
        afficherToastErreur("Erreur lors du chargement des karties");
      }
    };

    fetchData();
    fetchKartie();
  }, [currentPage, perPage]);

  //  Validation
  const validateForm = () => {
    const errors = {};
    if (!formData.nom_mpin) errors.nom_mpin = "Le nom est requis";
    if (!formData.prenom_mpin) errors.prenom_mpin = "Le prénom est requis";
    if (!formData.naiss_mpin) errors.naiss_mpin = "La date de naissance est requise";
    if (!formData.sexe_mpin) errors.sexe_mpin = "Le sexe est requis";
    if (!formData.id_kartie) errors.id_kartie = "Le kartie est requis";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  //  Filtrage
  const filteredMpino = mpinoList.filter(mpino =>
    (mpino.nom_mpin || mpino.nom || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (mpino.prenom_mpin || mpino.prenom || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (mpino.num_mpin || mpino.numero || "").includes(searchTerm) ||
    (mpino.kartie_nom || mpino.kartie || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  //  Inputs
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, photo_mpin: file }));
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setFormData(prev => ({ ...prev, photo_mpin: file }));
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  //  CRUD avec Toast
  const handleAddMpino = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const dataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== undefined && formData[key] !== null && formData[key] !== "") {
          if (key === "photo_mpin" && formData[key] instanceof File) dataToSend.append(key, formData[key]);
          else if (["is_vitaBatisa","is_mpandray","is_mpiandry","is_manambady","is_vitaSoratra","is_vitaMariazy"].includes(key)) 
            dataToSend.append(key, formData[key] ? 1 : 0);
          else dataToSend.append(key, formData[key]);
        }
      });

      const res = await ajoutMpino(dataToSend);
      const newMpino = res.data || res.results || res;
      setMpinoList(prev => [...prev, newMpino]);
      closeModal();
      afficherToastSuccès("Mpino ajouté avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
      if (error.errors) setFormErrors(error.errors);
      else afficherToastErreur(error.message || "Erreur lors de l'ajout");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditMpino = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const dataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== undefined && formData[key] !== null && formData[key] !== "") {
          if (key === "photo_mpin" && formData[key] instanceof File) dataToSend.append(key, formData[key]);
          else if (["is_vitaBatisa","is_mpandray","is_mpiandry","is_manambady","is_vitaSoratra","is_vitaMariazy"].includes(key))
            dataToSend.append(key, formData[key] ? 1 : 0);
          else dataToSend.append(key, formData[key]);
        }
      });

      const res = await modifierMpino(modal.data.id, dataToSend);
      const updatedMpino = res.data || res.results || res;
      setMpinoList(prev => prev.map(mpino => (mpino.id === modal.data.id ? updatedMpino : mpino)));
      closeModal();
      afficherToastSuccès("Mpino modifié avec succès !");
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
      if (error.errors) setFormErrors(error.errors);
      else afficherToastErreur(error.message || "Erreur lors de la modification");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMpino = async () => {
    try {
      await supprimerMpino(modal.data.id);
      setMpinoList(prev => prev.filter(mpino => mpino.id !== modal.data.id));
      closeModal();
      afficherToastSuccès("Mpino supprimé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error.message);
      afficherToastErreur(error.message || "Erreur lors de la suppression");
    }
  };

  //  Modal
  const openAdd = () => {
    setFormData({
      nom_mpin: "", prenom_mpin: "", naiss_mpin: "", is_vitaBatisa: false,
      date_batisa: "", num_mpin: "", sexe_mpin: "", talenta_mpin: "",
      is_mpandray: false, is_mpiandry: false, is_manambady: false,
      is_vitaSoratra: false, is_vitaMariazy: false, adress_mpin: "",
      id_kartie: "", photo_mpin: null
    });
    setPhotoPreview(null);
    setFormErrors({});
    openModal("add");
  };

  const openEdit = (mpino) => {
    setFormData({
      nom_mpin: mpino.nom_mpin || mpino.nom || "",
      prenom_mpin: mpino.prenom_mpin || mpino.prenom || "",
      naiss_mpin: mpino.naiss_mpin || "",
      is_vitaBatisa: mpino.is_vitaBatisa || false,
      date_batisa: mpino.date_batisa || "",
      num_mpin: mpino.num_mpin || mpino.numero || "",
      sexe_mpin: mpino.sexe_mpin || mpino.sexe || "",
      talenta_mpin: mpino.talenta_mpin || mpino.talenta || "",
      is_mpandray: mpino.is_mpandray || false,
      is_mpiandry: mpino.is_mpiandry || false,
      is_manambady: mpino.is_manambady || false,
      is_vitaSoratra: mpino.is_vitaSoratra || false,
      is_vitaMariazy: mpino.is_vitaMariazy || false,
      adress_mpin: mpino.adress_mpin || mpino.adress || "",
      id_kartie: mpino.id_kartie || kartieList.find(k => k.nom === (mpino.kartie_nom || mpino.kartie))?.id || "",
      photo_mpin: mpino.photo_mpin instanceof File ? mpino.photo_mpin : null
    });

    setPhotoPreview(
      mpino.photo_mpin instanceof File ? URL.createObjectURL(mpino.photo_mpin)
      : mpino.photo?.url ? `${BASE_URL}${mpino.photo.url}` : null
    );

    setFormErrors({});
    openModal("edit", mpino);
  };

  const openDelete = (mpino) => openModal("delete", mpino);

  //  QR + PDF
  const showQrCode = (mpino) => {
    const qrCode = mpino.qr_code || mpino.qrcode;
    alert(`QR Code de ${mpino.nom_mpin || mpino.nom} ${mpino.prenom_mpin || mpino.prenom}: ${qrCode?.url || qrCode || "Non disponible"}`);
  };
const downloadFiche = async (mpino) => {
  try {
    const blob = await telechargerPdfMpino(mpino.id);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `fiche_${mpino.id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    afficherToastSuccès("Téléchargement PDF réussi !");
  } catch (error) {
    console.error("Erreur lors du téléchargement PDF:", error.message);
    afficherToastErreur(error.message || "Erreur lors du téléchargement");
  }
};


  return {
    currentPage, setCurrentPage, totalPages, loading, mpinoList, kartieList,
    searchTerm, setSearchTerm, formData, formErrors, isSubmitting, photoPreview,
    modal, isOpen, handleInputChange, handleFileChange, handleDrop, handleDragOver,
    handleAddMpino, handleEditMpino, handleDeleteMpino, openAdd, openEdit, openDelete,
    showQrCode, downloadFiche, filteredMpino, closeModal
  };
};
