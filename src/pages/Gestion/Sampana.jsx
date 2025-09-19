import React from "react";
import "../../styles/Sampana.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faTimes, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FaSearch } from "react-icons/fa";
import ConfirmDeleteModal from "../../utils/ConfirmDeleteModal.jsx";
import { useSampana } from "../../hooks/useSampana.js";

const Sampana = () => {
  const {
    filteredSampanas,
    searchTerm,
    setSearchTerm,
    openAdd,
    openEdit,
    openDelete,
    formData,
    handleInputChange,
    addSampanaHandler,
    editSampanaHandler,
    deleteSampanaHandler,
    modal,
    isOpen,
    closeModal,
    currentPage,
    setCurrentPage,
    totalPages,
    getPagesArray,
    loading
  } = useSampana();

  return (
    <div className="sampana-container">
        <header>
          <div className="sampana-header">
            <h1>Liste complète des Sampana</h1>
            <button className="add-btn-sampana" onClick={openAdd}>
              <FontAwesomeIcon icon={faPlus} /> Ajouter un Sampana
            </button>
          </div>
        </header>

          <div className="search-sampana-bar ">
          <div className="search-sampana-input">
            <FaSearch className="search-sampana-icon" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            </div>
            <button className="filter-sampana-btn">
            <i className="fas fa-filter"></i> Filtrer
            </button>
        </div>

        <div className="table-sampana-container">
          <table className="sampana-table">
            <thead>
              <tr>
                <th>Nom Sampana</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center", padding: "20px" }}>
                    <div className="loader"></div>
                  </td>
                </tr>
              ) : filteredSampanas.length > 0 ? (
                filteredSampanas.map(s => (
                  <tr key={s.id}>
                    <td data-label="Nom">{s.nom_samp}</td>
                    <td data-label="Description">{s.desc_samp}</td>
                    <td data-label="Actions" className="action-btn-sampana">
                      <button className="btn-sampana" onClick={() => openEdit(s)}>
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button className="btn-sampana btn-danger" onClick={() => openDelete(s)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{
                    textAlign: "center",
                    padding: "20px",
                    color: "var(--secondary-color)",
                    fontSize: "1.1rem"
                  }} className="no-resultsSampana">
                    Aucun résultat trouvé pour "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
           <div className="paginationKartie">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage <= 1}
            >
              Précédent
            </button>

            {/* Pages */}
            {getPagesArray().map(page => (
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


            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage >= totalPages}
            >
              Suivant
            </button>
          </div>
        </div>
      

      {/* Modal ajout / édition */}
      {(isOpen("add") || isOpen("edit")) && (
        <div className="modal-sampana-overlay">
          <div className="modal-sampana-content">
            <div className="modal-sampana-header">
              <h2>{isOpen("add") ? "Ajouter un Sampana" : "Modifier le Sampana"}</h2>
              <button className="close-btn-sampana" onClick={closeModal}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="modal-sampana-body">
              <div className="form-sampana-group">
                <label>Nom Sampana</label>
                <input type="text" name="nom_samp" value={formData.nom_samp} onChange={handleInputChange} placeholder="Nom du Sampana" />
              </div>
              <div className="form-sampana-group">
                <label>Description</label>
                <input type="text" name="desc_samp" value={formData.desc_samp} onChange={handleInputChange} placeholder="Description" />
              </div>
            </div>
            <div className="modal-sampana-footer">
              <button className="cancel-sampana-btn" onClick={closeModal}>Annuler</button>
              <button className="save-sampana-btn" onClick={isOpen("add") ? addSampanaHandler : editSampanaHandler}>
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
          onConfirm={deleteSampanaHandler}
          message={`Êtes-vous sûr de vouloir supprimer le Sampana "${modal.data.nom_samp}" ?`}
        />
      )}
    </div>
  );
};

export default Sampana;
