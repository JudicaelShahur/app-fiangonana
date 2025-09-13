import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaSync, FaQrcode, FaDownload } from 'react-icons/fa';
import "../../styles/Mpino.css";
import useModal from "../../hooks/useModal";
import ConfirmDeleteModal from "../../utils/ConfirmDeleteModal";

const Mpino = () => {
    const [mpinoList, setMpinoList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({});
    const { modal, openModal, closeModal, isOpen } = useModal();

    useEffect(() => {
        const mockData = [
            {
                id: 1, nom: 'Rakoto', prenom: 'Jean', numero: '+261 34 12 345 67', photo: 'src/assets/flmlogo.png',
                sexe: 'Homme', talenta: 'Chant', qrcode: 'QR12345', kartie: 'Karite A', finagonana: 'FJKM Antanimena',
                unique_id: 'MP001', naiss_mpin: '1990-05-15', is_vitaBatisa: true, date_batisa: '2005-06-20',
                is_mpandray: true, is_mpiandry: false, is_manambady: true, is_vitaSoratra: true, is_vitaMariazy: true,
                is_sync: true, adress_mpin: 'Lot 123 Antanimena', pdf_fiche: '/fiches/mp001.pdf'
            },
            {
                id: 2, nom: 'Rasoa', prenom: 'Marie', numero: '+261 33 12 345 67', photo: 'src/assets/flmlogo.png',
                sexe: 'Femme', talenta: 'Accueil', qrcode: 'QR12346', kartie: 'Karite B', finagonana: 'FJKM Analakely',
                unique_id: 'MP002', naiss_mpin: '1985-08-22', is_vitaBatisa: true, date_batisa: '2000-03-10',
                is_mpandray: false, is_mpiandry: true, is_manambady: true, is_vitaSoratra: true, is_vitaMariazy: true,
                is_sync: true, adress_mpin: 'Lot 456 Analakely', pdf_fiche: '/fiches/mp002.pdf'
            }
            ,
            {
                id: 3, nom: 'Razafindraibe', prenom: 'Safidiniaina Judicael', numero: '+261 34 12 345 67', photo: 'src/assets/judicael.JPG',
                sexe: 'Homme', talenta: 'Mihira', qrcode: 'QR12347', kartie: 'Karite C', finagonana: 'FJKM Ivory',
                unique_id: 'MP002', naiss_mpin: '2000-08-22', is_vitaBatisa: true, date_batisa: '2000-03-10',
                is_mpandray: false, is_mpiandry: true, is_manambady: false, is_vitaSoratra: true, is_vitaMariazy: true,
                is_sync: true, adress_mpin: 'Lot 456 Analakely', pdf_fiche: '/fiches/mp002.pdf'
            }
        ];
        setMpinoList(mockData);
    }, []);

    const filteredMpino = mpinoList.filter(mpino =>
        mpino.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mpino.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mpino.numero.includes(searchTerm) ||
        mpino.kartie.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Gestion form
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const openAdd = () => {
        setFormData({});
        openModal("add");
    };

    const openEdit = (mpino) => {
        setFormData({
            unique_id: mpino.unique_id,
            nom_mpin: mpino.nom,
            prenom_mpin: mpino.prenom,
            naiss_mpin: mpino.naiss_mpin,
            is_vitaBatisa: mpino.is_vitaBatisa,
            date_batisa: mpino.date_batisa,
            num_mpin: mpino.numero,
            photo_mpin: mpino.photo,
            sexe_mpin: mpino.sexe,
            talenta_mpin: mpino.talenta,
            is_mpandray: mpino.is_mpandray,
            is_mpiandry: mpino.is_mpiandry,
            is_manambady: mpino.is_manambady,
            is_vitaSoratra: mpino.is_vitaSoratra,
            is_vitaMariazy: mpino.is_vitaMariazy,
            adress_mpin: mpino.adress_mpin,
            id_kartie: mpino.kartie,
            qr_code: mpino.qrcode,
            pdf_fiche: mpino.pdf_fiche
        });
        openModal("edit", mpino);
    };

    const openDelete = (mpino) => openModal("delete", mpino);

    const handleAddMpino = () => {
        const newMpino = {
            id: mpinoList.length + 1,
            nom: formData.nom_mpin,
            prenom: formData.prenom_mpin,
            numero: formData.num_mpin,
            photo: formData.photo_mpin || flmlogo,
            sexe: formData.sexe_mpin,
            talenta: formData.talenta_mpin,
            qrcode: `QR${Math.floor(10000 + Math.random() * 90000)}`,
            kartie: formData.id_kartie,
            finagonana: 'FJKM Antanimena',
            unique_id: `MP${Math.floor(100 + Math.random() * 900)}`,
            naiss_mpin: formData.naiss_mpin,
            is_vitaBatisa: formData.is_vitaBatisa || false,
            date_batisa: formData.date_batisa || '',
            is_mpandray: formData.is_mpandray || false,
            is_mpiandry: formData.is_mpiandry || false,
            is_manambady: formData.is_manambady || false,
            is_vitaSoratra: formData.is_vitaSoratra || false,
            is_vitaMariazy: formData.is_vitaMariazy || false,
            is_sync: false,
            adress_mpin: formData.adress_mpin || '',
            pdf_fiche: ''
        };
        setMpinoList(prev => [...prev, newMpino]);
        closeModal();
    };

    const handleEditMpino = () => {
        setMpinoList(prev =>
            prev.map(mpino =>
                mpino.id === modal.data.id
                    ? {
                        ...mpino,
                        photo: formData.photo_mpin || flmlogo,
                        nom: formData.nom_mpin,
                        prenom: formData.prenom_mpin,
                        numero: formData.num_mpin,
                        sexe: formData.sexe_mpin,
                        talenta: formData.talenta_mpin,
                        kartie: formData.id_kartie,
                        naiss_mpin: formData.naiss_mpin,
                        is_vitaBatisa: formData.is_vitaBatisa,
                        date_batisa: formData.date_batisa,
                        is_mpandray: formData.is_mpandray,
                        is_mpiandry: formData.is_mpiandry,
                        is_manambady: formData.is_manambady,
                        is_vitaSoratra: formData.is_vitaSoratra,
                        is_vitaMariazy: formData.is_vitaMariazy,
                        adress_mpin: formData.adress_mpin
                    }
                    : mpino
            )
        );
        closeModal();
    };

    const handleDeleteMpino = () => {
        setMpinoList(prev => prev.filter(mpino => mpino.id !== modal.data.id));
        closeModal();
    };

    const showQrCode = (mpino) => alert(`QR Code de ${mpino.nom} ${mpino.prenom}: ${mpino.qrcode}`);
    const downloadFiche = (mpino) => alert(`Téléchargement de la fiche de ${mpino.nom} ${mpino.prenom}`);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, photo_mpin: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };
    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, photo_mpin: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };


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
                {filteredMpino.map(mpino => (
                    <div key={mpino.id} className="mpino-card">
                        <div className="cardMpino-header">
                            <img src={mpino.photo} alt={`${mpino.prenom} ${mpino.nom}`} />
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
                            <div className="detailMpino-item"><strong>Fiangonana:</strong> {mpino.finagonana}</div>
                        </div>

                        <div className="cardMpino-actions">
                            <button className="btnMpino-icon" onClick={() => showQrCode(mpino)}><FaQrcode /></button>
                            <button className="btnMpino-icon" onClick={() => downloadFiche(mpino)}><FaDownload /></button>
                            <button className="btnMpino-icon" onClick={() => openEdit(mpino)}><FaEdit /></button>
                            <button className="btnMpino-icon btn-danger" onClick={() => openDelete(mpino)}><FaTrash /></button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal add/edit */}
            {(isOpen("add") || isOpen("edit")) && (
                <div className="modalMpino-overlay">
                    <div className="modalMpino">
                        <div className="modalMpino-header">
                            <h2>{isOpen("add") ? 'Ajouter un Nouveau Mpino' : 'Modifier le Mpino'}</h2>
                            <button className="modalMpino-close" onClick={closeModal}>×</button>
                        </div>

                        <form className="modalMpino-form" onSubmit={(e) => { e.preventDefault(); isOpen("add") ? handleAddMpino() : handleEditMpino(); }}>
                            <div className="formMpino-grid">
                                <div
                                    className="formMpino-group photo-dropzone"
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                >
                                    <label>Photo</label>
                                    <input
                                        type="file"
                                        name="photo_mpin"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                    {formData.photo_mpin && (
                                        <div className="photo-preview">
                                            <img src={formData.photo_mpin} alt="Preview" />
                                        </div>
                                    )}
                                    <p>Ou glissez votre image ici</p>
                                </div>


                                <div className="formMpino-group">
                                    <label>Nom *</label>
                                    <input
                                        type="text"
                                        name="nom_mpin"
                                        value={formData.nom_mpin}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="formMpino-group">
                                    <label>Prénom *</label>
                                    <input
                                        type="text"
                                        name="prenom_mpin"
                                        value={formData.prenom_mpin}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="formMpino-group">
                                    <label>Date de naissance</label>
                                    <input
                                        type="date"
                                        name="naiss_mpin"
                                        value={formData.naiss_mpin}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="formMpino-group">
                                    <label>Numéro de téléphone *</label>
                                    <input
                                        type="tel"
                                        name="num_mpin"
                                        value={formData.num_mpin}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="formMpino-group">
                                    <label>Sexe *</label>
                                    <select
                                        name="sexe_mpin"
                                        value={formData.sexe_mpin}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Sélectionner</option>
                                        <option value="Homme">Homme</option>
                                        <option value="Femme">Femme</option>
                                    </select>
                                </div>

                                <div className="formMpino-group">
                                    <label>Talenta</label>
                                    <input
                                        type="text"
                                        name="talenta_mpin"
                                        value={formData.talenta_mpin}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="formMpino-group">
                                    <label>Adresse</label>
                                    <input
                                        type="text"
                                        name="adress_mpin"
                                        value={formData.adress_mpin}
                                        onChange={handleInputChange}

                                    />
                                </div>

                                <div className="formMpino-group">
                                    <label>Kartie</label>
                                    <input
                                        type="text"
                                        name="id_kartie"
                                        value={formData.id_kartie}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="formMpino-group full-width">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="is_vitaBatisa"
                                            checked={formData.is_vitaBatisa}
                                            onChange={handleInputChange}
                                        />
                                        Vita Batisa
                                    </label>
                                </div>

                                {formData.is_vitaBatisa && (
                                    <div className="formMpino-group">
                                        <label>Date de batisa</label>
                                        <input
                                            type="date"
                                            name="date_batisa"
                                            value={formData.date_batisa}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                )}

                                <div className="formMpino-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="is_mpandray"
                                            checked={formData.is_mpandray}
                                            onChange={handleInputChange}
                                        />
                                        Mpandray
                                    </label>
                                </div>

                                <div className="formMpino-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="is_mpiandry"
                                            checked={formData.is_mpiandry}
                                            onChange={handleInputChange}
                                        />
                                        Mpiandry
                                    </label>
                                </div>

                                <div className="formMpino-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="is_manambady"
                                            checked={formData.is_manambady}
                                            onChange={handleInputChange}
                                        />
                                        Manambady
                                    </label>
                                </div>

                                <div className="formMpino-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="is_vitaSoratra"
                                            checked={formData.is_vitaSoratra}
                                            onChange={handleInputChange}
                                        />
                                        Vita Soratra
                                    </label>
                                </div>

                                <div className="formMpino-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="is_vitaMariazy"
                                            checked={formData.is_vitaMariazy}
                                            onChange={handleInputChange}
                                        />
                                        Vita Mariazy
                                    </label>
                                </div>
                                <div className="formMpino-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="is_vitaMariazy"
                                            checked={formData.is_vitaMariazy}
                                            onChange={handleInputChange}
                                        />
                                        Vita Mariazy
                                    </label>
                                </div>
                            </div>

                            <div className="modalMpino-actions">
                                <button type="button" onClick={closeModal}>Annuler</button>
                                <button className="save-komitie-btn" onClick={isOpen("add") ? handleAddMpino : handleEditMpino}>
                                    {isOpen("add") ? "Ajouter" : "Modifier"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal delete */}
            {isOpen("delete") && modal.data && (
                <ConfirmDeleteModal
                    isOpen={true}
                    onClose={closeModal}
                    onConfirm={handleDeleteMpino}
                    message={`Êtes-vous sûr de vouloir supprimer le mpino "${modal.data.prenom} ${modal.data.nom}" ?`}
                />
            )}
        </div>
    );
};

export default Mpino;
