import React, { useState } from "react";

const Parametres = () => {
  const [tab, setTab] = useState("generaux");

  return (
    <div className="page-container">
      <h2>Paramètres</h2>
      <div className="tabs">
        <button onClick={() => setTab("generaux")}>Généraux</button>
        <button onClick={() => setTab("profil")}>Mon profil</button>
        <button onClick={() => setTab("notifications")}>Notifications</button>
        <button onClick={() => setTab("finances")}>Finances</button>
      </div>

      {tab === "generaux" && (
        <form className="form-section">
          <label>Nom système : <input type="text" /></label>
          <label>Logo : <input type="file" /></label>
          <label>Couleur principale : <input type="color" /></label>
          <button type="submit">Enregistrer</button>
        </form>
      )}

      {tab === "profil" && (
        <form className="form-section">
          <label>Changer mot de passe :
            <input type="password" placeholder="Nouveau mot de passe" />
          </label>
          <button type="submit">Mettre à jour</button>
        </form>
      )}

      {tab === "notifications" && (
        <form className="form-section">
          <label>
            <input type="checkbox" /> Email
          </label>
          <label>
            <input type="checkbox" /> SMS
          </label>
          <button type="submit">Enregistrer</button>
        </form>
      )}

      {tab === "finances" && (
        <form className="form-section">
          <label>Devise :
            <select>
              <option>Ar</option>
              <option>€</option>
              <option>$</option>
            </select>
          </label>
          <button type="submit">Sauvegarder</button>
        </form>
      )}
    </div>
  );
};

export default Parametres;
