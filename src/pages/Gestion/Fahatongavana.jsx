import React from "react";
import { FaPlus, FaSearch, FaCalendarAlt, FaEdit, FaTrash } from "react-icons/fa";
import { useFahatongavana } from "../../hooks/useFahatongavana";
import "../../styles/Fahatongavana.css";
import ConfirmDeleteModal from "../../utils/ConfirmDeleteModal";

const Fahatongavana = () => {
    const {
        filteredPresences,
        searchTerm,
        setSearchTerm,
        selectedDate,
        setSelectedDate,
        loading,
        totals,
        formData,
        handleInputChange,
        handleSubmit,
        handleDelete,
        modal,
        isOpen,
        openModal,
        closeModal,
        searchMpino,
        filteredMpinos,
        selectMpino,
        handleSearchMpino,
        nextPage,
        prevPage,
        getPagesArray,
        currentPage,
        totalPages,
        totalPresent,
        totalPaid,
        totalAmount,
    } = useFahatongavana();

    return (
        <div className="fahatongavana-management">
            {/* Header */}
            <div className="pageFahatongavana-header">
                <h1>Gestion des Fahatongavana</h1>
                <button className="btnMpino btn-primary" onClick={() => openModal("add")}>
                    <FaPlus /> Nouvelle Présence
                </button>
            </div>

            {/* Barre de recherche et filtre date */}
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

            {/* Stats */}
            <div className="stats-cards">
                <div className="stat-card">
                    <div className="stat-value">
                        {totals.reduce((acc, f) => acc + f.mpinos_count, 0)}
                    </div>
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

            {/* Table Présences */}
            {loading ? (
                <div className="loader"></div>
            ) : filteredPresences.length > 0 ? (
                <div className="table-responsive">
                    <table className="fahatongavana-table">
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Prénom</th>
                                <th>Adresse</th>
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
                                    <td>{p.adresse}</td>
                                    <td>
                                        <span className={`status-badge ${p.status_presence === "Présent" ? "present" : "absent"}`}>
                                            {p.status_presence}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${p.status_payment === "Payé" ? "paid" : "not-paid"}`}>
                                            {p.status_payment}
                                        </span>
                                    </td>
                                    <td>{p.amount.toLocaleString()} Ar</td>
                                    <td className="action-buttons">
                                        {/* <button className="btn-icon" onClick={() => openModal("edit", p)}>
                                            <FaEdit />
                                        </button> */}
                                        <button className="btn-icon btn-danger" onClick={() => openModal("delete", p)}>
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="pagination">
                        <button onClick={prevPage} disabled={currentPage <= 1}>Précédent</button>
                        {getPagesArray().map(p => (
                            <button
                                key={p}
                                className={p === currentPage ? "active" : ""}
                                onClick={() => nextPage(p)}
                            >
                                {p}
                            </button>
                        ))}
                        <button onClick={nextPage} disabled={currentPage >= totalPages}>Suivant</button>
                    </div>
                </div>
            ) : (
                <div className="empty-state">Aucun mpino trouvé pour cette date.</div>
            )}

            {/* Modal Ajouter / Modifier */}
            {(isOpen("add") || isOpen("edit")) && (
                <div className="modalFahatongavana-overlay">
                    <div className="modalFahatongavana">
                        <div className="modalFahatongavana-header">
                            <h2>{modal.type === "edit" ? "Modifier la Présence" : "Enregistrer une Présence"}</h2>
                            <button className="modalFahatongavana-close" onClick={closeModal}>×</button>
                        </div>
                        <form className="modalFahatongavana-form" onSubmit={handleSubmit}>
                            <div className="formFahatongavana-group">
                                <label>ID Mpino *</label>
                                <input
                                    type="text"
                                    name="mpino_id"
                                    value={searchMpino}
                                    onChange={handleSearchMpino}
                                    required
                                    placeholder="F.L.M"
                                />
                                {filteredMpinos.length > 0 && (
                                    <ul className="autocomplete-list">
                                        {filteredMpinos.map(m => (
                                            <li key={m.id_unique} onClick={() => selectMpino(m)}>
                                                {m.id_unique} - {m.nom} {m.prenom}
                                            </li>
                                        ))}
                                    </ul>
                                )}
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
                                        required
                                        min="0"
                                    />
                                </div>
                            )}

                            <div className="modalFahatongavana-actions">
                                <button type="button" onClick={closeModal}>Annuler</button>
                                <button type="submit">{modal.type === "edit" ? "Modifier" : "Enregistrer"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Delete */}
            {isOpen("delete") && modal.data && (
                <ConfirmDeleteModal
                    isOpen={true}
                    onClose={closeModal}
                    onConfirm={() => handleDelete(modal.data.id)}
                    message={`Êtes-vous sûr de vouloir supprimer la présence de "${modal.data.nom}" ?`}
                />
            )}
        </div>
    );
};

export default Fahatongavana;
