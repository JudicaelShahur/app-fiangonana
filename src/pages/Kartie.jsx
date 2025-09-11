import React, { useState } from "react";
import "./../styles/Kartie.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faTimes, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FaSearch } from "react-icons/fa";

const Kartie = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentKartie, setCurrentKartie] = useState(null);
  const [formData, setFormData] = useState({
    nom_kar: "",
    desc_kar: "",
    fiangonana: ""
  });

  // Données des kartie
  const [kartie, setKartie] = useState([
    {
      id: 1,
      nom_kar: "Jean Rakoto",
      desc_kar: "+261 34 12 345 67",
      fiangonana: "Synchronisé",
    },
    {
      id: 2,
      nom_kar: "Sahalava Masoakely",
      desc_kar: "fokotany mpino",
      fiangonana: "FLM Mahamanina",
    },
    {
      id: 3,
      nom_kar: "Mahamanina",
      desc_kar: "fokotany tsara",
      fiangonana: "FLM Mahamanina",
    },
    {
      id: 4,
      nom_kar: "Ivory Antsimo",
      desc_kar: "foibe fokotany",
      fiangonana: "FLM Ivory",
    }
  ]);

  // Filtrer les kartie selon le terme de recherche
  const filteredKartie = kartie.filter(kartie =>
    kartie.nom_kar.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kartie.desc_kar.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kartie.fiangonana.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Gérer l'ouverture de la modal d'ajout
  const handleOpenModal = () => {
    setFormData({
      nom_kar: "",
      desc_kar: "",
      fiangonana: ""
    });
    setIsModalOpen(true);
  };

  // Gérer l'ouverture de la modal d'édition
  const handleOpenEditModal = (kartie) => {
    setCurrentKartie(kartie);
    setFormData({
      nom_kar: kartie.nom_kar,
      desc_kar: kartie.desc_kar,
      fiangonana: kartie.fiangonana
    });
    setIsEditModalOpen(true);
  };

  // Gérer la fermeture des modales
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
  };

  // Gérer les changements dans le formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Ajouter un nouveau kartie
  const handleAddKartie = () => {
    const newKartie = {
      id: kartie.length + 1,
      ...formData
    };
    setKartie([...kartie, newKartie]);
    handleCloseModal();
  };

  // Modifier un kartie existant
  const handleEditKartie = () => {
    const updatedKartie = kartie.map(item => 
      item.id === currentKartie.id ? { ...item, ...formData } : item
    );
    setKartie(updatedKartie);
    handleCloseModal();
  };

  // Supprimer un kartie
  const handleDeleteKartie = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce kartie?")) {
      const updatedKartie = kartie.filter(item => item.id !== id);
      setKartie(updatedKartie);
    }
  };

  return (
    <div className="kartie-container">
      <div className="containerKartie">
        <header>
          <div className="header-contentKartie">
            <div>
              <h1>Liste complète des Quartie</h1>
            </div>
            <button className="add-btnKartie" onClick={handleOpenModal}>
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
            {filteredKartie.map(kartie => (
                <tr key={kartie.id}>
                <td className="nomKartie-cell" data-label="Nom">{kartie.nom_kar}</td>
                <td data-label="Description">{kartie.desc_kar}</td>
                <td data-label="Fiangonana">
                    <span className="status-badgeKartie synchronise">{kartie.fiangonana}</span>
                </td>
                    <td className="action-btnKartie" data-label="Action">
                    <button className=" btnKartie" onClick={() => handleOpenEditModal(kartie)}>
                    <FontAwesomeIcon icon={faEdit} />
                    </button>
                        <button className="btnKartie btn-danger" onClick={() => handleDeleteKartie(kartie.id)}>
                    <FontAwesomeIcon icon={faTrash} />
                    </button>
                </td>
                </tr>
            ))}
            </tbody>
          </table>
          
          {filteredKartie.length === 0 && (
            <div className="no-resultsKartie">
              Aucun résultat trouvé pour "{searchTerm}"
            </div>
          )}
        </div>
      </div>

      {/* Modal d'ajout */}
      {isModalOpen && (
        <div className="modalKartie-overlay">
          <div className="modalKartie-content">
            <div className="modalKartie-header">
              <h2>Ajouter un Kartie</h2>
              <button className="close-btnKartie" onClick={handleCloseModal}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="modalKartie-body">
              <div className="formKartie-group">
                <label>Nom</label>
                <input
                  type="text"
                  name="nom_kar"
                  value={formData.nom_kar}
                  onChange={handleInputChange}
                  placeholder="Entrez le nom"
                />
              </div>
              <div className="formKartie-group">
                <label>Description</label>
                <input
                  type="text"
                  name="desc_kar"
                  value={formData.desc_kar}
                  onChange={handleInputChange}
                  placeholder="Entrez la description"
                />
              </div>
              <div className="formKartie-group">
                <label>Fiangonana</label>
                <input
                  type="text"
                  name="fiangonana"
                  value={formData.fiangonana}
                  onChange={handleInputChange}
                  placeholder="Entrez le nom de l'église"
                />
              </div>
            </div>
            <div className="modalKartie-footer">
              <button className="cancelKartie-btn" onClick={handleCloseModal}>
                Annuler
              </button>
              <button className="saveKartie-btn" onClick={handleAddKartie}>
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'édition */}
      {isEditModalOpen && (
        <div className="modalKartie-overlay">
          <div className="modalKartie-content">
            <div className="modalKartie-header">
              <h2>Modifier le Kartie</h2>
              <button className="close-btnKartie" onClick={handleCloseModal}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="modalKartie-body">
              <div className="formKartie-group">
                <label>Nom</label>
                <input
                  type="text"
                  name="nom_kar"
                  value={formData.nom_kar}
                  onChange={handleInputChange}
                  placeholder="Entrez le nom"
                />
              </div>
              <div className="formKartie-group">
                <label>Description</label>
                <input
                  type="text"
                  name="desc_kar"
                  value={formData.desc_kar}
                  onChange={handleInputChange}
                  placeholder="Entrez la description"
                />
              </div>
              <div className="formKartie-group">
                <label>Fiangonana</label>
                <input
                  type="text"
                  name="fiangonana"
                  value={formData.fiangonana}
                  onChange={handleInputChange}
                  placeholder="Entrez le nom de l'église"
                />
              </div>
            </div>
            <div className="modalKartie-footer">
              <button className="cancelKartie-btn" onClick={handleCloseModal}>
                Annuler
              </button>
              <button className="saveKartie-btn" onClick={handleEditKartie}>
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Kartie;