import React from "react";
import AsyncSelect from "react-select/async";
import "../../styles/SampanaManags.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faTimes, faPlus } from "@fortawesome/free-solid-svg-icons";
import ConfirmDeleteModal from "../../utils/ConfirmDeleteModal.jsx";
import { useSampanaManag } from "../../hooks/useSampanaManags.js";

const SampanaManag = () => {
  const {
    filtered,
    searchTerm,
    setSearchTerm,
    openAdd,
    openEdit,
    openDelete,
    formData,
    handleInputChange,
    addHandler,
    editHandler,
    deleteHandler,
    modal,
    isOpen,
    closeModal,
    currentPage,
    getPagesArray,
    nextPage,
    prevPage,
    totalPages,
    loading,
    stats,
    setFormData,
    loadMpinos,
    loadSampanas,
    isDebouncing,
    sampanas,
    mpinos,
    getMpinoLabel,
    getSampanaLabel,
  } = useSampanaManag();

  return (
    <div className="sampan-manags-container">
      <header>
        <div className="sampan-manags-header">
          <h1>Liste des Associations Mpino ↔ Sampana</h1>
          <button className="add-btn-sampan-manags" onClick={openAdd}>
            <FontAwesomeIcon icon={faPlus} /> Associer
          </button>
        </div>
      </header>

      {/* Search bar */}
      <div className="search-sampan-manags-bar">
        <div className="search-sampan-manags-input">
          <i className="fas fa-search search-sampan-manags-icon"></i>
          <input
            type="text"
            placeholder="Rechercher par sampana ou mpino..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {isDebouncing && <div className="small-loader"></div>}
        </div>
      </div>

      {/* Table */}
      <div className="table-sampan-manags-container">
        <table className="sampan-manags-table">
          <thead>
            <tr>
              <th>Nom Sampana</th>
              <th>Nom Mpino</th>
              <th>Date d’association</th>
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
            ) : filtered.length > 0 ? (
              filtered.map((item) => (
                <tr key={item.id}>
                  <td data-label="Nom Sampana">{item.sampana?.nom_samp}</td>
                  <td data-label="Nom Mpino">
                    {item.mpino ? `${item.mpino.nom} ${item.mpino.prenom}` : "-"}
                  </td>
                  <td data-label="Date d’association">
                    {item.created_at ? new Date(item.created_at).toLocaleDateString() : "-"}
                  </td>
                  <td data-label="Actions" className="action-btn-sampan-manags">
                    <button className="btn-sampan-manags" onClick={() => openEdit(item)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className="btn-sampan-manags btn-danger" onClick={() => openDelete(item)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                  Aucun résultat trouvé pour "{searchTerm}"
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="pagination">
          <button onClick={prevPage} disabled={currentPage <= 1}>
            Précédent
          </button>
          {getPagesArray().map((page) => (
            <button key={page} onClick={() => setFormData((p) => p + page)} className={currentPage === page ? "active" : ""}>
              {page}
            </button>
          ))}
          <button onClick={nextPage} disabled={currentPage >= totalPages}>
            Suivant
          </button>
        </div>
      </div>

      {/* Modal ajout / édition */}
      {(isOpen("add") || isOpen("edit")) && (
        <div className="modal-sampan-manags-overlay">
          <div className="modal-sampan-manags-content">
            <div className="modal-sampan-manags-header">
              <h2>{isOpen("add") ? "Associer un Mpino à un Sampana" : "Modifier l’association"}</h2>
              <button className="close-btn-sampan-manags" onClick={closeModal}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="modal-sampan-manags-body">
              {/* Sampana */}
              <div className="form-sampan-manags-group">
                <label>Nom Sampana</label>
                <AsyncSelect
                  cacheOptions
                  loadOptions={loadSampanas}
                  defaultOptions
                  placeholder="Rechercher un Sampana..."
                  value={
                    formData.sampana_id
                      ? (() => {
                        const s = sampanas.find((s) => s.id === Number(formData.sampana_id));
                        return s ? { value: s.id, label: s.nom_samp } : { value: Number(formData.sampana_id), label: "Chargement..." };
                      })()
                      : null
                  }
                  onChange={(selected) =>
                    setFormData((prev) => ({ ...prev, sampana_id: selected ? selected.value.toString() : "" }))
                  }
                />
              </div>

              {/* Mpino */}
              <div className="form-sampan-manags-group">
                <label>Nom Mpino</label>
                <AsyncSelect
                  cacheOptions
                  loadOptions={loadMpinos}
                  defaultOptions
                  placeholder="Rechercher un Mpino..."
                  value={
                    formData.mpino_id
                      ? (() => {
                        const m = mpinos.find((m) => m.id === Number(formData.mpino_id));
                        return m ? { value: m.id, label: `${m.nom} ${m.prenom}` } : { value: Number(formData.mpino_id), label: "Chargement..." };
                      })()
                      : null
                  }
                  onChange={(selected) =>
                    setFormData((prev) => ({ ...prev, mpino_id: selected ? selected.value.toString() : "" }))
                  }
                />
              </div>
            </div>
            <div className="modal-sampan-manags-footer">
              <button className="cancel-sampan-manags-btn" onClick={closeModal}>
                Annuler
              </button>
              <button
                className="save-sampan-manags-btn"
                onClick={isOpen("add") ? addHandler : editHandler}
              >
                {isOpen("add") ? "Associer" : "Enregistrer"}
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
          onConfirm={deleteHandler}
          message={`Êtes-vous sûr de vouloir supprimer l’association de "${modal.data?.mpinoNom}" avec "${modal.data?.sampanaNom}" ?`}
        />
      )}
    </div>
  );
};

export default SampanaManag;
