import React from 'react';
import "../../styles/Vola.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useVola } from "../../hooks/useVola.js";

const Vola = () => {
    const {
        searchTerm,
        setSearchTerm,
        isModalOpen,
        editingId,
        newVola,
        openModal,
        closeModal,
        handleInputChange,
        handleSubmit,
        handleDelete,
        filteredVolas,
        currentPage,
        lastPage,
        nextPage,
        prevPage,
        goToPage,
        getPagesArray,
        loading
    } = useVola();

    return (
        <div className="vola-container">
            <div className="vola-content">
                <header className="vola-header">
                    <h1>Liste des vola</h1>
                    <button className="add-btn-vola" onClick={() => openModal()}>
                        <i className="fas fa-plus"></i> Ajouter un vola
                    </button>
                </header>

                <div className="search-vola-bar">
                    <div className="search-vola-input">
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className="search-vola-icon"><i className="fas fa-search"></i></span>
                    </div>
                </div>

                <div className="table-vola-container">
                    <table className="vola-table">
                        <thead>
                            <tr>
                                <th>Montant</th>
                                <th>Description</th>
                                <th>ID Fiangonana</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                                        <div className="loader"></div>
                                    </td>
                                </tr>
                            ) : filteredVolas.length > 0 ? (
                                filteredVolas.map((v) => (
                                    <tr key={v.id}>
                                        <td data-label="Montant">{v.montant}</td>
                                        <td data-label="Description">{v.desc_vola}</td>
                                        <td data-label="ID Fiangonana">{v.fiang_id}</td>
                                        <td data-label="Actions" className="action-btn-vola">
                                            <button className="btn-vola" onClick={() => openModal(v)}>
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                            <button className="btn-vola btn-danger" onClick={() => handleDelete(v.id)}>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" style={{
                                        textAlign: "center",
                                        padding: "20px",
                                        color: "var(--secondary-color)",
                                        fontSize: "1.1rem"
                                    }}>
                                        Aucun résultat trouvé pour "{searchTerm}"
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* --- Pagination --- */}
                    <div className="paginationVola">
                        <button onClick={prevPage} disabled={currentPage === 1}>
                            Précédent
                        </button>

                        {getPagesArray().map((page) => (
                            <button
                                key={page}
                                className={page === currentPage ? "active" : ""}
                                onClick={() => goToPage(page)}
                            >
                                {page}
                            </button>
                        ))}

                        <button onClick={nextPage} disabled={currentPage === lastPage}>
                            Suivant
                        </button>
                    </div>
                </div>
                {/* --- Modal --- */}
                {isModalOpen && (
                    <div className="modal-vola-overlay">
                        <div className="modal-vola-content">
                            <div className="modal-vola-header">
                                <h2>{editingId ? "Modifier un vola" : "Ajouter un vola"}</h2>
                                <button className="close-btn-vola" onClick={closeModal}>&times;</button>
                            </div>
                            <div className="modal-vola-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="form-vola-group">
                                        <label>Montant *</label>
                                        <input
                                            type="number"
                                            name="montant"
                                            value={newVola.montant}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-vola-group">
                                        <label>Description *</label>
                                        <input
                                            type="text"
                                            name="desc_vola"
                                            value={newVola.desc_vola}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="modal-vola-footer">
                                        <button type="button" className="cancel-vola-btn" onClick={closeModal}>Annuler</button>
                                        <button type="submit" className="save-vola-btn">
                                            {editingId ? "Modifier" : "Enregistrer"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Vola;
