import React, { useState } from 'react';
import "../../styles/Vola.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const Vola = () => {
    const [volas, setVolas] = useState([
        { id: 1, montant: 50000, desc_vola: "Contribution paroissiale", fiang_id: "FI001" },
        { id: 2, montant: 120000, desc_vola: "Don spécial", fiang_id: "FI002" }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null); // null = ajout, sinon modification
    const [newVola, setNewVola] = useState({ montant: '', desc_vola: '', fiang_id: '' });

    const handleOpenModal = (vola = null) => {
        if (vola) {
            setNewVola(vola); // Pré-remplir le formulaire pour modification
            setEditingId(vola.id);
        } else {
            setNewVola({ montant: '', desc_vola: '', fiang_id: '' });
            setEditingId(null);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setNewVola({ montant: '', desc_vola: '', fiang_id: '' });
        setEditingId(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewVola({ ...newVola, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            // 🔄 Modification
            setVolas(volas.map(v => v.id === editingId ? { ...newVola, id: editingId } : v));
            alert("Vola modifié avec succès !");
        } else {
            // ➕ Ajout
            const newItem = { ...newVola, id: volas.length + 1 };
            setVolas([...volas, newItem]);
            alert("Vola ajouté avec succès !");
        }
        handleCloseModal();
    };

    const handleDelete = (id) => {
        if (window.confirm("Voulez-vous vraiment supprimer ce vola ?")) {
            setVolas(volas.filter(v => v.id !== id));
        }
    };

    const filteredVolas = volas.filter(v =>
        v.desc_vola.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.fiang_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="vola-container">
            <div className="vola-content">
                <header className="vola-header">
                    <h1>Liste des vola</h1>
                    <button className="add-btn-vola" onClick={() => handleOpenModal()}>
                        <i className="fas fa-plus"></i> Ajouter un vola
                    </button>
                </header>

                <div className="search-vola-bar">
                    <div className="search-vola-input">
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className="search-vola-icon"><i className="fas fa-search"></i></span>
                    </div>
                </div>

                <div className="table-vola-container">
                    <table className="vola-table">
                        <thead>
                            <tr>
                                <th>Montant</th>
                                <th>Description</th>
                                <th>ID Fiangonana</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredVolas.map(v => (
                                <tr key={v.id}>
                                    <td data-label="Montant">{v.montant}</td>
                                    <td data-label="Description">{v.desc_vola}</td>
                                    <td data-label="ID Fiangonana">{v.fiang_id}</td>
                                    <td data-label="Actions" className="action-btn-vola">
                                        <button className="btn-vola" onClick={() => handleOpenModal(v)}>
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button className="btn-vola btn-danger" onClick={() => handleDelete(v.id)}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredVolas.length === 0 && (
                        <div className="no-results-vola">
                            Aucun résultat trouvé pour "{searchTerm}"
                        </div>
                    )}
                </div>

                {isModalOpen && (
                    <div className="modal-vola-overlay">
                        <div className="modal-vola-content">
                            <div className="modal-vola-header">
                                <h2>{editingId ? "Modifier un vola" : "Ajouter un vola"}</h2>
                                <button className="close-btn-vola" onClick={handleCloseModal}>&times;</button>
                            </div>
                            <div className="modal-vola-body">
                                <form>
                                    <div className="form-vola-group">
                                        <label>Montant *</label>
                                        <input type="number" name="montant" value={newVola.montant} onChange={handleInputChange} required />
                                    </div>
                                    <div className="form-vola-group">
                                        <label>Description *</label>
                                        <input type="text" name="desc_vola" value={newVola.desc_vola} onChange={handleInputChange} required />
                                    </div>
                                    <div className="form-vola-group">
                                        <label>ID Fiangonana *</label>
                                        <input type="text" name="fiang_id" value={newVola.fiang_id} onChange={handleInputChange} required />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-vola-footer">
                                <button className="cancel-vola-btn" onClick={handleCloseModal}>Annuler</button>
                                <button className="save-vola-btn" onClick={handleSubmit}>
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

export default Vola;
