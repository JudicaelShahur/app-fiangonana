import React, { useState } from 'react';
import "./../styles/Fiangonana.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
const ChefKartie = () => {
    const [chefs, setChefs] = useState([
        { id: 1, name: "Jean Dupont", quartier: "Quartier A" },
        { id: 2, name: "Marie Martin", quartier: "Quartier B" }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newChef, setNewChef] = useState({ name: '', quartier: '' });

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setNewChef({ name: '', quartier: '' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewChef({ ...newChef, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newItem = { ...newChef, id: chefs.length + 1 };
        setChefs([...chefs, newItem]);
        handleCloseModal();
        alert("Chef de quartier ajouté avec succès !");
    };

    const filteredChefs = chefs.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.quartier.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container">
            <header className="header-content">
                <h1>Liste des chefs de quartier</h1>
                <button className="add-btn" onClick={handleOpenModal}><i className="fas fa-plus"></i>Ajouter un chef</button>
            </header>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="filter-btn">
                    <i className="fas fa-filter"></i> Filtrer
                </button>
            </div>

            <div className="church-list">
                {filteredChefs.length > 0 ? (
                    filteredChefs.map(c => (
                        <div key={c.id} className="church-item">
                            <div className="church-info">
                                <h3>{c.name}</h3>
                                <p>Quartier: {c.quartier}</p>
                            </div>
                            <div className="church-actions">
                                <button className="action-btn edit-btn"><FontAwesomeIcon icon={faEdit} /></button>
                                <button className="action-btn delete-btn"><FontAwesomeIcon icon={faTrash} /></button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Aucun chef trouvé</p>
                )}
                
            </div>

            {isModalOpen && (
                <div className="modalFiangonana">
                    <div className="modalFiangonana-content">
                        <div className="modalFiangonana-header">
                            <h2>Ajouter un chef de quartier</h2>
                            <button className="close-btn" onClick={handleCloseModal}>&times;</button>
                        </div>
                        <div className="modalFiangonana-body">
                            <form>
                                <div className="formFiangonana-group">
                                    <label>Nom du chef *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={newChef.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="formFiangonana-group">
                                    <label>Quartier *</label>
                                    <input
                                        type="text"
                                        name="quartier"
                                        value={newChef.quartier}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="modalFiangonana-footer">
                            <button className="cancel-btn" onClick={handleCloseModal}>Annuler</button>
                            <button className="submit-btn" onClick={handleSubmit}>Enregistrer</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChefKartie;
