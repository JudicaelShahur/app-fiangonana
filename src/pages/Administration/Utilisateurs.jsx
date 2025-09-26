import React from "react";
import { FaPlus, FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import "../../styles/Utilisateur.css";
import useModal from "../../hooks/useModal";
import ConfirmDeleteModal from "../../utils/ConfirmDeleteModal";
import { useUtilisateurs } from "../../hooks/useUtilisateurs";

const Utilisateurs = () => {
  const {
    filteredUtilisateurs,
    formData,
    setFormData,
    searchTerm,
    setSearchTerm,
    handleInputChange,
    addUtilisateur,
    editUtilisateur,
    deleteUtilisateur,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    getPagesArray,
    setCurrentPage
  } = useUtilisateurs();

  const { modal, openModal, closeModal, isOpen } = useModal();

  const openAdd = () => { setFormData({}); openModal("add"); };
  const openEdit = (u) => { setFormData(u); openModal("edit", u); };
  const openDelete = (u) => openModal("delete", u);

  return (
    <div className="utilisateur-management">
      {/* HEADER */}
      <div className="pageUtilisateur-header">
        <h1>Gestion des Utilisateurs</h1>
        <button className="btnUtilisateur btn-primary" onClick={openAdd}><FaPlus /> Nouvel Utilisateur</button>
      </div>

      {/* SEARCH */}
      <div className="searchUtilisateur-bar">
        <div className="searchUtilisateur-input">
          <FaSearch />
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="searchUtilisateur-stats">{filteredUtilisateurs.length} utilisateur(s) trouvé(s)</div>
      </div>

      {/* GRID */}
      <div className="utilisateur-grid">
        {filteredUtilisateurs.map((u) => (
          <div key={u.id} className="utilisateur-card">
            <div className="cardUtilisateur-header">
              <div className="utilisateur-info">
                <h3>{u.nom}</h3>
                <p><a href={`mailto:${u.email}`}>{u.email}</a></p>
              </div>
            </div>

            <div className="cardUtilisateur-details">
              <div><strong>Rôle:</strong> <span className={`role-badge ${u.role === "Admin" ? "admin" : "user"}`}>{u.role}</span></div>
              <div><strong>Fiangonana:</strong> {u.fiang_nom}</div>
            </div>

            <div className="cardUtilisateur-actions">
              <button className="btnUtilisateur-icon" onClick={() => openEdit(u)} title="Modifier"><FaEdit /></button>
              <button className="btnUtilisateur-icon btn-danger" onClick={() => openDelete(u)} title="Supprimer"><FaTrash /></button>
            </div>
          </div>
        ))}
      </div>
      {/* PAGINATION */}
      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>Précédent</button>
        {getPagesArray().map(page => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={page === currentPage ? "active" : ""}
          >
            {page}
          </button>
        ))}
        <button onClick={nextPage} disabled={currentPage === totalPages}>Suivant</button>
      </div>

      {/* MODAL Add/Edit */}
      {(isOpen("add") || isOpen("edit")) && (
        <div className="modalUtilisateur-overlay">
          <div className="modalUtilisateur">
            <div className="modalUtilisateur-header">
              <h2>{isOpen("add") ? "Ajouter un Utilisateur" : "Modifier l’Utilisateur"}</h2>
              <button className="modalUtilisateur-close" onClick={closeModal}>×</button>
            </div>

            <form className="modalUtilisateur-form" onSubmit={(e) => {
              e.preventDefault();
              isOpen("add") ? addUtilisateur() : editUtilisateur(modal.data.id);
              closeModal();
            }}>
              <div className="formUtilisateur-group">
                <label>Nom</label>
                <input type="text" name="nom_user" value={formData.nom_user || ""} onChange={handleInputChange} required />
              </div>

              <div className="formUtilisateur-group">
                <label>Email</label>
                <input type="email" name="email" value={formData.email || ""} onChange={handleInputChange} required />
              </div>

              <div className="formUtilisateur-group">
                <label>Rôle</label>
                <select name="role" value={formData.role || ""} onChange={handleInputChange} required>
                  <option value="">Sélectionner</option>
                  <option value="Admin">Admin</option>
                  <option value="Utilisateur">Utilisateur</option>
                </select>
              </div>

              <div className="formUtilisateur-group">
                <label>Fiangonana</label>
                <input type="text" name="fiangonana" value={formData.fiangonana || ""} onChange={handleInputChange} required />
              </div>

              <div className="modalUtilisateur-actions">
                <button type="button" onClick={closeModal}>Annuler</button>
                <button type="submit">{isOpen("add") ? "Ajouter" : "Modifier"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL Delete */}
      {isOpen("delete") && modal.data && (
        <ConfirmDeleteModal
          isOpen={true}
          onClose={closeModal}
          onConfirm={() => { deleteUtilisateur(modal.data.id); closeModal(); }}
          message={`Êtes-vous sûr de vouloir supprimer l’utilisateur "${modal.data.nom_user}" ?`}
        />
      )}
    </div>
  );
};

export default Utilisateurs;
