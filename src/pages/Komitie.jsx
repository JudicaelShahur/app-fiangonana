import React, { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./../styles/Komitie.css";
import useModal from "../hooks/useModal";
import ConfirmDeleteModal from "../utils/ConfirmDeleteModal.jsx";

const Komitie = () => {
  const [komities, setKomities] = useState([
    { id: 1, titre_kom: "Komity Ara-bola", id_mpin: "MP001" },
    { id: 2, titre_kom: "Komity Tanora", id_mpin: "MP002" },
  ]);
  
  const [formData, setFormData] = useState({ titre_kom: "", id_mpin: "" });
  const [searchTerm, setSearchTerm] = useState("");
  
  const { modal, openModal, closeModal, isOpen } = useModal();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAdd = () => {
    setFormData({ titre_kom: "", id_mpin: "" });
    openModal("add");
  };

  const openEdit = (kom) => {
    setFormData({ titre_kom: kom.titre_kom, id_mpin: kom.id_mpin });
    openModal("edit", kom);
  };

  const openDelete = (kom) => openModal("delete", kom);

  const handleAddKomitie = () => {
    setKomities([...komities, { ...formData, id: komities.length + 1 }]);
    closeModal();
  };

  const handleEditKomitie = () => {
    setKomities(
      komities.map(k => k.id === modal.data.id ? { ...k, ...formData } : k)
    );
    closeModal();
  };

  const handleDeleteKomitie = () => {
    setKomities(komities.filter(k => k.id !== modal.data.id));
    closeModal();
  };

  const filteredKomities = komities.filter(
    k => k.titre_kom.toLowerCase().includes(searchTerm.toLowerCase()) ||
         k.id_mpin.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        </div>
      </div>

      {/* Table */}
      <div className="table-komitie-container">
        {filteredKomities.length > 0 ? (
          <table className="komitie-table">
            <thead>
              <tr>
                <th>Titre Komitie</th>
                <th>ID Mpitondra</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredKomities.map(kom => (
                <tr key={kom.id}>
                  <td data-label="Titre">{kom.titre_kom}</td>
                  <td data-label="ID Mpitondra">{kom.id_mpin}</td>
                  <td data-label="Actions" className="action-btn-komitie">
                    <button className="btn-komitie" onClick={() => openEdit(kom)}>
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="btn-komitie btn-danger" onClick={() => openDelete(kom)}>
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-results-komitie">Aucun résultat trouvé pour "{searchTerm}"</p>
        )}
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
                <input type="text" name="titre_kom" value={formData.titre_kom} onChange={handleInputChange} placeholder="Titre du komitie"/>
              </div>
              <div className="form-komitie-group">
                <label>ID Mpitondra</label>
                <input type="text" name="id_mpin" value={formData.id_mpin} onChange={handleInputChange} placeholder="Identifiant Mpitondra"/>
              </div>
            </div>
            <div className="modal-komitie-footer">
              <button className="cancel-komitie-btn" onClick={closeModal}>Annuler</button>
              <button className="save-komitie-btn" onClick={isOpen("add") ? handleAddKomitie : handleEditKomitie}>
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
          onConfirm={handleDeleteKomitie}
          message={`Êtes-vous sûr de vouloir supprimer le komitie "${modal.data.titre_kom}" ?`}
        />
      )}
    </div>
  );
};

export default Komitie;
