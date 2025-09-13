import React, { useState } from "react";
import "./../styles/Kartie.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faTimes, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FaSearch } from "react-icons/fa";
import ConfirmDeleteModal from "../utils/ConfirmDeleteModal.jsx";
import useModal from "../hooks/useModal"; 

const Kartie = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { modal, openModal, closeModal, isOpen } = useModal();

  const [formData, setFormData] = useState({
    nom_kar: "",
    desc_kar: "",
    fiangonana: ""
  });

  const [kartie, setKartie] = useState([
    { id: 1, nom_kar: "Jean Rakoto", desc_kar: "+261 34 12 345 67", fiangonana: "Synchronisé" },
    { id: 2, nom_kar: "Sahalava Masoakely", desc_kar: "fokotany mpino", fiangonana: "FLM Mahamanina" },
    { id: 3, nom_kar: "Mahamanina", desc_kar: "fokotany tsara", fiangonana: "FLM Mahamanina" },
    { id: 4, nom_kar: "Ivory Antsimo", desc_kar: "foibe fokotany", fiangonana: "FLM Ivory" }
  ]);

  const filteredKartie = kartie.filter(k =>
    k.nom_kar.toLowerCase().includes(searchTerm.toLowerCase()) ||
    k.desc_kar.toLowerCase().includes(searchTerm.toLowerCase()) ||
    k.fiangonana.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Gestion formulaire ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddKartie = () => {
    setKartie([...kartie, { id: kartie.length + 1, ...formData }]);
    closeModal();
  };

  const handleEditKartie = () => {
    setKartie(kartie.map(item => item.id === modal.data.id ? { ...item, ...formData } : item));
    closeModal();
  };

  const handleDeleteKartie = () => {
    setKartie(kartie.filter(item => item.id !== modal.data.id));
    closeModal();
  };

  const openAdd = () => {
    setFormData({ nom_kar: "", desc_kar: "", fiangonana: "" });
    openModal("add");
  };

  const openEdit = (k) => {
    setFormData({ nom_kar: k.nom_kar, desc_kar: k.desc_kar, fiangonana: k.fiangonana });
    openModal("edit", k);
  };

  const openDelete = (k) => openModal("delete", k);

  return (
    <div className="kartie-container">
      <div className="containerKartie">
        <header>
          <div className="header-contentKartie">
            <h1>Liste complète des Quartie</h1>
            <button className="add-btnKartie" onClick={openAdd}>
              <FontAwesomeIcon icon={faPlus} /> Ajouter une église
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
          <button className="filterKartie-btn">
            <i className="fas fa-filter"></i> Filtrer
          </button>
        </div>

        <div className="tableKartie-container">
          <table className="kartie-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Description</th>
                <th>Fiangonana</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredKartie.map(k => (
                <tr key={k.id}>
                  <td className="nomKartie-cell" data-label="Nom">{k.nom_kar}</td>
                  <td data-label="Description">{k.desc_kar}</td>
                  <td data-label="Fiangonana">
                    <span className="status-badgeKartie synchronise">{k.fiangonana}</span>
                  </td>
                  <td className="action-btnKartie" data-label="Action">
                    <button className="btnKartie" onClick={() => openEdit(k)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className="btnKartie btn-danger" onClick={() => openDelete(k)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredKartie.length === 0 && <div className="no-resultsKartie">Aucun résultat trouvé pour "{searchTerm}"</div>}
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
                <label>Nom</label>
                <input type="text" name="nom_kar" value={formData.nom_kar} onChange={handleInputChange} placeholder="Entrez le nom" />
              </div>
              <div className="formKartie-group">
                <label>Description</label>
                <input type="text" name="desc_kar" value={formData.desc_kar} onChange={handleInputChange} placeholder="Entrez la description" />
              </div>
              <div className="formKartie-group">
                <label>Fiangonana</label>
                <input type="text" name="fiangonana" value={formData.fiangonana} onChange={handleInputChange} placeholder="Entrez le nom de l'église" />
              </div>
            </div>
            <div className="modalKartie-footer">
              <button className="cancelKartie-btn" onClick={closeModal}>Annuler</button>
              <button className="saveKartie-btn" onClick={isOpen("add") ? handleAddKartie : handleEditKartie}>
                {isOpen("add") ? "Ajouter" : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal suppression */}
      {isOpen("delete") && (
        <ConfirmDeleteModal
          isOpen={true}
          onClose={closeModal}
          onConfirm={handleDeleteKartie}
          message={`Êtes-vous sûr de vouloir supprimer le kartie "${modal.data.nom_kar}" ?`}
        />
      )}
    </div>
  );
};

export default Kartie;
