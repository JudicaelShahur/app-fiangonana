import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaSync, FaQrcode, FaDownload } from 'react-icons/fa';
import "../../styles/Mpino.css";
import useModal from "../../hooks/useModal";
import ConfirmDeleteModal from "../../utils/ConfirmDeleteModal";
import {
    listeMpinos,
    ajoutMpino,
    modifierMpino,
    supprimerMpino,
    telechargerPdfMpino
} from "../../services/mpinoService";
import { listeKartie } from "../../services/kartieService";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Mpino = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage] = useState(10); // nombre d'éléments par page
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const [mpinoList, setMpinoList] = useState([]);
    const [kartieList, setKartieList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        nom_mpin: '',
        prenom_mpin: '',
        naiss_mpin: '',
        is_vitaBatisa: false,
        date_batisa: '',
        num_mpin: '',
        sexe_mpin: '',
        talenta_mpin: '',
        is_mpandray: false,
        is_mpiandry: false,
        is_manambady: false,
        is_vitaSoratra: false,
        is_vitaMariazy: false,
        adress_mpin: '',
        id_kartie: '',
        photo_mpin: null
    });
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [photoPreview, setPhotoPreview] = useState(null);

    const { modal, openModal, closeModal, isOpen } = useModal();

    // Charger les Mpinos et Karties
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
        }
    };

    fetchData();
    fetchKartie();
}, [currentPage, perPage]);


    // Validation formulaire
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

    // Filtrer Mpinos
    const filteredMpino = mpinoList.filter(mpino =>
        (mpino.nom_mpin || mpino.nom || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (mpino.prenom_mpin || mpino.prenom || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (mpino.num_mpin || mpino.numero || '').includes(searchTerm) ||
        (mpino.kartie_nom || mpino.kartie || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Gestion input
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Photo
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

    // Ajouter Mpino
    const handleAddMpino = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const dataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key] !== undefined && formData[key] !== null && formData[key] !== '') {
                    if (key === 'photo_mpin' && formData[key] instanceof File) {
                        dataToSend.append(key, formData[key]);
                    } else if ([
                        'is_vitaBatisa', 'is_mpandray', 'is_mpiandry', 'is_manambady', 'is_vitaSoratra', 'is_vitaMariazy'
                    ].includes(key)) {
                        dataToSend.append(key, formData[key] ? 1 : 0);
                    } else {
                        dataToSend.append(key, formData[key]);
                    }
                }
            });

            const res = await ajoutMpino(dataToSend);
            const newMpino = res.data || res.results || res;
            setMpinoList(prev => [...prev, newMpino]);
            closeModal();
        } catch (error) {
            console.error("Erreur lors de l'ajout:", error);
            if (error.errors) {
                setFormErrors(error.errors);
            } else {
                alert(error.message || "Une erreur s'est produite lors de l'ajout");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Edit Mpino
    const handleEditMpino = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const dataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key] !== undefined && formData[key] !== null && formData[key] !== '') {
                    if (key === 'photo_mpin' && formData[key] instanceof File) {
                        dataToSend.append(key, formData[key]);
                    } else if ([
                        'is_vitaBatisa', 'is_mpandray', 'is_mpiandry', 'is_manambady', 'is_vitaSoratra', 'is_vitaMariazy'
                    ].includes(key)) {
                        dataToSend.append(key, formData[key] ? 1 : 0);
                    } else {
                        dataToSend.append(key, formData[key]);
                    }
                }
            });

            const res = await modifierMpino(modal.data.id, dataToSend);
            const updatedMpino = res.data || res.results || res;
            setMpinoList(prev =>
                prev.map(mpino => mpino.id === modal.data.id ? updatedMpino : mpino)
            );
            closeModal();
        } catch (error) {
            console.error("Erreur lors de la modification:", error);
            if (error.errors) {
                setFormErrors(error.errors);
            } else {
                alert(error.message || "Une erreur s'est produite lors de la modification");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Delete Mpino
    const handleDeleteMpino = async () => {
        try {
            await supprimerMpino(modal.data.id);
            setMpinoList(prev => prev.filter(mpino => mpino.id !== modal.data.id));
            closeModal();
        } catch (error) {
            console.error("Erreur lors de la suppression:", error.message);
            alert(error.message || "Une erreur s'est produite lors de la suppression");
        }
    };

    // Modal open
    const openAdd = () => {
        setFormData({
            nom_mpin: '', prenom_mpin: '', naiss_mpin: '',
            is_vitaBatisa: false, date_batisa: '', num_mpin: '', sexe_mpin: '',
            talenta_mpin: '', is_mpandray: false, is_mpiandry: false,
            is_manambady: false, is_vitaSoratra: false, is_vitaMariazy: false,
            adress_mpin: '', id_kartie: '', photo_mpin: null
        });
        setPhotoPreview(null);
        setFormErrors({});
        openModal("add");
    };

    const openEdit = (mpino) => {
        setFormData({
            nom_mpin: mpino.nom_mpin || mpino.nom || '',
            prenom_mpin: mpino.prenom_mpin || mpino.prenom || '',
            naiss_mpin: mpino.naiss_mpin || '',
            is_vitaBatisa: mpino.is_vitaBatisa || false,
            date_batisa: mpino.date_batisa || '',
            num_mpin: mpino.num_mpin || mpino.numero || '',
            sexe_mpin: mpino.sexe_mpin || mpino.sexe || '',
            talenta_mpin: mpino.talenta_mpin || mpino.talenta || '',
            is_mpandray: mpino.is_mpandray || false,
            is_mpiandry: mpino.is_mpiandry || false,
            is_manambady: mpino.is_manambady || false,
            is_vitaSoratra: mpino.is_vitaSoratra || false,
            is_vitaMariazy: mpino.is_vitaMariazy || false,
            adress_mpin: mpino.adress_mpin || mpino.adress || '',
            id_kartie: mpino.id_kartie || kartieList.find(k => k.nom === (mpino.kartie_nom || mpino.kartie))?.id || '',
            photo_mpin: mpino.photo_mpin instanceof File ? mpino.photo_mpin : null
        });

        setPhotoPreview(
            mpino.photo_mpin instanceof File
                ? URL.createObjectURL(mpino.photo_mpin)
                : mpino.photo?.url
                    ? `${BASE_URL}${mpino.photo.url}`
                    : null
        );

        setFormErrors({});
        openModal("edit", mpino);
    };

    const openDelete = (mpino) => openModal("delete", mpino);

    // QR Code
    const showQrCode = (mpino) => {
        const qrCode = mpino.qr_code || mpino.qrcode;
        alert(`QR Code de ${mpino.nom_mpin || mpino.nom} ${mpino.prenom_mpin || mpino.prenom}: ${qrCode?.url || qrCode || 'Non disponible'}`);
    };

    // Télécharger fiche
    const downloadFiche = async (mpino) => {
        try {
            const data = await telechargerPdfMpino(mpino.id); 
            const url = window.URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `fiche_${mpino.id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Erreur lors du téléchargement PDF:", error.message);
            alert(error.message || "Une erreur s'est produite lors du téléchargement");
        }
    };


    // Rendu
    return (
        <div className="mpino-management">
            <div className="pageMpino-header">
                <h1>Gestion des Mpino</h1>
                <button className="btnMpino btn-primary" onClick={openAdd}>
                    <FaPlus /> Nouveau Mpino
                </button>
            </div>

            <div className="searchMpino-bar">
                <div className="searchMpino-input">
                    <FaSearch />
                    <input
                        type="text"
                        placeholder="Rechercher par nom, prénom, numéro ou kartie..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="searchMpino-stats">{filteredMpino.length} mpino(s) trouvé(s)</div>
            </div>

            <div className="mpino-grid">
                {loading ? (
                    <div className="loading">
                        <div className="spinner"></div>
                        <div className='loader'></div>
                    </div>
                ) : filteredMpino.length > 0 ? (
                    filteredMpino.map(mpino => (
                        <div key={mpino.id} className="mpino-card">
                            <div className="cardMpino-header">
                                <img
                                    src={mpino.photo?.url ? `${BASE_URL}${mpino.photo.url}` : '/placeholder.png'}
                                    alt={`${mpino.prenom_mpin || mpino.prenom} ${mpino.nom_mpin || mpino.nom}`}
                                />
                                <div className="mpino-info">
                                    <h3>{mpino.prenom} {mpino.nom}</h3>
                                    <p>{mpino.numero}</p>
                                    <span className={`statusMpino ${mpino.is_sync ? 'synced' : 'not-synced'}`}>
                                        <FaSync /> {mpino.is_sync ? 'Synchronisé' : 'Non synchronisé'}
                                    </span>
                                </div>
                            </div>

                            <div className="cardMpino-details">
                                <div className="detailMpino-item"><strong>Sexe:</strong> {mpino.sexe}</div>
                                <div className="detailMpino-item"><strong>Talenta:</strong> {mpino.talenta}</div>
                                <div className="detailMpino-item"><strong>Kartie:</strong> {mpino.kartie}</div>
                                <div className="detailMpino-item"><strong>Fiangonana:</strong> {mpino.fiangonana}</div>
                            </div>

                            <div className="cardMpino-actions">
                                <button className="btnMpino-icon" onClick={() => showQrCode(mpino)}><FaQrcode /></button>
                                <button className="btnMpino-icon" onClick={() => downloadFiche(mpino)}><FaDownload /></button>
                                <button className="btnMpino-icon" onClick={() => openEdit(mpino)}><FaEdit /></button>
                                <button className="btnMpino-icon btn-danger" onClick={() => openDelete(mpino)}><FaTrash /></button>
                            </div>

                        </div>
                    ))
                ) : (
                    <p>Aucun mpino trouvé.</p>
                )}
                
            </div>
            <div className="pagination">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Précédent
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={currentPage === page ? 'active' : ''}
                    >
                        {page}
                    </button>
                ))}

                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Suivant
                </button>
            </div>


            {/* Modal Add/Edit */}
            {(isOpen("add") || isOpen("edit")) && (
                <div className="modalMpino-overlay">
                    <div className="modalMpino">
                        <div className="modalMpino-header">
                            <h2>{isOpen("add") ? 'Ajouter un Nouveau Mpino' : 'Modifier le Mpino'}</h2>
                            <button className="modalMpino-close" onClick={closeModal}>×</button>
                        </div>

                        <form className="modalMpino-form" onSubmit={(e) => { e.preventDefault(); isOpen("add") ? handleAddMpino() : handleEditMpino(); }}>
                            <div className="formMpino-grid">

                                {/* Photo */}
                                <div className="formMpino-group photo-dropzone" onDrop={handleDrop} onDragOver={handleDragOver}>
                                    <label>Photo</label>
                                    <input
                                        type="file"
                                        name="photo_mpin"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                    {photoPreview && (
                                        <div className="photo-preview">
                                            <img src={photoPreview} alt="Preview" />
                                        </div>
                                    )}
                                    <p>Ou glissez votre image ici</p>
                                </div>

                                {/* Nom */}
                                <div className="formMpino-group">
                                    <label>Nom *</label>
                                    <input
                                        type="text"
                                        name="nom_mpin"
                                        value={formData.nom_mpin || ''}
                                        onChange={handleInputChange}
                                        className={formErrors.nom_mpin ? 'error' : ''}
                                        required
                                    />
                                    {formErrors.nom_mpin && <span className="error-text">{formErrors.nom_mpin}</span>}
                                </div>

                                {/* Prénom */}
                                <div className="formMpino-group">
                                    <label>Prénom *</label>
                                    <input
                                        type="text"
                                        name="prenom_mpin"
                                        value={formData.prenom_mpin || ''}
                                        onChange={handleInputChange}
                                        className={formErrors.prenom_mpin ? 'error' : ''}
                                        required
                                    />
                                    {formErrors.prenom_mpin && <span className="error-text">{formErrors.prenom_mpin}</span>}
                                </div>

                                {/* Date de naissance */}
                                <div className="formMpino-group">
                                    <label>Date de naissance *</label>
                                    <input
                                        type="date"
                                        name="naiss_mpin"
                                        value={formData.naiss_mpin || ''}
                                        onChange={handleInputChange}
                                        className={formErrors.naiss_mpin ? 'error' : ''}
                                        required
                                    />
                                    {formErrors.naiss_mpin && <span className="error-text">{formErrors.naiss_mpin}</span>}
                                </div>

                                {/* Numéro */}
                                <div className="formMpino-group">
                                    <label>Numéro de téléphone</label>
                                    <input
                                        type="tel"
                                        name="num_mpin"
                                        value={formData.num_mpin || ''}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                {/* Sexe */}
                                <div className="formMpino-group">
                                    <label>Sexe *</label>
                                    <select
                                        name="sexe_mpin"
                                        value={formData.sexe_mpin || ''}
                                        onChange={handleInputChange}
                                        className={formErrors.sexe_mpin ? 'error' : ''}
                                        required
                                    >
                                        <option value="">Sélectionner</option>
                                        <option value="M">Homme</option>
                                        <option value="F">Femme</option>
                                    </select>
                                    {formErrors.sexe_mpin && <span className="error-text">{formErrors.sexe_mpin}</span>}
                                </div>

                                {/* Talenta */}
                                <div className="formMpino-group">
                                    <label>Talenta</label>
                                    <input
                                        type="text"
                                        name="talenta_mpin"
                                        value={formData.talenta_mpin || ''}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                {/* Adresse */}
                                <div className="formMpino-group">
                                    <label>Adresse</label>
                                    <input
                                        type="text"
                                        name="adress_mpin"
                                        value={formData.adress_mpin || ''}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                {/* Kartie */}
                                <div className="formMpino-group">
                                    <label>Kartie *</label>
                                    <select
                                        name="id_kartie"
                                        value={formData.id_kartie || ''}
                                        onChange={handleInputChange}
                                        className={formErrors.id_kartie ? 'error' : ''}
                                        required
                                    >
                                        <option value="">Sélectionner</option>
                                        {kartieList.map(k => (
                                            <option key={k.id} value={k.id}>
                                                {k.nom_kar}
                                            </option>
                                        ))}
                                    </select>
                                    {formErrors.id_kartie && <span className="error-text">{formErrors.id_kartie}</span>}
                                </div>

                                {/* Checkbox divers */}
                                {[
                                    { name: 'is_vitaBatisa', label: 'Vita Batisa' },
                                    { name: 'is_mpandray', label: 'Mpandray' },
                                    { name: 'is_mpiandry', label: 'Mpiandry' },
                                    { name: 'is_manambady', label: 'Manambady' },
                                    { name: 'is_vitaSoratra', label: 'Vita Soratra' },
                                    { name: 'is_vitaMariazy', label: 'Vita Mariazy' }
                                ].map(({ name, label }) => (
                                    <div className="formMpino-group" key={name}>
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                name={name}
                                                checked={formData[name] || false}
                                                onChange={handleInputChange}
                                            />
                                            {label}
                                        </label>
                                    </div>
                                ))}

                                {formData.is_vitaBatisa && (
                                    <div className="formMpino-group">
                                        <label>Date de batisa</label>
                                        <input
                                            type="date"
                                            name="date_batisa"
                                            value={formData.date_batisa || ''}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                )}
                            

                            </div>

                            <div className="modalMpino-actions">
                                <button type="button" onClick={closeModal}>Annuler</button>
                                <button className="save-komitie-btn" type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Traitement...' : (isOpen("add") ? "Ajouter" : "Modifier")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isOpen("delete") && modal.data && (
                <ConfirmDeleteModal
                    isOpen={true}
                    onClose={closeModal}
                    onConfirm={handleDeleteMpino}
                    message={`Êtes-vous sûr de vouloir supprimer le mpino "${modal.data.prenom_mpin || modal.data.prenom} ${modal.data.nom_mpin || modal.data.nom}" ?`}
                />
            )}
        </div>
    );
};

export default Mpino;
