import React, { useState } from "react";
import ReactDOM from "react-dom";
import "../styles/ConfirmModal.css"; // tu mets ton CSS ici

function ConfirmLogoutModal({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Confirmation</h2>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onCancel}>
            Annuler
          </button>
          <button className="btn-logout" onClick={onConfirm}>
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}

// Hook utilitaire pour afficher la modale n'importe où
export function confirm(message) {
  return new Promise((resolve) => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const handleConfirm = () => {
      cleanup();
      resolve(true);
    };

    const handleCancel = () => {
      cleanup();
      resolve(false);
    };

    const cleanup = () => {
      ReactDOM.unmountComponentAtNode(container);
      document.body.removeChild(container);
    };

    ReactDOM.render(
      <ConfirmLogoutModal
        message={message}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />,
      container
    );
  });
}
