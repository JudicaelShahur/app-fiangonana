import React, { useState } from 'react';
import "./../styles/Fiangonana.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

// Import des composants
import Quartier from '../pages/Kartie';
import ChefQuartier from '../pages/ChefKartie';
// On peut isoler le modal dans un fichier séparé

const Fiangonana = () => {
    const [activeTab, setActiveTab] = useState("eglises");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [churches, setChurches] = useState([
        { id: 1, name: "Église Saint-Pierre", address: "123 Rue de l'Église, Paris", phone: "01 23 45 67 89", email: "stpierre@eglise.fr", admin: "Père Jean Dupont", photo: "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=600&q=80", type: "catholic" },
        { id: 2, name: "Église Notre-Dame", address: "456 Avenue des Martyrs, Lyon", phone: "04 56 78 90 12", email: "notredame@eglise.fr", admin: "Père Michel Martin", photo: "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?auto=format&fit=crop&w=600&q=80", type: "catholic" }
    ]);

    const [newChurch, setNewChurch] = useState({ name: '', address: '', phone: '', email: '', admin: '', description: '', type: 'catholic', photo: '' });

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setNewChurch({ name: '', address: '', phone: '', email: '', admin: '', description: '', type: 'catholic', photo: '' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewChurch({ ...newChurch, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newItem = { ...newChurch, id: churches.length + 1 };
        setChurches([...churches, newItem]);
        handleCloseModal();
        alert("Église ajoutée avec succès !");
    };

    const handleSearch = (e) => setSearchTerm(e.target.value);

    const filteredChurches = churches.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.admin.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="church-management">

            {/* Mini menu navigation */}
            <nav className="mini-nav">
                <button className={activeTab === "eglises" ? "active" : ""} onClick={() => setActiveTab("eglises")}>Églises</button>
                <button className={activeTab === "quartiers" ? "active" : ""} onClick={() => setActiveTab("quartiers")}>Quartiers</button>
                <button className={activeTab === "chefs" ? "active" : ""} onClick={() => setActiveTab("chefs")}>Chefs de quartier</button>
            </nav>

            {/* Contenu selon onglet */}
            {activeTab === "eglises" && (
                <div className="container">
                    <header className="header-content">
                        <h1>Liste complète des églises</h1>
                        <button className="add-btn" onClick={handleOpenModal}><i className="fas fa-plus"></i> Ajouter une église</button>
                    </header>

                    <div className="search-bar">
                        <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={handleSearch} />
                        <button className="filter-btn">
                            <i className="fas fa-filter"></i> Filtrer
                        </button>
                    </div>

                    <div className="church-list">
                        {filteredChurches.length > 0 ? (
                            filteredChurches.map(c => (
                                <ChurchItem key={c.id} church={c} />
                            ))
                        ) : (
                            <p>Aucune église trouvée</p>
                        )}
                    </div>
                </div>
            )}

            {activeTab === "quartiers" && <Quartier />}
            {activeTab === "chefs" && <ChefQuartier />}

            {isModalOpen && (
                <AddChurchModal
                    newChurch={newChurch}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleSubmit}
                    handleCloseModal={handleCloseModal}
                />
            )}
        </div>
    );
};

const ChurchItem = ({ church }) => (
    <div className="church-item">
        <div className="church-image"><img src={church.photo} alt={church.name} /></div>
        <div className="church-info">
            <h3>{church.name}</h3>
            <p><i className="fas fa-map-marker-alt"></i> {church.address}</p>
            <p><i className="fas fa-phone"></i> {church.phone}</p>
            <p><i className="fas fa-envelope"></i> {church.email}</p>
            <p><i className="fas fa-user"></i> Admin: {church.admin}</p>
        </div>
        <div className="church-actions">
            <button className="action-btn edit-btn"><FontAwesomeIcon icon={faEdit} /></button>
            <button className="action-btn delete-btn"><FontAwesomeIcon icon={faTrash} /></button>
        </div>
    </div>
);

export default Fiangonana;
