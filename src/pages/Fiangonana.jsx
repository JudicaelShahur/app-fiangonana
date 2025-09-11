import React, { useState } from 'react';
import "./../styles/Fiangonana.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FaSearch } from 'react-icons/fa';
const Fiangonana = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fiangonanas, setFiangonanas] = useState([
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
    const [fiangonanaTerm, setFiangonanaTerm] = useState('');
    const [newFiangonana, setNewFiangonana] = useState({
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
        setNewFiangonana({
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
        setNewFiangonana({
            ...newFiangonana,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Ajouter la nouvelle église à la liste
        const newFiangonanaWithId = {
            ...newFiangonana,
            id: fiangonanas.length + 1
        };
        setFiangonanas([...fiangonanas, newFiangonanaWithId]);
        handleCloseModal();
        alert('Église ajoutée avec succès!');
    };

    const handleSearch = (e) => {
        setFiangonanaTerm(e.target.value);
    };

    const filtereFiangonana = fiangonanas.filter(fiangonana =>
        fiangonana.name.toLowerCase().includes(fiangonanaTerm.toLowerCase()) ||
        fiangonana.address.toLowerCase().includes(fiangonanaTerm.toLowerCase()) ||
        fiangonana.admin.toLowerCase().includes(fiangonanaTerm.toLowerCase())
    );

    return (
        <div className="fiangonana-management">
                    <div className="headerFiangonana-content">
                        <div>
                            <h1>Liste complète des églises enregistrées</h1>
                        </div>
                        <button className="addFiangonana-btn" onClick={handleOpenModal}>
                            <i className="fas fa-plus"></i> Ajouter une église
                        </button>
                    </div>
              
                <div className="searchFiangonana-bar">
                    <div className="searchFiangonana-input">
                        <FaSearch className="searchFiangonana-icon" />
                        <input
                            type="text"
                            placeholder="Rechercher une église, une adresse ou un administrateur..."
                            value={fiangonanaTerm}
                            onChange={handleSearch}
                        />
                    </div>
                    <button className="filterFiangonana-btn">
                        <i className="fas fa-filter"></i> Filtrer
                    </button>
                </div>

                <div className="fiangonana-list ">
                    {filtereFiangonana.length > 0 ? (
                        filtereFiangonana.map((fiangonana) => (
                            <FiangonanaItem key={fiangonana.id} fiangonana={fiangonana} />
                        ))
                    ) : (
                        <div className="no-result-card">
                            <p>Aucune église trouvée</p>
                        </div>
                    )}
                </div>
            

            {isModalOpen && (
                <AddFiangonanaModal
                    newFiangonana={newFiangonana}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleSubmit}
                    handleCloseModal={handleCloseModal}
                />
            )}
        </div>
    );
};

const FiangonanaItem = ({ fiangonana }) => {
    return (
        <div className="fiangonana-item">
            <div className="fiangonana-image">
                <img src={fiangonana.photo} alt={fiangonana.name} />
            </div>
            <div className="fiangonana-info">
                <h3>{fiangonana.name}</h3>
                <p><i className="fas fa-map-marker-alt"></i> {fiangonana.address}</p>
                <p><i className="fas fa-phone"></i> {fiangonana.phone}</p>
                <p><i className="fas fa-envelope"></i> {fiangonana.email}</p>
                <p><i className="fas fa-user"></i> Admin: {fiangonana.admin}</p>
                <div className="fiangonana-type">
                    <span className={`type-badge ${fiangonana.type}`}>
                        {fiangonana.type === 'catholic' && 'Catholique'}
                        {fiangonana.type === 'protestant' && 'Protestante'}
                        {fiangonana.type === 'orthodox' && 'Orthodoxe'}
                        {fiangonana.type === 'other' && 'Autre'}
                    </span>
                </div>
            </div>
            <div className="fiangonana-actions">
                <button className="actionFiangonana-btn editFiangonana-btn">
                    <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="actionFiangonana-btn deleteFiangonana-btn">
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </div>
        </div>
    );
};

const AddFiangonanaModal = ({ newFiangonana, handleInputChange, handleSubmit, handleCloseModal }) => {
    return (
        <div className="modalFiangonana">
            <div className="modalFiangonana-content">
                <div className="modalFiangonana-header">
                    <h2>Ajouter une église</h2>
                    <button className="close-btn" onClick={handleCloseModal}>&times;</button>
                </div>
                <div className="modalFiangonana-body">
                    <form id="fiangonanaForm">
                        <div className="formFiangonana-group">
                            <label htmlFor="fiangonanaName">Nom de l'église *</label>
                            <input
                                type="text"
                                id="fiangonanaName"
                                name="name"
                                value={newFiangonana.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="formFiangonana-group">
                            <label htmlFor="fiangonanaAddress">Adresse *</label>
                            <input
                                type="text"
                                id="fiangonanaAddress"
                                name="address"
                                value={newFiangonana.address}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="formFiangonana-group">
                            <label htmlFor="fiangonanaPhone">Téléphone *</label>
                            <input
                                type="tel"
                                id="fiangonanaPhone"
                                name="phone"
                                value={newFiangonana.phone}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="formFiangonana-group">
                            <label htmlFor="fiangonanaEmail">Email *</label>
                            <input
                                type="email"
                                id="fiangonanaEmail"
                                name="email"
                                value={newFiangonana.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="formFiangonana-group">
                            <label htmlFor="fiangonanaAdmin">Nom de l'administrateur *</label>
                            <input
                                type="text"
                                id="fiangonanaAdmin"
                                name="admin"
                                value={newFiangonana.admin}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="formFiangonana-group">
                            <label htmlFor="fiangonanaPhoto">URL de la photo</label>
                            <input
                                type="url"
                                id="fiangonanaPhoto"
                                name="photo"
                                value={newFiangonana.photo}
                                onChange={handleInputChange}
                                placeholder="https://..."
                            />
                        </div>
                        <div className="formFiangonana-group">
                            <label htmlFor="fiangonanaDescription">Description</label>
                            <textarea
                                id="fiangonanaDescription"
                                name="description"
                                value={newFiangonana.description}
                                onChange={handleInputChange}
                                rows="3"
                            ></textarea>
                        </div>
                        <div className="formFiangonana-group">
                            <label htmlFor="fiangonanaType">Type d'église *</label>
                            <select
                                id="fiangonanaType"
                                name="type"
                                value={newFiangonana.type}
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