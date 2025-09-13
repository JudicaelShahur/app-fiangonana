import React, { useState } from 'react';
import "./../styles/ChefKartie.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const ChefKartie = () => {
    const [chefs, setChefs] = useState([
        { id: 1, id_mpin: "MP001", id_kar: "K001", annee_kar: 2024 },
        { id: 2, id_mpin: "MP002", id_kar: "K002", annee_kar: 2025 }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null); // null = ajout, sinon édition
    const [newChef, setNewChef] = useState({ id_mpin: '', id_kar: '', annee_kar: '' });

    const handleOpenModal = (chef = null) => {
        if (chef) {
            setNewChef(chef); // Pré-remplir pour modification
            setEditingId(chef.id);
        } else {
            setNewChef({ id_mpin: '', id_kar: '', annee_kar: '' });
            setEditingId(null);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setNewChef({ id_mpin: '', id_kar: '', annee_kar: '' });
        setEditingId(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewChef({ ...newChef, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            // 🔄 Modification
            setChefs(chefs.map(c => c.id === editingId ? { ...newChef, id: editingId } : c));
            alert("Chef modifié avec succès !");
        } else {
            // ➕ Ajout
            const newItem = { ...newChef, id: chefs.length + 1 };
            setChefs([...chefs, newItem]);
            alert("Chef ajouté avec succès !");
        }
        handleCloseModal();
    };

    const handleDelete = (id) => {
        if (window.confirm("Voulez-vous vraiment supprimer ce chef ?")) {
            setChefs(chefs.filter(c => c.id !== id));
        }
    };

    const filteredChefs = chefs.filter(c =>
        c.id_mpin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.id_kar.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="chefkartie-container">
            <div className="chefcontainerKartie">
                <header className="chefheader-contentKartie">
                    <h1>Liste des chefs</h1>
                    <button className="add-btnchefKartie" onClick={() => handleOpenModal()}>
                        <i className="fas fa-plus"></i> Ajouter un chef
                    </button>
                </header>

                <div className="searchChefKartie-bar">
                    <div className="searchChefKartie-input">
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className="searchChefKartie-icon"><i className="fas fa-search"></i></span>
                    </div>
                    <button className="filterChefKartie-btn">
                        <i className="fas fa-filter"></i> Filtrer
                    </button>
                </div>

                <div className="tableChefKartie-container">
                    <table className="chefkartie-table">
                        <thead>
                            <tr>
                                <th>ID MPIN</th>
                                <th>ID Kar</th>
                                <th>Année Kar</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredChefs.map(c => (
                                <tr key={c.id}>
                                    <td data-label="ID MPIN">{c.id_mpin}</td>
                                    <td data-label="ID Kar">{c.id_kar}</td>
                                    <td data-label="Année Kar">{c.annee_kar}</td>
                                    <td data-label="Actions" className="action-btnCherKartie">
                                        <button className="btnChefKartie" onClick={() => handleOpenModal(c)}>
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button className="btnChefKartie btn-danger" onClick={() => handleDelete(c.id)}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredChefs.length === 0 && (
                        <div className="no-resultsChefKartie">
                            Aucun résultat trouvé pour "{searchTerm}"
                        </div>
                    )}
                </div>

                {isModalOpen && (
                    <div className="modalChefKartie-overlay">
                        <div className="modalChefKartie-content">
                            <div className="modalChefKartie-header">
                                <h2>{editingId ? "Modifier un chef" : "Ajouter un chef"}</h2>
                                <button className="close-btnKartie" onClick={handleCloseModal}>&times;</button>
                            </div>
                            <div className="modalChefKartie-body">
                                <form>
                                    <div className="formChefKartie-group">
                                        <label>ID MPIN *</label>
                                        <input type="text" name="id_mpin" value={newChef.id_mpin} onChange={handleInputChange} required />
                                    </div>
                                    <div className="formChefKartie-group">
                                        <label>ID Kar *</label>
                                        <input type="text" name="id_kar" value={newChef.id_kar} onChange={handleInputChange} required />
                                    </div>
                                    <div className="formChefKartie-group">
                                        <label>Année Kar *</label>
                                        <input type="number" name="annee_kar" value={newChef.annee_kar} onChange={handleInputChange} required />
                                    </div>
                                </form>
                            </div>
                            <div className="modalChefKartie-footer">
                                <button className="cancelChefKartie-btn" onClick={handleCloseModal}>Annuler</button>
                                <button className="saveChefKartie-btn" onClick={handleSubmit}>
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

export default ChefKartie;
