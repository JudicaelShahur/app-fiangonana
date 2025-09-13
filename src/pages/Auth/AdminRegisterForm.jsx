import { Link } from "react-router-dom";

const AdminRegisterForm = ({
  formulaireAdmin,
  afficherMotDePasseAdmin,
  afficherConfirmationMotDePasseAdmin,
  setAfficherMotDePasseAdmin,
  setAfficherConfirmationMotDePasseAdmin,
  gérerChangementAdmin,
  vérifierSoliditéMotDePasse,
  gérerSoumission,
}) => {
  return (
    <div className="form-switch active" id="admin-form">

        <div className="formAdmin-group">
          <label>Nom d'utilisateur</label>
          <div className="input-icon-container">
          <input
            type="text"
            name="nomUtilisateur"
            value={formulaireAdmin.nomUtilisateur}
            onChange={gérerChangementAdmin}
            placeholder="Nom d'utilisateur admin"
            required
          />
            <i className="fas fa-user inputAdmin-icon"></i>
          </div>
        </div>

        {/* Mot de passe */}
        <div className="formAdmin-row">
          <div className="formAdmin-group">
            <label>Mot de passe</label>
            <div className="input-icon-container has-right-icon">
              <input
                type={afficherMotDePasseAdmin ? "text" : "password"}
                name="motDePasse"
                value={formulaireAdmin.motDePasse}
                onChange={gérerChangementAdmin}
                placeholder="Mot de passe"
                required
              />
              <i className="fas fa-lock inputAdmin-icon"></i>
              <span onClick={() => setAfficherMotDePasseAdmin(!afficherMotDePasseAdmin)} className="password-toggle">
                <i className={`fas ${afficherMotDePasseAdmin ? "fa-eye-slash" : "fa-eye"}`}></i>
              </span>
            </div>
            <div className="passwordAdmin-strength">
              <div
                className="passwordAdmin-strength-bar"
                style={{
                  width: `${vérifierSoliditéMotDePasse(formulaireAdmin.motDePasse)}%`,
                  backgroundColor:
                    vérifierSoliditéMotDePasse(formulaireAdmin.motDePasse) < 40
                      ? "#ff4d4d"
                      : vérifierSoliditéMotDePasse(formulaireAdmin.motDePasse) < 80
                        ? "#ffa64d"
                        : "#2ecc71",
                }}
              ></div>
            </div>
          </div>

          {/* Confirmation */}
          <div className="formAdmin-group">
            <label>Confirmer le mot de passe</label>
            <div className="input-icon-container has-right-icon">
              <input
                type={afficherConfirmationMotDePasseAdmin ? "text" : "password"}
                name="confirmerMotDePasse"
                value={formulaireAdmin.confirmerMotDePasse}
                onChange={gérerChangementAdmin}
                placeholder="Confirmer mot de passe"
                required
              />
              <i className="fas fa-lock inputAdmin-icon"></i>
              <span onClick={() => setAfficherConfirmationMotDePasseAdmin(!afficherConfirmationMotDePasseAdmin)} className="password-toggle">
                <i className={`fas ${afficherConfirmationMotDePasseAdmin ? "fa-eye-slash" : "fa-eye"}`}></i>
              </span>
            </div>
            <div
              style={{
                height: "5px",
                marginTop: "8px",
                backgroundColor: formulaireAdmin.confirmerMotDePasse
                  ? formulaireAdmin.motDePasse === formulaireAdmin.confirmerMotDePasse
                    ? "#2ecc71"
                    : "#ff4d4d"
                  : "#eee",
              }}
            ></div>
          </div>
        </div>

      <div className="formAdmin-group">
        
        <label>Rôle</label>
        <div className="input-icon-container">
          <input type="text" value={formulaireAdmin.rôle} readOnly />
          <i className="fas fa-user-tag inputAdmin-icon"></i>
        </div>
      </div>

        <button type="submit" className="btnAdmin">S'inscrire</button>
    </div>
  );
};

export default AdminRegisterForm;
