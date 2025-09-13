import React from "react";
import "./../styles/ConfirmDeleteModal.css";

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Confirmation de suppression</h2>
        <p>{message || "Êtes-vous sûr de vouloir supprimer cet élément ?"}</p>
        <div className="modal-buttons">
          <button className="btn-cancel" onClick={onClose}>Annuler</button>
          <button
            className="btn-delete"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
