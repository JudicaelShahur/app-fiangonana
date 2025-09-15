import React from 'react';
import "../../styles/Fiangonana.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FaSearch } from 'react-icons/fa';
import ConfirmDeleteModal from "../../utils/ConfirmDeleteModal";
import useFiangonana from "../../hooks/useFiangonana";

const Fiangonana = () => {
    const {
        fiangonanas,
        fiangonanaTerm,
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
        closeModal
    } = useFiangonana();

    return (
        <div className="fiangonana-management">
            <div className="headerFiangonana-content">
                <h1>Liste complète des églises enregistrées</h1>
                <button className="addFiangonana-btn" onClick={() => openModal("add")}>
                    <i className="fas fa-plus"></i> Ajouter une église
                </button>
            </div>

            <div className="searchFiangonana-bar">
                <div className="searchFiangonana-input">
                    <FaSearch className="searchFiangonana-icon" />
                    <input
                        type="text"
                        placeholder="Rechercher une église, une adresse ou un administrateur..."
                        value={fiangonanaTerm}
                        onChange={handleSearch}
                    />
                </div>
            </div>

            <div className="fiangonana-list">
                {fiangonanas.length > 0 ? (
                    fiangonanas.map(fiangonana => (
                        <FiangonanaItem
                            key={fiangonana.id}
                            fiangonana={fiangonana}
                            handleEdit={handleEdit}
                            openDelete={openDelete}
                        />
                    ))
                ) : (
                    <div className="no-result-card">
                        <p>Aucune église trouvée</p>
                    </div>
                )}
            </div>

            {(isOpen("add") || isOpen("edit")) && (
                <FiangonanaModal
                    currentFiangonana={currentFiangonana}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleSubmit}
                    handleCloseModal={closeModal}
                    handleDrop={handleDrop}
                    handleDragOver={handleDragOver}
                    handleFileChange={handleFileChange}
                    mode={modal.type}
                />
            )}

            {isOpen("delete") && modal.data && (
                <ConfirmDeleteModal
                    isOpen={true}
                    onClose={closeModal}
                    onConfirm={() => handleDelete(modal.data)}
                    message={`Êtes-vous sûr de vouloir supprimer le fiangonana "${modal.data.name}" ?`}
                />
            )}
        </div>
    );
};

const FiangonanaItem = ({ fiangonana, handleEdit, openDelete }) => {
    console.log("Image src:", fiangonana.photo);
    return (
        <div className="fiangonana-item">
            <div className="fiangonana-image">
                <img
                    src={fiangonana.photo}
                    alt={fiangonana.name}
                />
            </div>
            <div className="fiangonana-info">
                <h3>{fiangonana.name}</h3>
                <p><i className="fas fa-map-marker-alt"></i> {fiangonana.address || "—"}</p>
                <p><i className="fas fa-phone"></i> {fiangonana.phone}</p>
                <p><i className="fas fa-envelope"></i> {fiangonana.email}</p>
                <p><i className="fas fa-user"></i> Admin: {fiangonana.admin}</p>
            </div>
            <div className="fiangonana-actions">
                <button className="actionFiangonana-btn editFiangonana-btn" onClick={() => handleEdit(fiangonana)}>
                    <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="actionFiangonana-btn deleteFiangonana-btn" onClick={() => openDelete(fiangonana)}>
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </div>
        </div>
    );
};
const FiangonanaModal = ({ currentFiangonana, handleInputChange, handleSubmit, handleCloseModal, mode, handleDragOver, handleFileChange, handleDrop }) => (
    <div className="modalFiangonana">
        <div className="modalFiangonana-content">
            <div className="modalFiangonana-header">
                <h2>{mode === "add" ? "Ajouter une église" : "Modifier l'église"}</h2>
                <button className="close-btn" onClick={handleCloseModal}>&times;</button>
            </div>
            <form id="fiangonanaForm" onSubmit={handleSubmit}>
                <div className="modalFiangonana-body">
                    <div className="formFiangonana-group">
                        <label htmlFor="fiang_nom">Nom de l'église *</label>
                        <input type="text" id="fiang_nom" value={currentFiangonana.name} onChange={handleInputChange} required />
                    </div>
                    <div
                        className="formFiangonana-group photo-dropzonefiangonana"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                    >
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                        {currentFiangonana.photo && <img src={currentFiangonana.photo} alt="Preview" />}
                        <p>Glissez et déposez l'image ici ou cliquez pour choisir</p>
                    </div>
                    <div className="formFiangonana-group">
                        <label htmlFor="fiang_mail">Email *</label>
                        <input type="email" id="fiang_mail" value={currentFiangonana.email} onChange={handleInputChange} required />
                    </div>
                    <div className="formFiangonana-group">
                        <label htmlFor="fiang_num">Téléphone *</label>
                        <input type="tel" id="fiang_num" value={currentFiangonana.phone} onChange={handleInputChange} required />
                    </div>
                </div>
                <div className="modalFiangonana-footer">
                    <button className="cancel-btn" type="button" onClick={handleCloseModal}>Annuler</button>
                    <button className="submit-btnFiangonana" type="submit">{mode === "add" ? "Enregistrer" : "Modifier"}</button>
                </div>
            </form>
        </div>
    </div>
);

export default Fiangonana;
