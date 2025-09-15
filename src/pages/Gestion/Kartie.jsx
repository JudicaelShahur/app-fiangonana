import React from "react";
import "../../styles/Kartie.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faTimes, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FaSearch } from "react-icons/fa";
import ConfirmDeleteModal from "../../utils/ConfirmDeleteModal.jsx";
import { useKartie } from "../../hooks/useKartie.js";

const Kartie = () => {
  const {
    filteredKartie,
    searchTerm,
    setSearchTerm,
    openAdd,
    openEdit,
    openDelete,
    formData,
    handleInputChange,
    addKartieHandler,
    editKartieHandler,
    deleteKartieHandler,
    fiangonanas,
    modal,
    isOpen,
    closeModal,
    currentPage,
    setCurrentPage,
    totalPages,
    getPagesArray,
    loading
  } = useKartie();

  return (
    <div className="kartie-container">
      <div className="containerKartie">
        <header>
          <div className="header-contentKartie">
            <h1>Liste complète des Quartie</h1>
            <button className="add-btnKartie" onClick={openAdd}>
              <FontAwesomeIcon icon={faPlus} /> Ajouter un Kartie
            </button>
          </div>
        </header>

        <div className="searchKartie-bar">
          <div className="searchKartie-input">
            <FaSearch className="searchKartie-icon" />
            <input
              type="text"
              placeholder="Rechercher par kartie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="tableKartie-container">
          <table className="kartie-table">
            <thead>
              <tr>
                <th>Nom Kartie</th>
                <th>Description Kartie</th>
                <th>Fiangonana</th>
                <th>Photo</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                    <div className="loader"></div>
                  </td>
                </tr>
              ) : filteredKartie.length > 0 ? (
                filteredKartie.map(k => (
                  <tr key={k.id}>
                    <td data-label="Nom">{k.nom_kar}</td>
                    <td data-label="Description">{k.desc_kar}</td>
                    <td data-label="Fiangonana">{k.fiang_nom}</td>
                    <td data-label="Photo">
                      {k.fiang_pho ? (
                        <img
                          src={JSON.parse(k.fiang_pho).url}
                          alt={k.fiang_nom}
                          style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
                        />
                      ) : "-"}
                    </td>
                    <td data-label="Actions">
                      <button className="btnKartie" onClick={() => openEdit(k)}>
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button className="btnKartie btn-danger" onClick={() => openDelete(k)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                      <td colSpan="5" style={{ textAlign: "center", padding: "20px" }} className="no-resultsKartie">
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

            {/* Pages manokana */}
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
      </div>

      {/* Modal ajout / édition */}
      {(isOpen("add") || isOpen("edit")) && (
        <div className="modalKartie-overlay">
          <div className="modalKartie-content">
            <div className="modalKartie-header">
              <h2>{isOpen("add") ? "Ajouter un Kartie" : "Modifier le Kartie"}</h2>
              <button className="close-btnKartie" onClick={closeModal}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="modalKartie-body">
              <div className="formKartie-group">
                <label>Nom Kartie</label>
                <input type="text" name="nom_kar" value={formData.nom_kar} onChange={handleInputChange} placeholder="Entrez le nom" />
              </div>
              <div className="formKartie-group">
                <label>Description Kartie</label>
                <input type="text" name="desc_kar" value={formData.desc_kar} onChange={handleInputChange} placeholder="Entrez la description" />
              </div>
              <div className="formKartie-group">
                <label>Fiangonana</label>
                <select name="fiang_id" value={formData.fiang_id} onChange={handleInputChange}>
                  <option value="">-- Sélectionner --</option>
                  {fiangonanas.map(f => (
                    <option key={f.id} value={f.id.toString()}>{f.fiang_nom}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modalKartie-footer">
              <button className="cancelKartie-btn" onClick={closeModal}>Annuler</button>
              <button
                className="saveKartie-btn"
                onClick={isOpen("add") ? addKartieHandler : editKartieHandler}
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
          onConfirm={deleteKartieHandler}
          message={`Êtes-vous sûr de vouloir supprimer le kartie "${modal.data.nom_kar}" ?`}
        />
      )}
    </div>
  );
};

export default Kartie;
