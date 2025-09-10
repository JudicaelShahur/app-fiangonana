import React, { useState } from 'react';
import "./../styles/Fiangonana.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
const Fiangonana = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [churches, setChurches] = useState([
        {
            id: 1,
            name: "Église Saint-Pierre",
            address: "123 Rue de l'Église, Paris",
            phone: "01 23 45 67 89",
            email: "stpierre@eglise.fr",
            admin: "Père Jean Dupont",
            photo: "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
            type: "catholic"
        },
        {
            id: 2,
            name: "Église Notre-Dame",
            address: "456 Avenue des Martyrs, Lyon",
            phone: "04 56 78 90 12",
            email: "notredame@eglise.fr",
            admin: "Père Michel Martin",
            photo: "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
            type: "catholic"
        },
        {
            id: 3,
            name: "Église Sainte-Anne",
            address: "789 Boulevard de la Liberté, Marseille",
            phone: "04 91 23 45 67",
            email: "sainteanne@eglise.fr",
            admin: "Pasteur Robert Leroy",
            photo: "https://images.unsplash.com/photo-1603386329225-868f9b1c5c19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
            type: "protestant"
        },
        {
            id: 4,
            name: "Église Saint-Paul",
            address: "101 Rue de la Paix, Toulouse",
            phone: "05 34 56 78 90",
            email: "stpaul@eglise.fr",
            admin: "Père Pierre Moreau",
            photo: "https://images.unsplash.com/photo-1619983193852-cc0006a15de6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
            type: "orthodox"
        }
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [newChurch, setNewChurch] = useState({
        name: '',
        address: '',
        phone: '',
        email: '',
        admin: '',
        description: '',
        type: 'catholic',
        photo: ''
    });

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        // Reset form
        setNewChurch({
            name: '',
            address: '',
            phone: '',
            email: '',
            admin: '',
            description: '',
            type: 'catholic',
            photo: ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewChurch({
            ...newChurch,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Ajouter la nouvelle église à la liste
        const newChurchWithId = {
            ...newChurch,
            id: churches.length + 1
        };
        setChurches([...churches, newChurchWithId]);
        handleCloseModal();
        alert('Église ajoutée avec succès!');
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredChurches = churches.filter(church =>
        church.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        church.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        church.admin.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="church-management">
            <div className="container">
                <header>
                    <div className="header-content">
                        <div>
                            <h1>Liste complète des églises enregistrées</h1>
                        </div>
                        <button className="add-btn" onClick={handleOpenModal}>
                            <i className="fas fa-plus"></i> Ajouter une église
                        </button>
                    </div>
                </header>

                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Rechercher une église, une adresse ou un administrateur..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <button className="filter-btn">
                        <i className="fas fa-filter"></i> Filtrer
                    </button>
                </div>

                <div className="church-list ">
                    {filteredChurches.length > 0 ? (
                        filteredChurches.map((church) => (
                            <ChurchItem key={church.id} church={church} />
                        ))
                    ) : (
                        <div className="no-result-card">
                            <p>Aucune église trouvée</p>
                        </div>
                    )}
                </div>
            </div>

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

const ChurchItem = ({ church }) => {
    return (
        <div className="church-item">
            <div className="church-image">
                <img src={church.photo} alt={church.name} />
            </div>
            <div className="church-info">
                <h3>{church.name}</h3>
                <p><i className="fas fa-map-marker-alt"></i> {church.address}</p>
                <p><i className="fas fa-phone"></i> {church.phone}</p>
                <p><i className="fas fa-envelope"></i> {church.email}</p>
                <p><i className="fas fa-user"></i> Admin: {church.admin}</p>
                <div className="church-type">
                    <span className={`type-badge ${church.type}`}>
                        {church.type === 'catholic' && 'Catholique'}
                        {church.type === 'protestant' && 'Protestante'}
                        {church.type === 'orthodox' && 'Orthodoxe'}
                        {church.type === 'other' && 'Autre'}
                    </span>
                </div>
            </div>
            <div className="church-actions">
                <button className="action-btn edit-btn">
                    <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="action-btn delete-btn">
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </div>
        </div>
    );
};

const AddChurchModal = ({ newChurch, handleInputChange, handleSubmit, handleCloseModal }) => {
    return (
        <div className="modalFiangonana">
            <div className="modalFiangonana-content">
                <div className="modalFiangonana-header">
                    <h2>Ajouter une église</h2>
                    <button className="close-btn" onClick={handleCloseModal}>&times;</button>
                </div>
                <div className="modalFiangonana-body">
                    <form id="churchForm">
                        <div className="formFiangonana-group">
                            <label htmlFor="churchName">Nom de l'église *</label>
                            <input
                                type="text"
                                id="churchName"
                                name="name"
                                value={newChurch.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="formFiangonana-group">
                            <label htmlFor="churchAddress">Adresse *</label>
                            <input
                                type="text"
                                id="churchAddress"
                                name="address"
                                value={newChurch.address}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="formFiangonana-group">
                            <label htmlFor="churchPhone">Téléphone *</label>
                            <input
                                type="tel"
                                id="churchPhone"
                                name="phone"
                                value={newChurch.phone}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="formFiangonana-group">
                            <label htmlFor="churchEmail">Email *</label>
                            <input
                                type="email"
                                id="churchEmail"
                                name="email"
                                value={newChurch.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="formFiangonana-group">
                            <label htmlFor="churchAdmin">Nom de l'administrateur *</label>
                            <input
                                type="text"
                                id="churchAdmin"
                                name="admin"
                                value={newChurch.admin}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="formFiangonana-group">
                            <label htmlFor="churchPhoto">URL de la photo</label>
                            <input
                                type="url"
                                id="churchPhoto"
                                name="photo"
                                value={newChurch.photo}
                                onChange={handleInputChange}
                                placeholder="https://..."
                            />
                        </div>
                        <div className="formFiangonana-group">
                            <label htmlFor="churchDescription">Description</label>
                            <textarea
                                id="churchDescription"
                                name="description"
                                value={newChurch.description}
                                onChange={handleInputChange}
                                rows="3"
                            ></textarea>
                        </div>
                        <div className="formFiangonana-group">
                            <label htmlFor="churchType">Type d'église *</label>
                            <select
                                id="churchType"
                                name="type"
                                value={newChurch.type}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="catholic">Catholique</option>
                                <option value="protestant">Protestante</option>
                                <option value="orthodox">Orthodoxe</option>
                                <option value="other">Autre</option>
                            </select>
                        </div>
                    </form>
                </div>
                <div className="modalFiangonana-footer">
                    <button className="cancel-btn" onClick={handleCloseModal}>Annuler</button>
                    <button className="submit-btn" onClick={handleSubmit}>Enregistrer</button>
                </div>
            </div>
        </div>
    );
};

export default Fiangonana;