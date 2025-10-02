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
import debounce from "lodash.debounce";
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

  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [isDebouncing, setIsDebouncing] = useState(false);

  // Debounce searchTerm
  useEffect(() => {
    setCurrentPage(1); 
    setIsDebouncing(true);
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm); 
      setIsDebouncing(false);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Charger Mpino + Kartie
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await listeMpinos(currentPage, perPage, debouncedSearch);
        const list = res.results?.data.map(mpino => {
          let photoObj = null;
          try { photoObj = mpino.photo ? JSON.parse(mpino.photo) : null; } catch { }
          let qrCodeObj = null;
          try { qrCodeObj = mpino.qrcode ? JSON.parse(mpino.qrcode) : null; } catch { }
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
    fetchData();
  }, [currentPage, perPage, debouncedSearch]);

  const [karties, setKarties] = useState([]);
  const loadKarties = debounce(async (inputValue, callback) => {
    try {
      const res = await listeKartie(1, inputValue);
      const options = res.results?.data?.map((k) => ({
        value: k.id,
        label: `${k.nom_kar}-${k.fiang_nom}`,
      })) || [];
      console.log("ity lery", options)

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

  const normalize = str => str?.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const filteredMpino = mpinoList.filter(mpino => {
    const search = normalize(debouncedSearch); // normalize ny recherche
    return (
      normalize(mpino.nom_mpin || mpino.nom || "").includes(search) ||
      normalize(mpino.prenom_mpin || mpino.prenom || "").includes(search) ||
      (mpino.num_mpin || mpino.numero || "").includes(debouncedSearch) ||
      normalize(mpino.kartie_nom || mpino.kartie || "").includes(search) 
    );
  });



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
    searchTerm, setSearchTerm, isDebouncing , formData, formErrors, isSubmitting, photoPreview,
    modal, isOpen, handleInputChange, handleFileChange, handleDrop, handleDragOver,
    handleAddMpino, handleEditMpino, handleDeleteMpino, openAdd, openEdit, openDelete,
    showQrCode, downloadFiche, filteredMpino, closeModal, karties, loadKarties, setFormData
  };
};
