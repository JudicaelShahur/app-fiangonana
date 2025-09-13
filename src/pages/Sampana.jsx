import { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./../styles/Sampana.css";

const Sampana = () => {
    const [sampanas, setSampanas] = useState([
        { id: 1, nom_samp: "Sampana Tanora", desc_samp: "Regroupe les jeunes" },
        { id: 2, nom_samp: "Sampana Vehivavy", desc_samp: "Association des femmes" },
    ]);

    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [newSampana, setNewSampana] = useState({ nom_samp: "", desc_samp: "" });
    const [searchTerm, setSearchTerm] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewSampana({ ...newSampana, [name]: value });
    };

    const handleOpenModal = (samp = null) => {
        if (samp) {
            setNewSampana(samp);
            setEditingId(samp.id);
        } else {
            setNewSampana({ nom_samp: "", desc_samp: "" });
            setEditingId(null);
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setNewSampana({ nom_samp: "", desc_samp: "" });
        setEditingId(null);
    };

    const handleSubmit = () => {
        if (!newSampana.nom_samp || !newSampana.desc_samp) return;

        if (editingId) {
            // 🔄 Modification
            setSampanas(
                sampanas.map((s) =>
                    s.id === editingId ? { ...newSampana, id: editingId } : s
                )
            );
            alert("Sampana modifié avec succès !");
        } else {
            // ➕ Ajout
            setSampanas([...sampanas, { ...newSampana, id: sampanas.length + 1 }]);
            alert("Sampana ajouté avec succès !");
        }

        handleCloseModal();
    };

    const handleDelete = (id) => {
        if (window.confirm("Voulez-vous vraiment supprimer ce sampana ?")) {
            setSampanas(sampanas.filter((s) => s.id !== id));
        }
    };

    const filteredSampanas = sampanas.filter(
        (s) =>
            s.nom_samp.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.desc_samp.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="sampana-container">
            {/* Header */}
            <div className="sampana-header">
                <h1>Gestion des Sampana</h1>
                <button className="add-btn-sampana" onClick={() => handleOpenModal()}>
                    <i className="fas fa-plus"></i> Ajouter un sampana
                </button>
            </div>

            {/* Barre de recherche */}
            <div className="search-mpitondra-bar">
                <div className="search-mpitondra-input">
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="search-mpitondra-icon">
                        <i className="fas fa-search"></i>
                    </span>
                </div>
            </div>

            {/* Table */}
            <div className="table-sampana-container">
                {filteredSampanas.length > 0 ? (
                    <table className="sampana-table">
                        <thead>
                            <tr>
                                <th>Nom Sampana</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSampanas.map((samp) => (
                                <tr key={samp.id}>
                                    <td data-label="Nom">{samp.nom_samp}</td>
                                    <td data-label="Description">{samp.desc_samp}</td>
                                    <td data-label="Actions" className="action-btn-sampana">
                                        <button
                                            className="btn-sampana"
                                            onClick={() => handleOpenModal(samp)}
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            className="btn-sampana btn-danger"
                                            onClick={() => handleDelete(samp.id)}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="no-results-sampana">
                        Aucun résultat trouvé pour "{searchTerm}"
                    </p>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-sampana-overlay">
                    <div className="modal-sampana-content">
                        <div className="modal-sampana-header">
                            <h2>{editingId ? "Modifier un Sampana" : "Ajouter un Sampana"}</h2>
                            <button
                                className="close-btn-sampana"
                                onClick={handleCloseModal}
                            >
                                &times;
                            </button>
                        </div>
                        <div className="modal-sampana-body">
                            <div className="form-sampana-group">
                                <label>Nom Sampana</label>
                                <input
                                    type="text"
                                    name="nom_samp"
                                    value={newSampana.nom_samp}
                                    onChange={handleInputChange}
                                    placeholder="Nom du sampana"
                                />
                            </div>
                            <div className="form-sampana-group">
                                <label>Description</label>
                                <input
                                    type="text"
                                    name="desc_samp"
                                    value={newSampana.desc_samp}
                                    onChange={handleInputChange}
                                    placeholder="Description du sampana"
                                />
                            </div>
                        </div>
                        <div className="modal-sampana-footer">
                            <button
                                className="cancel-sampana-btn"
                                onClick={handleCloseModal}
                            >
                                Annuler
                            </button>
                            <button className="save-sampana-btn" onClick={handleSubmit}>
                                {editingId ? "Modifier" : "Enregistrer"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sampana;
