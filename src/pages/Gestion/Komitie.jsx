import React from "react";
import Select from "react-select";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../styles/Komitie.css";
import ConfirmDeleteModal from "../../utils/ConfirmDeleteModal.jsx";
import { useKomity } from "../../hooks/useKomity.js";

const Komitie = () => {
  const {
    komities,
    filteredKomities,
    formData,
    handleInputChange,
    searchTerm,
    setSearchTerm,
    modal,
    isOpen,
    openAdd,
    openEdit,
    openDelete,
    closeModal,
    addKomityHandler,
    editKomityHandler,
    deleteKomityHandler,
    loading,
    mpinos,
    setFormData,
    currentPage,
    setCurrentPage,
    totalPages,
    nextPage,
    prevPage,
    getPagesArray,
    isDebouncing,
  } = useKomity();

  return (
    <div className="komitie-container">
      {/* Header */}
      <div className="komitie-header">
        <h1>Gestion des Komitie</h1>
        <button className="add-btn-komitie" onClick={openAdd}>
          <i className="fas fa-plus"></i> Ajouter un komitie
        </button>
      </div>

      {/* Search */}
      <div className="search-mpitondra-bar">
        <div className="search-mpitondra-input">
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <span className="search-mpitondra-icon">
            <i className="fas fa-search"></i>
          </span>
          {isDebouncing && <div className="small-loader"></div>}
        </div>
      </div>

      {/* Table */}
      <div className="table-komitie-container">
        
          <table className="komitie-table">
            <thead>
              <tr>
                <th>Titre Komitie</th>
                <th>Nom et Prénom</th>
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
            ) : filteredKomities.length > 0 ? (
              filteredKomities.map((kom) => (
                <tr key={kom.id}>
                  <td data-label="Titre">{kom.titre_kom}</td>
                  <td data-label="ID Mpitondra">{kom.nom} {kom.prenom}</td>
                  <td data-label="Actions" className="action-btn-komitie">
                    <button className="btn-komitie" onClick={() => openEdit(kom)}>
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="btn-komitie btn-danger" onClick={() => openDelete(kom)}>
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{
                  textAlign: "center", padding: "20px",
                  color: "var(--secondary-color)",
                  fontSize: "1.1rem"
                }} className="no-resultsKartie">
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

      {/* Modal add/edit */}
      {(isOpen("add") || isOpen("edit")) && (
        <div className="modal-komitie-overlay">
          <div className="modal-komitie-content">
            <div className="modal-komitie-header">
              <h2>{isOpen("add") ? "Ajouter un Komitie" : "Modifier un Komitie"}</h2>
              <button className="close-btn-komitie" onClick={closeModal}>&times;</button>
            </div>
            <div className="modal-komitie-body">
              <div className="form-komitie-group">
                <label>Titre Komitie</label>
                <input
                  type="text"
                  name="titre_kom"
                  value={formData.titre_kom}
                  onChange={handleInputChange}
                  placeholder="Titre du komitie"
                />
              </div>
              <div className="form-komitie-group">
                <label>Mpino</label>
                <Select
                  placeholder="Rechercher un Mpino..."
                  options={mpinos.map((mp) => ({
                    value: mp.id,
                    label: `${mp.nom} ${mp.prenom}`,
                  }))}
                  value={
                    mpinos
                      .map((mp) => ({ value: mp.id, label: `${mp.nom} ${mp.prenom}` }))
                      .find((opt) => opt.value === Number(formData.id_mpin)) || null
                  }
                  onChange={(selected) =>
                    setFormData((prev) => ({
                      ...prev,
                      id_mpin: selected ? selected.value.toString() : "",
                    }))
                  }
                  isSearchable
                />
              </div>
            </div>
            <div className="modal-komitie-footer">
              <button className="cancel-komitie-btn" onClick={closeModal}>Annuler</button>
              <button
                className="save-komitie-btn"
                onClick={isOpen("add") ? addKomityHandler : editKomityHandler}
              >
                {isOpen("add") ? "Ajouter" : "Modifier"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal delete */}
      {isOpen("delete") && (
        <ConfirmDeleteModal
          isOpen={true}
          onClose={closeModal}
          onConfirm={deleteKomityHandler}
          message={`Êtes-vous sûr de vouloir supprimer le komitie "${modal.data.titre_kom}" ?`}
        />
      )}
    </div>
  );
};

export default Komitie;
