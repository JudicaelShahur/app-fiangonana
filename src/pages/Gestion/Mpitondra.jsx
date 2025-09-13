import React, { useState } from 'react';
import "../../styles/Mpitondra.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const Mpitondra = () => {
    const [mpitondras, setMpitondras] = useState([
        { id: 1, id_mpin: "MP001", annee_mpitondra: 2024, titre_mpitondra: "Président", desc_mpitondra: "Responsable principal", id_fiang: "F001" },
        { id: 2, id_mpin: "MP002", annee_mpitondra: 2025, titre_mpitondra: "Secrétaire", desc_mpitondra: "Gestion administrative", id_fiang: "F002" }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null); // null = ajout, sinon modification
    const [newMpitondra, setNewMpitondra] = useState({
        id_mpin: '',
        annee_mpitondra: '',
        titre_mpitondra: '',
        desc_mpitondra: '',
        id_fiang: ''
    });

    const handleOpenModal = (mpitondra = null) => {
        if (mpitondra) {
            setNewMpitondra(mpitondra); // Pré-remplir pour édition
            setEditingId(mpitondra.id);
        } else {
            setNewMpitondra({ id_mpin: '', annee_mpitondra: '', titre_mpitondra: '', desc_mpitondra: '', id_fiang: '' });
            setEditingId(null);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setNewMpitondra({ id_mpin: '', annee_mpitondra: '', titre_mpitondra: '', desc_mpitondra: '', id_fiang: '' });
        setEditingId(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMpitondra({ ...newMpitondra, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            // mode modification
            setMpitondras(mpitondras.map(m => m.id === editingId ? { ...newMpitondra, id: editingId } : m));
            alert("Mpitondra modifié avec succès !");
        } else {
            // mode ajout
            const newItem = { ...newMpitondra, id: mpitondras.length + 1 };
            setMpitondras([...mpitondras, newItem]);
            alert("Mpitondra ajouté avec succès !");
        }
        handleCloseModal();
    };

    const handleDelete = (id) => {
        if (window.confirm("Voulez-vous vraiment supprimer ce mpitondra ?")) {
            setMpitondras(mpitondras.filter(m => m.id !== id));
        }
    };

    const filteredMpitondras = mpitondras.filter(m =>
        m.id_mpin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.titre_mpitondra.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="mpitondra-container">
            <div className="mpitondra-content">
                <header className="mpitondra-header">
                    <h1>Liste des mpitondra</h1>
                    <button className="add-btn-mpitondra" onClick={() => handleOpenModal()}>
                        <i className="fas fa-plus"></i> Ajouter un mpitondra
                    </button>
                </header>

                <div className="search-mpitondra-bar">
                    <div className="search-mpitondra-input">
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className="search-mpitondra-icon"><i className="fas fa-search"></i></span>
                    </div>
                </div>

                <div className="table-mpitondra-container">
                    <table className="mpitondra-table">
                        <thead>
                            <tr>
                                <th>ID MPIN</th>
                                <th>Année</th>
                                <th>Titre</th>
                                <th>Description</th>
                                <th>ID Fiang</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMpitondras.map(m => (
                                <tr key={m.id}>
                                    <td data-label="ID MPIN">{m.id_mpin}</td>
                                    <td data-label="Année">{m.annee_mpitondra}</td>
                                    <td data-label="Titre">{m.titre_mpitondra}</td>
                                    <td data-label="Description">{m.desc_mpitondra}</td>
                                    <td data-label="ID Fiang">{m.id_fiang}</td>
                                    <td data-label="Actions" className="action-btn-mpitondra">
                                        <button className="btn-mpitondra" onClick={() => handleOpenModal(m)}>
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button className="btn-mpitondra btn-danger" onClick={() => handleDelete(m.id)}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredMpitondras.length === 0 && (
                        <div className="no-results-mpitondra">
                            Aucun résultat trouvé pour "{searchTerm}"
                        </div>
                    )}
                </div>

                {isModalOpen && (
                    <div className="modal-mpitondra-overlay">
                        <div className="modal-mpitondra-content">
                            <div className="modal-mpitondra-header">
                                <h2>{editingId ? "Modifier un mpitondra" : "Ajouter un mpitondra"}</h2>
                                <button className="close-btn-mpitondra" onClick={handleCloseModal}>&times;</button>
                            </div>
                            <div className="modal-mpitondra-body">
                                <form>
                                    <div className="form-mpitondra-group">
                                        <label>ID MPIN *</label>
                                        <input type="text" name="id_mpin" value={newMpitondra.id_mpin} onChange={handleInputChange} required />
                                    </div>
                                    <div className="form-mpitondra-group">
                                        <label>Année *</label>
                                        <input type="number" name="annee_mpitondra" value={newMpitondra.annee_mpitondra} onChange={handleInputChange} required />
                                    </div>
                                    <div className="form-mpitondra-group">
                                        <label>Titre *</label>
                                        <input type="text" name="titre_mpitondra" value={newMpitondra.titre_mpitondra} onChange={handleInputChange} required />
                                    </div>
                                    <div className="form-mpitondra-group">
                                        <label>Description *</label>
                                        <input type="text" name="desc_mpitondra" value={newMpitondra.desc_mpitondra} onChange={handleInputChange} required />
                                    </div>
                                    <div className="form-mpitondra-group">
                                        <label>ID Fiang *</label>
                                        <input type="text" name="id_fiang" value={newMpitondra.id_fiang} onChange={handleInputChange} required />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-mpitondra-footer">
                                <button className="cancel-mpitondra-btn" onClick={handleCloseModal}>Annuler</button>
                                <button className="save-mpitondra-btn" onClick={handleSubmit}>
                                    {editingId ? "Modifier" : "Enregistrer"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Mpitondra;
