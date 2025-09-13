import { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../styles/SampanaManags.css";

const SampanaManags = () => {
    const [manags, setManags] = useState([
        { id: 1, sampana_id: "S001", mpino_id: "MP001" },
        { id: 2, sampana_id: "S002", mpino_id: "MP002" },
    ]);
    const [showModal, setShowModal] = useState(false);
    const [newManag, setNewManag] = useState({ sampana_id: "", mpino_id: "" });
    const [search, setSearch] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewManag({ ...newManag, [name]: value });
    };

    const handleAddManag = () => {
        if (!newManag.sampana_id || !newManag.mpino_id) return;
        setManags([...manags, { id: manags.length + 1, ...newManag }]);
        setNewManag({ sampana_id: "", mpino_id: "" });
        setShowModal(false);
    };

    const handleDelete = (id) => {
        setManags(manags.filter((m) => m.id !== id));
    };

    const filteredManags = manags.filter(
        (m) =>
            m.sampana_id.toLowerCase().includes(search.toLowerCase()) ||
            m.mpino_id.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="sampan-manags-container">
            {/* Header */}
            <div className="sampan-manags-header">
                <h1>Gestion des Sampan Manags</h1>
                <button className="add-btn-sampan-manags" onClick={() => setShowModal(true)}>
                    <i className="fas fa-plus"></i> Ajouter
                </button>
            </div>

            {/* Search */}
            <div className="search-sampan-manags-bar">
                <div className="search-sampan-manags-input">
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <i className="fas fa-search search-sampan-manags-icon"></i>
                </div>
            </div>

            {/* Table */}
            <div className="table-sampan-manags-container">
                {filteredManags.length > 0 ? (
                    <table className="sampan-manags-table">
                        <thead>
                            <tr>
                                <th>ID Sampana</th>
                                <th>ID Mpitondra</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredManags.map((manag) => (
                                <tr key={manag.id}>
                                    <td data-label="ID Sampana">{manag.sampana_id}</td>
                                    <td data-label="ID Mpitondra">{manag.mpino_id}</td>
                                    <td data-label="Actions" className="action-btn-sampan-manags">
                                        <button
                                            className="btn-sampan-manags"
                                            onClick={() => alert("Éditer")}
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            className="btn-sampan-manags btn-danger"
                                            onClick={() => handleDelete(manag.id)}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="no-results-sampan-manags">Aucun manag trouvé</p>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-sampan-manags-overlay">
                    <div className="modal-sampan-manags-content">
                        <div className="modal-sampan-manags-header">
                            <h2>Ajouter un Sampan Manag</h2>
                            <button
                                className="close-btn-sampan-manags"
                                onClick={() => setShowModal(false)}
                            >
                                &times;
                            </button>
                        </div>
                        <div className="modal-sampan-manags-body">
                            <div className="form-sampan-manags-group">
                                <label>ID Sampana</label>
                                <input
                                    type="text"
                                    name="sampana_id"
                                    value={newManag.sampana_id}
                                    onChange={handleInputChange}
                                    placeholder="ID Sampana"
                                />
                            </div>
                            <div className="form-sampan-manags-group">
                                <label>ID Mpitondra</label>
                                <input
                                    type="text"
                                    name="mpino_id"
                                    value={newManag.mpino_id}
                                    onChange={handleInputChange}
                                    placeholder="ID Mpitondra"
                                />
                            </div>
                        </div>
                        <div className="modal-sampan-manags-footer">
                            <button
                                className="cancel-sampan-manags-btn"
                                onClick={() => setShowModal(false)}
                            >
                                Annuler
                            </button>
                            <button className="save-sampan-manags-btn" onClick={handleAddManag}>
                                Enregistrer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SampanaManags;
