import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import "./../styles/Utilisateur.css";
import useModal from "../hooks/useModal";
import ConfirmDeleteModal from "../utils/ConfirmDeleteModal";

const Utilisateurs = () => {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({});
  const { modal, openModal, closeModal, isOpen } = useModal();

  useEffect(() => {
    // mock data
    setUtilisateurs([
      {
        id: 1,
        nom: "Rakoto",
        email: "rakoto@mail.com",
        role: "Admin",
        fiangonana: "FLM Ivory",
      },
      {
        id: 2,
        nom: "Rasoa",
        email: "rasoa@mail.com",
        role: "Utilisateur",
        fiangonana: "FLM Mahamanina",
      },
    ]);
  }, []);

  const filteredUtilisateurs = utilisateurs.filter(
    (u) =>
      u.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openAdd = () => {
    setFormData({});
    openModal("add");
  };

  const openEdit = (utilisateur) => {
    setFormData(utilisateur);
    openModal("edit", utilisateur);
  };

  const openDelete = (utilisateur) => openModal("delete", utilisateur);

  const handleAddUtilisateur = () => {
    setUtilisateurs((prev) => [...prev, { id: prev.length + 1, ...formData }]);
    closeModal();
  };

  const handleEditUtilisateur = () => {
    setUtilisateurs((prev) =>
      prev.map((u) => (u.id === modal.data.id ? { ...u, ...formData } : u))
    );
    closeModal();
  };

  const handleDeleteUtilisateur = () => {
    setUtilisateurs((prev) => prev.filter((u) => u.id !== modal.data.id));
    closeModal();
  };

  return (
    <div className="utilisateur-management">
      {/* HEADER */}
      <div className="pageUtilisateur-header">
        <h1>Gestion des Utilisateurs</h1>
        <button className="btnUtilisateur btn-primary" onClick={openAdd}>
          <FaPlus /> Nouvel Utilisateur
        </button>
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
        <div className="searchUtilisateur-stats">
          {filteredUtilisateurs.length} utilisateur(s) trouvé(s)
        </div>
      </div>

      {/* GRID */}
      <div className="utilisateur-grid">
        {filteredUtilisateurs.map((u) => (
          <div key={u.id} className="utilisateur-card">
            <div className="cardUtilisateur-header">
              <div className="utilisateur-info">
                <h3>{u.nom}</h3>
                <p>
                  <a href={`mailto:${u.email}`} className="email-link">
                    {u.email}
                  </a>
                </p>
              </div>
            </div>

            <div className="cardUtilisateur-details">
              <div className="detailUtilisateur-item">
                <strong>Rôle:</strong>{" "}
                <span
                  className={`role-badge ${
                    u.role === "Admin" ? "admin" : "user"
                  }`}
                >
                  {u.role}
                </span>
              </div>
              <div className="detailUtilisateur-item">
                <strong>Fiangonana:</strong> {u.fiangonana}
              </div>
            </div>

            <div className="cardUtilisateur-actions">
              <button
                className="btnUtilisateur-icon"
                onClick={() => openEdit(u)}
                title="Modifier"
              >
                <FaEdit />
              </button>
              <button
                className="btnUtilisateur-icon btn-danger"
                onClick={() => openDelete(u)}
                title="Supprimer"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL Add/Edit */}
      {(isOpen("add") || isOpen("edit")) && (
        <div className="modalUtilisateur-overlay">
          <div className="modalUtilisateur">
            <div className="modalUtilisateur-header">
              <h2>
                {isOpen("add")
                  ? "Ajouter un Utilisateur"
                  : "Modifier l’Utilisateur"}
              </h2>
              <button className="modalUtilisateur-close" onClick={closeModal}>
                ×
              </button>
            </div>

            <form
              className="modalUtilisateur-form"
              onSubmit={(e) => {
                e.preventDefault();
                isOpen("add") ? handleAddUtilisateur() : handleEditUtilisateur();
              }}
            >
              <div className="formUtilisateur-group">
                <label>Nom</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="formUtilisateur-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="formUtilisateur-group">
                <label>Rôle</label>
                <select
                  name="role"
                  value={formData.role || ""}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Sélectionner</option>
                  <option value="Admin">Admin</option>
                  <option value="Utilisateur">Utilisateur</option>
                </select>
              </div>

              <div className="formUtilisateur-group">
                <label>Fiangonana</label>
                <input
                  type="text"
                  name="fiangonana"
                  value={formData.fiangonana || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="modalUtilisateur-actions">
                <button type="button" onClick={closeModal}>
                  Annuler
                </button>
                <button type="submit">
                  {isOpen("add") ? "Ajouter" : "Modifier"}
                </button>
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
          onConfirm={handleDeleteUtilisateur}
          message={`Êtes-vous sûr de vouloir supprimer l’utilisateur "${modal.data.nom}" ?`}
        />
      )}
    </div>
  );
};

export default Utilisateurs;
