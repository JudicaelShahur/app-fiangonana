import React from "react";
import AsyncSelect from "react-select/async";
import "../../styles/Mpitondra.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faTimes, faPlus } from "@fortawesome/free-solid-svg-icons";

import ConfirmDeleteModal from "../../utils/ConfirmDeleteModal.jsx";
import { useMpitondra } from "../../hooks/useMpitondra.js";

const Mpitondra = () => {
    const {
        filteredMpitondras,
        searchTerm,
        setSearchTerm,
        openAdd,
        openEdit,
        openDelete,
        formData,
        handleInputChange,
        addMpitondraHandler,
        editMpitondraHandler,
        deleteMpitondraHandler,
        modal,
        isOpen,
        closeModal,
        currentPage,
        setCurrentPage,
        totalPages,
        getPagesArray,
        loading,
        fiangonanas,
        mpinos,
        loadMpinos,
        loadFiangonanas,
        setFormData,
        isDebouncing
    } = useMpitondra();

    return (
        <div className="mpitondra-container">
            <div className="mpitondra-content">
                {/* Header */}
                <header className="mpitondra-header">         
                        <h1>Liste complète des Mpitondra</h1>
                        <button className="add-btn-mpitondra" onClick={openAdd}>
                            <FontAwesomeIcon icon={faPlus} /> Ajouter un Mpitondra
                        </button>
                </header>

                {/* Search bar */}
                <div className="search-mpitondra-bar">
                    <div className="search-mpitondra-input">
                        <span className="search-mpitondra-icon"><i className="fas fa-search"></i></span>
                        <input
                            type="text"
                            placeholder="Rechercher par titre ou ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {isDebouncing && <div className="small-mpitondra-loader"></div>}
                    </div>
                    <button className="filter-mpitondra-btn">
                        <i className="fas fa-filter"></i> Filtrer
                    </button>
                </div>

                {/* Tableau */}
                <div className="table-mpitondra-container">
                    <table className="mpitondra-table">
                        <thead>
                            <tr>
                                <th>ID MPIN</th>
                                <th>Année</th>
                                <th>Titre</th>
                                <th>Description</th>
                                <th>ID Fiang</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                                        <div className="loader"></div>
                                    </td>
                                </tr>
                            ) : filteredMpitondras.length > 0 ? (
                                filteredMpitondras.map((m) => (
                                    <tr key={m.id}>
                                        <td data-label="ID MPIN">{m.mpino_nom} {m.mpino_prenom}</td>
                                        <td data-label="Année">{m.annee_mpitondra}</td>
                                        <td data-label="Titre">{m.titre_mpitondra}</td>
                                        <td data-label="Description">{m.desc_mpitondra}</td>
                                        <td data-label="ID Fiang">{m.fiang_nom}</td>
                                        <td data-label="Actions" className="action-btn-mpitondra">
                                            <button className="btn-mpitondra" onClick={() => openEdit(m)}>
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                            <button
                                                className="btn-mpitondra btn-danger"
                                                onClick={() => openDelete(m)}
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="6"
                                        style={{
                                            textAlign: "center",
                                            padding: "20px",
                                            color: "var(--secondary-color)",
                                            fontSize: "1.1rem",
                                        }}
                                        className="no-resultsMpitondra"
                                    >
                                        Aucun résultat trouvé pour "{searchTerm}"
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="pagination">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage <= 1}
                        >
                            Précédent
                        </button>

                        {getPagesArray().map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                style={{
                                    backgroundColor: currentPage === page ? "#3498db" : "",
                                    color: currentPage === page ? "#fff" : "",
                                    borderRadius: "4px",
                                    padding: "5px 10px",
                                    margin: "0 2px",
                                    border: "1px solid #ccc",
                                    cursor: "pointer",
                                }}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage >= totalPages}
                        >
                            Suivant
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal ajout / édition */}
            {(isOpen("add") || isOpen("edit")) && (
                <div className="modal-mpitondra-overlay">
                    <div className="modal-mpitondra-content">
                        <div className="modal-mpitondra-header">
                            <h2>{isOpen("add") ? "Ajouter un Mpitondra" : "Modifier le Mpitondra"}</h2>
                            <button className="close-btn-mpitondra" onClick={closeModal}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                        <div className="modal-mpitondra-body">
                           <div className="form-mpitondra-group">
                                <label>Mpino</label>
                                <AsyncSelect
                                    cacheOptions
                                    loadOptions={loadMpinos}
                                    defaultOptions
                                    placeholder="Rechercher un Mpino..."
                                    value={
                                        formData.id_mpin
                                            ? (() => {
                                                const m = mpinos.find((m) => m.id === Number(formData.id_mpin));
                                                return m ? { value: m.id, label: `${m.nom} ${m.prenom}` } : { value: Number(formData.id_mpin), label: "Chargement..." };
                                            })()
                                            : null
                                    }
                                    onChange={(selected) =>
                                        setFormData((prev) => ({ ...prev, id_mpin: selected ? selected.value.toString() : "" }))
                                    }
                                />
                            
                            </div>

                            <div className="form-mpitondra-group">
                                <label>Année</label>
                                <input
                                    type="number"
                                    name="annee_mpitondra"
                                    value={formData.annee_mpitondra}
                                    onChange={handleInputChange}
                                    placeholder="Ex: 2025"
                                />
                            </div>
                            <div className="form-mpitondra-group">
                                <label>Titre</label>
                                <input
                                    type="text"
                                    name="titre_mpitondra"
                                    value={formData.titre_mpitondra}
                                    onChange={handleInputChange}
                                    placeholder="Entrez le titre"
                                />
                            </div>
                            <div className="form-mpitondra-group">
                                <label>Description</label>
                                <input
                                    type="text"
                                    name="desc_mpitondra"
                                    value={formData.desc_mpitondra}
                                    onChange={handleInputChange}
                                    placeholder="Entrez la description"
                                />
                            </div>
                            <div className="form-mpitondra-group">
                                <label>Fiangonana</label>
                                <AsyncSelect
                                    cacheOptions
                                    loadOptions={loadFiangonanas}
                                    defaultOptions
                                    placeholder="Rechercher une Fiangonana..."
                                    value={formData.id_fiang ? (() => {
                                        const f = fiangonanas.find(f => f.id === Number(formData.id_fiang));
                                        return f ? { value: f.id, label: f.fiang_nom } : { value: Number(formData.id_fiang), label: "Chargement..." };
                                    })() : null}
                                    onChange={(selected) =>
                                        setFormData(prev => ({ ...prev, id_fiang: selected ? selected.value.toString() : "" }))
                                    }
                                />
                            </div>

                        </div>
                        <div className="modal-mpitondra-footer">
                            <button className="cancel-mpitondra-btn" onClick={closeModal}>
                                Annuler
                            </button>
                            <button
                                className="save-mpitondra-btn"
                                onClick={isOpen("add") ? addMpitondraHandler : editMpitondraHandler}
                            >
                                {isOpen("add") ? "Ajouter" : "Enregistrer"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal suppression */}
            {isOpen("delete") && modal.data && (
                <ConfirmDeleteModal
                    isOpen={true}
                    onClose={closeModal}
                    onConfirm={deleteMpitondraHandler}
                    message={`Êtes-vous sûr de vouloir supprimer le Mpitondra "${modal.data.titre_mpitondra}" ?`}
                />
            )}
        </div>
    );
};

export default Mpitondra;
