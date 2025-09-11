import React, { useState } from 'react';
import "./../styles/Fiangonana.css"; // afaka mampiasa style mitovy
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const Karite = () => {
    const [quartiers, setQuartiers] = useState([
        { id: 1, name: "Quartier A", chef: "Jean" },
        { id: 2, name: "Quartier B", chef: "Marie" }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newQuartier, setNewQuartier] = useState({ name: '', chef: '' });

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setNewQuartier({ name: '', chef: '' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewQuartier({ ...newQuartier, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newItem = { ...newQuartier, id: quartiers.length + 1 };
        setQuartiers([...quartiers, newItem]);
        handleCloseModal();
        alert("Quartier ajouté avec succès !");
    };

    const filteredQuartiers = quartiers.filter(q =>
        q.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.chef.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container">
            <header className="header-content">
                <h1>Liste des quartiers</h1>
                <button className="add-btn" onClick={handleOpenModal}><i className="fas fa-plus"></i>Ajouter un quartier</button>
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
                {filteredQuartiers.length > 0 ? (
                    filteredQuartiers.map(q => (
                        <div key={q.id} className="church-item">
                            <div className="church-info">
                                <h3>{q.name}</h3>
                                <p>Chef: {q.chef}</p>
                            </div>
                            <div className="church-actions">
                                <button className="action-btn edit-btn"><FontAwesomeIcon icon={faEdit} /></button>
                                <button className="action-btn delete-btn"><FontAwesomeIcon icon={faTrash} /></button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Aucun quartier trouvé</p>
                )}
            </div>

            {isModalOpen && (
                <div className="modalFiangonana">
                    <div className="modalFiangonana-content">
                        <div className="modalFiangonana-header">
                            <h2>Ajouter un quartier</h2>
                            <button className="close-btn" onClick={handleCloseModal}>&times;</button>
                        </div>
                        <div className="modalFiangonana-body">
                            <form>
                                <div className="formFiangonana-group">
                                    <label>Nom du quartier *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={newQuartier.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="formFiangonana-group">
                                    <label>Chef du quartier *</label>
                                    <input
                                        type="text"
                                        name="chef"
                                        value={newQuartier.chef}
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

export default Karite;
