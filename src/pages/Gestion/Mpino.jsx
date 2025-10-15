import React, { useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaSync, FaQrcode, FaDownload } from 'react-icons/fa';
import "../../styles/Mpino.css";
import ConfirmDeleteModal from "../../utils/ConfirmDeleteModal";
import { useMpino } from "../../hooks/useMpino.js";
import AsyncSelect from "react-select/async";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Mpino = () => {

    const {
        currentPage, setCurrentPage, totalPages, loading, mpinoList, kartieList,
        searchTerm, setSearchTerm, isDebouncing, formData, formErrors, isSubmitting, photoPreview,
        modal, isOpen, handleInputChange, handleFileChange, handleDrop, handleDragOver,
        handleAddMpino, handleEditMpino, handleDeleteMpino, openAdd, openEdit, openDelete,
        showQrCode, downloadFiche, filteredMpino, closeModal, karties, loadKarties, setFormData, handleImportMpinos, isImporting, fileInputRef,
        selectedFiangonana, setSelectedFiangonana,
        selectedSexe, setSelectedSexe,
        selectedAdresse, setSelectedAdresse,
        selectedMpandray, setSelectedMpandray,
        selectedManambady, setSelectedManambady, fiangonanaList
    } = useMpino();
    const [file, setFile] = useState(null);

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
                    {isDebouncing && <div className="smallMpino-loader"></div>}
                </div>
                <div className="searchMpino-stats">{filteredMpino.length} mpino(s) trouvé(s)</div>
                <div className="import-section">
                    <h3>Importer des Mpinos (CSV / Excel)</h3>
                    <input
                        type="file"
                        accept=".csv, .xlsx"
                        ref={fileInputRef}
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                    <button
                        onClick={() => handleImportMpinos(file)}
                        disabled={!file }
                    >
                        {isImporting ? " en cours..." : "Importer"}
                    </button>
                </div>
            </div>
            <div className="filters">
                <select
                    value={selectedFiangonana || ""}
                    onChange={e => setSelectedFiangonana(e.target.value || null)}
                >
                    <option value="">-- Toutes les Fiangonana --</option>
                    {fiangonanaList.map(f => (
                        <option key={f.id} value={f.id}>{f.fiang_nom}</option>
                    ))}
                </select>
                <select value={selectedSexe} onChange={e => setSelectedSexe(e.target.value)}>
                    <option value="">-- Sexe --</option>
                    <option value="M">Homme</option>
                    <option value="F">Femme</option>
                </select>
                <select value={selectedMpandray ?? ""} onChange={e => setSelectedMpandray(e.target.value || null)}>
                    <option value="">-- Mpandray ? --</option>
                    <option value="1">Oui</option>
                    <option value="0">Non</option>
                </select>

                <select value={selectedManambady ?? ""} onChange={e => setSelectedManambady(e.target.value || null)}>
                    <option value="">-- Manambady ? --</option>
                    <option value="1">Oui</option>
                    <option value="0">Non</option>
                </select>
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
                                <div className="btnMpino-icon-wrapper">
                                    <button className="btnMpino-icon" onClick={() => showQrCode(mpino)}>
                                        <FaQrcode />
                                    </button>
                                    <span className="tooltip">QR Code</span>
                                </div>

                                <div className="btnMpino-icon-wrapper">
                                    <button className="btnMpino-icon" onClick={() => downloadFiche(mpino)}>
                                        <FaDownload />
                                    </button>
                                    <span className="tooltip">Télécharger</span>
                                </div>

                                <div className="btnMpino-icon-wrapper">
                                    <button className="btnMpino-icon" onClick={() => openEdit(mpino)}>
                                        <FaEdit />
                                    </button>
                                    <span className="tooltip">Modifier</span>
                                </div>

                                <div className="btnMpino-icon-wrapper">
                                    <button className="btnMpino-icon btn-danger" onClick={() => openDelete(mpino)}>
                                        <FaTrash />
                                    </button>
                                    <span className="tooltip">Supprimer</span>
                                </div>
                            </div>

                        </div>
                    ))
                ) : (
                    <p className="no-resultat" > Aucun mpino trouvé "{searchTerm}"</p>
                )}
            </div>

            {/* Pagination */}
            <div className="pagination">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Précédent
                </button>

                {/* Bouton 1 */}
                {currentPage > 3 && (
                    <>
                        <button onClick={() => setCurrentPage(1)}>1</button>
                        <span className="dots">...</span>
                    </>
                )}

                {/* Fenêtre autour de la page actuelle */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => page >= currentPage - 2 && page <= currentPage + 2)
                    .map(page => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={currentPage === page ? 'active' : ''}
                        >
                            {page}
                        </button>
                    ))}

                {/* Dernière page */}
                {currentPage < totalPages - 2 && (
                    <>
                        <span className="dots">...</span>
                        <button onClick={() => setCurrentPage(totalPages)}>
                            {totalPages}
                        </button>
                    </>
                )}

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

                        <form className="modalMpino-form" onSubmit={(e) => {
                            e.preventDefault();
                            isOpen("add") ? handleAddMpino() : handleEditMpino();
                        }}>
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
                                    <label>Kartie*</label>
                                    <AsyncSelect
                                        cacheOptions
                                        loadOptions={loadKarties}
                                        defaultOptions
                                        placeholder="Rechercher un Kartie..."
                                        value={formData.id_kartie ? (() => {
                                            const k = karties.find(k => k.id === Number(formData.id_kartie));
                                            return k ? { value: k.id, label: `${k.nom_kar}-${k.fiang_nom}` } : { value: Number(formData.id_kartie), label: "Chargement..." };
                                        })() : null}
                                        onChange={selected =>
                                            setFormData(prev => ({ ...prev, id_kartie: selected ? selected.value.toString() : "" }))
                                        }
                                    />
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

            {/* Modal Delete */}
            {isOpen("delete") && modal.data && (
                <ConfirmDeleteModal
                    isOpen={true}
                    onClose={closeModal}
                    onConfirm={handleDeleteMpino}
                    message={`Êtes-vous sûr de vouloir supprimer le mpino"${modal.data?.nom} ${modal.data?.prenom}"?`}

                />
            )}
        </div>
    );
};

export default Mpino;
