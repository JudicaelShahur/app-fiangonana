import React from "react";
import AsyncSelect from "react-select/async";
import "../../styles/ChefKartie.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faTimes, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FaSearch } from "react-icons/fa";
import ConfirmDeleteModal from "../../utils/ConfirmDeleteModal.jsx";
import { useChefKartie } from "../../hooks/useChefKartie.js";

const ChefKartie = () => {
    const {
        filteredChefs,
        searchTerm,
        setSearchTerm,
        formData,
        handleInputChange,
        openAdd,
        openEdit,
        openDelete,
        addChefHandler,
        editChefHandler,
        deleteChefHandler,
        modal,
        isOpen,
        closeModal,
        currentPage,
        setCurrentPage,
        totalPages,
        nextPage,
        prevPage,
        getPagesArray,
        loading,
        mpinos,
        loadMpinos,
        karties,
        loadKarties,
        setFormData,
        isDebouncing
    } = useChefKartie();

    return (
        <div className="chefkartie-container">
            <div className="chefcontainerKartie">
                <header>
                    <div className="chefheader-contentKartie">
                        <h1>Liste des ChefKarties</h1>
                        <button className="add-btnchefKartie" onClick={openAdd}>
                            <FontAwesomeIcon icon={faPlus} /> Ajouter un ChefKartie
                        </button>
                    </div>
                </header>

                <div className="searchChefKartie-bar">
                    <div className="searchChefKartie-input">
                        <FaSearch className="searchChefKartie-icon" />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {isDebouncing && <div className="smallKartie-loader"></div>}
                    </div>
                    <button className="filterChefKartie-btn">
                        <i className="fas fa-filter"></i> Filtrer
                    </button>
                </div>

                <div className="tableChefKartie-container">
                    <table className="chefkartie-table">
                        <thead>
                            <tr>
                                <th>Nom et Prénom</th>
                                <th> Kartie</th>
                                <th>Année Chef Kartie</th>
                                <th>Fiangonana</th>
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
                            ) : filteredChefs.length > 0 ? (
                                filteredChefs.map((c) => (
                                    <tr key={c.id}>
                                        <td data-label="Nom et Prénom">{c.mpino_nom} {c.mpino_prenom}</td>
                                        <td data-label=" Kartie">{c.kartie_nom}</td>
                                        <td data-label="Année chef Kartie">{c.annee_kar}</td>
                                        <td data-label="Fiangonana">{c.fiang_nom || "-"}</td>
                                        <td data-label="Actions" className="action-btnChefKartie">
                                            <button className="btnChefKartie" onClick={() => openEdit(c)}>
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                            <button className="btnChefKartie btn-danger" onClick={() => openDelete(c)}>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: "center", padding: "20px", color: "var(--secondary-color)", fontSize: "1.1rem" }}>
                                        Aucun résultat trouvé pour "{searchTerm}"
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="pagination">
                        <button onClick={prevPage} disabled={currentPage <= 1}>Précédent</button>
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
                                    cursor: "pointer"
                                }}
                            >
                                {page}
                            </button>
                        ))}
                        <button onClick={nextPage} disabled={currentPage >= totalPages}>Suivant</button>
                    </div>
                </div>

                {/* Modal ajout / édition */}
                {(isOpen("add") || isOpen("edit")) && (
                    <div className="modalChefKartie-overlay">
                        <div className="modalChefKartie-content">
                            <div className="modalChefKartie-header">
                                <h2>{isOpen("add") ? "Ajouter un ChefKartie" : "Modifier le ChefKartie"}</h2>
                                <button className="close-btnChefKartie" onClick={closeModal}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>
                            <div className="modalChefKartie-body">
                                <div className="formChefKartie-group">
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
                                </div>
                                <div className="formChefKartie-group">
                                    <label>Kartie *</label>
                                    <AsyncSelect
                                        cacheOptions
                                        loadOptions={loadKarties}
                                        defaultOptions
                                        placeholder="Rechercher un Kartie..."
                                        value={formData.id_kar ? (() => {
                                            const k = karties.find(k => k.id === Number(formData.id_kar));
                                            return k ? { value: k.id, label: `${k.nom_kar}-${k.fiang_nom}` } : { value: Number(formData.id_kar), label: "Chargement..." };
                                        })() : null}
                                        onChange={selected =>
                                            setFormData(prev => ({ ...prev, id_kar: selected ? selected.value.toString() : "" }))
                                        }
                                    />
                                </div>

                                <div className="formChefKartie-group">
                                    <label>Année Kar *</label>
                                    <input type="number" name="annee_kar" value={formData.annee_kar} onChange={handleInputChange} required />
                                </div>
                            </div>
                            <div className="modalChefKartie-footer">
                                <button className="cancelChefKartie-btn" onClick={closeModal}>Annuler</button>
                                <button className="saveChefKartie-btn" onClick={isOpen("add") ? addChefHandler : editChefHandler}>
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
                        onConfirm={deleteChefHandler}
                        message={`Êtes-vous sûr de vouloir supprimer le chef "${modal.data.id_mpin}" ?`}
                    />
                )}
            </div>
        </div>
    );
};

export default ChefKartie;
