import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaMoneyBillWave, FaSearch, FaPlus, FaEdit, FaTrash, FaCalendarAlt } from 'react-icons/fa';
import "../../styles/Fahatongavana.css";

const Fahatongavana = () => {
    const [presences, setPresences] = useState([]);
    const [filteredPresences, setFilteredPresences] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentPresence, setCurrentPresence] = useState(null);
    const [formData, setFormData] = useState({
        mpino_id: '',
        date: selectedDate,
        is_present: false,
        has_paid: false,
        amount: 0
    });

    // Charger les données factices
    useEffect(() => {
        const loadPresenceData = () => {
            const mockData = [
                {
                    id: 1,
                    nom: 'Rakoto',
                    prenom: 'Jean',
                    status_presence: 'Présent',
                    status_payment: 'Payé',
                    kartie: 'Karite A',
                    finagonana: 'FJKM Antanimena',
                    date: '2023-10-15',
                    mpino_id: 'MP001',
                    amount: 5000
                },
                {
                    id: 2,
                    nom: 'Rasoa',
                    prenom: 'Marie',
                    status_presence: 'Absent',
                    status_payment: 'Non payé',
                    kartie: 'Karite B',
                    finagonana: 'FJKM Analakely',
                    date: '2023-10-15',
                    mpino_id: 'MP002',
                    amount: 0
                },
                {
                    id: 3,
                    nom: 'Randria',
                    prenom: 'Paul',
                    status_presence: 'Présent',
                    status_payment: 'Payé',
                    kartie: 'Karite A',
                    finagonana: 'FJKM Antanimena',
                    date: '2023-10-15',
                    mpino_id: 'MP003',
                    amount: 5000
                },
                {
                    id: 4,
                    nom: 'Ravao',
                    prenom: 'Julie',
                    status_presence: 'Présent',
                    status_payment: 'Non payé',
                    kartie: 'Karite C',
                    finagonana: 'FJKM Andoharanofotsy',
                    date: '2023-10-15',
                    mpino_id: 'MP004',
                    amount: 0
                }
            ];
            setPresences(mockData);
            setFilteredPresences(mockData);
        };

        loadPresenceData();
    }, []);

    // Filtrer les présences selon la recherche et la date
    useEffect(() => {
        const filtered = presences.filter(presence =>
            (presence.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                presence.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                presence.kartie.toLowerCase().includes(searchTerm.toLowerCase())) &&
            presence.date === selectedDate
        );
        setFilteredPresences(filtered);
    }, [searchTerm, selectedDate, presences]);

    // Ouvrir le modal pour ajouter une nouvelle présence
    const openAddModal = () => {
        setCurrentPresence(null);
        setFormData({
            mpino_id: '',
            date: selectedDate,
            is_present: false,
            has_paid: false,
            amount: 0
        });
        setIsModalOpen(true);
    };

    // Ouvrir le modal pour modifier une présence
    const openEditModal = (presence) => {
        setCurrentPresence(presence);
        setFormData({
            mpino_id: presence.mpino_id,
            date: presence.date,
            is_present: presence.status_presence === 'Présent',
            has_paid: presence.status_payment === 'Payé',
            amount: presence.amount || 0
        });
        setIsModalOpen(true);
    };

    // Ouvrir le modal de confirmation de suppression
    const openDeleteModal = (presence) => {
        setCurrentPresence(presence);
        setIsDeleteModalOpen(true);
    };

    // Fermer tous les modals
    const closeModals = () => {
        setIsModalOpen(false);
        setIsDeleteModalOpen(false);
        setCurrentPresence(null);
    };

    // Gérer les changements dans le formulaire
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Soumettre le formulaire (ajout ou modification)
    const handleSubmit = (e) => {
        e.preventDefault();

        if (currentPresence) {
            // Modifier la présence existante
            setPresences(prev => prev.map(presence =>
                presence.id === currentPresence.id
                    ? {
                        ...presence,
                        status_presence: formData.is_present ? 'Présent' : 'Absent',
                        status_payment: formData.has_paid ? 'Payé' : 'Non payé',
                        amount: formData.has_paid ? parseInt(formData.amount) : 0
                    }
                    : presence
            ));
        } else {
            // Ajouter une nouvelle présence
            const newPresence = {
                id: presences.length + 1,
                nom: 'Nouveau',
                prenom: 'Mpino',
                status_presence: formData.is_present ? 'Présent' : 'Absent',
                status_payment: formData.has_paid ? 'Payé' : 'Non payé',
                kartie: 'Karite X',
                finagonana: 'FJKM',
                date: formData.date,
                mpino_id: formData.mpino_id || `MP${Math.floor(100 + Math.random() * 900)}`,
                amount: formData.has_paid ? parseInt(formData.amount) : 0
            };
            setPresences(prev => [...prev, newPresence]);
        }

        closeModals();
    };

    // Supprimer une présence
    const handleDelete = () => {
        setPresences(prev => prev.filter(presence => presence.id !== currentPresence.id));
        closeModals();
    };

    // Statistiques
    const totalPresent = filteredPresences.filter(p => p.status_presence === 'Présent').length;
    const totalPaid = filteredPresences.filter(p => p.status_payment === 'Payé').length;
    const totalAmount = filteredPresences.reduce((sum, p) => sum + (p.amount || 0), 0);

    return (
        <div className="fahatongavana-management">
            <div className="pageFahatongavana-header">
                <h1>Gestion des Fahatongavana</h1>
                <button className="btnMpino btn-primary" onClick={openAddModal}>
                    <FaPlus /> Nouvelle Présence
                </button>
            </div>

                <div className="searchFahatongavana-bar">
                    <div className="searchFahatongavana-input">
                        <FaSearch />
                        <input
                            type="text"
                            placeholder="Rechercher par nom, prénom ou kartie..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>     
                <div className="date-filter">
                    <label>
                        <FaCalendarAlt /> Date:
                    </label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </div>
            </div>
            

            <div className="stats-cards">
                <div className="stat-card">
                    <div className="stat-value">{filteredPresences.length}</div>
                    <div className="stat-label">Total Mpino</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{totalPresent}</div>
                    <div className="stat-label">Présents</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{totalPaid}</div>
                    <div className="stat-label">Ont payé</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{totalAmount.toLocaleString()} Ar</div>
                    <div className="stat-label">Total collecté</div>
                </div>
            </div>
        
            {filteredPresences.length > 0 ? (
                <div className="table-responsive">
                <table className="fahatongavana-table">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Prénom</th>
                            <th>Présence</th>
                            <th>Paiement</th>
                            <th>Montant</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPresences.map((p) => (
                            <tr key={p.id}>
                                <td>{p.nom}</td>
                                <td>{p.prenom}</td>
                                <td>
                                    <span className={`status-badge ${p.status_presence === 'Présent' ? 'present' : 'absent'}`}>
                                        {p.status_presence}
                                    </span>
                                </td>
                                <td>
                                    <span className={`status-badge ${p.status_payment === 'Payé' ? 'paid' : 'not-paid'}`}>
                                        {p.status_payment}
                                    </span>
                                </td>
                                <td>{p.amount.toLocaleString()} Ar</td>
                                <td className="action-buttons">
                                    <button className="btn-icon" onClick={() => openEditModal(p)}><FaEdit /></button>
                                    <button className="btn-icon btn-danger" onClick={() => openDeleteModal(p)}><FaTrash /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    </table>
                    </div>
            ) : (
                <div className="empty-state">Aucun mpino trouvé pour cette date.</div>
            )}


            {/* Modal d'ajout/modification */}
            {isModalOpen && (
                <div className="modalFahatongavana-overlay">
                    <div className="modalFahatongavana">
                        <div className="modalFahatongavana-header">
                            <h2>{currentPresence ? 'Modifier la Présence' : 'Enregistrer une Présence'}</h2>
                            <button className="modalFahatongavana-close" onClick={closeModals}>×</button>
                        </div>

                        <form onSubmit={handleSubmit} className="modalFahatongavana-form">
                            <div className="formFahatongavana-group">
                                <label>ID Mpino *</label>
                                <input
                                    type="text"
                                    name="mpino_id"
                                    value={formData.mpino_id}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="MP001"
                                />
                            </div>

                            <div className="formFahatongavana-group">
                                <label>Date *</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="formFahatongavana-group checkbox-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="is_present"
                                        checked={formData.is_present}
                                        onChange={handleInputChange}
                                    />
                                    Présent
                                </label>
                            </div>

                            <div className="formFahatongavana-group checkbox-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="has_paid"
                                        checked={formData.has_paid}
                                        onChange={handleInputChange}
                                    />
                                    A payé
                                </label>
                            </div>

                            {formData.has_paid && (
                                <div className="formFahatongavana-group">
                                    <label>Montant (Ar) *</label>
                                    <input
                                        type="number"
                                        name="amount"
                                        value={formData.amount}
                                        onChange={handleInputChange}
                                        required={formData.has_paid}
                                        min="0"
                                    />
                                </div>
                            )}

                            <div className="modalFahatongavana-actions">
                                <button type="button" onClick={closeModals}>Annuler</button>
                                <button type="submit">{currentPresence ? 'Modifier' : 'Enregistrer'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de confirmation de suppression */}
            {isDeleteModalOpen && currentPresence && (
                <div className="modalFahatongavana-overlay">
                    <div className="modalFahatongavana confirm-modal">
                        <div className="modalFahatongavana-header">
                            <h2>Confirmer la suppression</h2>
                            <button className="modalFahatongavana-close" onClick={closeModals}>×</button>
                        </div>

                        <div className="modalFahatongavana-body">
                            <p>Êtes-vous sûr de vouloir supprimer l'enregistrement de présence de <strong>{currentPresence.prenom} {currentPresence.nom}</strong> du {new Date(currentPresence.date).toLocaleDateString()} ?</p>
                        </div>

                        <div className="modalFahatongavana-actions">
                            <button type="button" onClick={closeModals}>Annuler</button>
                            <button type="button" className="btn-danger" onClick={handleDelete}>Supprimer</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Fahatongavana;