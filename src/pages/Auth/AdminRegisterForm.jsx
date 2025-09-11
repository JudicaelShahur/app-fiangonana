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
    <div id="admin-form" className="login-form active">
      <form onSubmit={gérerSoumission}>
        {/* Nom d'utilisateur */}
        <div className="formUser-group">
          <label htmlFor="admin-username">Nom d'utilisateur</label>
          <input
            type="text"
            id="admin-username"
            name="nomUtilisateur"
            placeholder="Entrez votre nom d'utilisateur admin"
            value={formulaireAdmin.nomUtilisateur}
            onChange={gérerChangementAdmin}
            required
          />
          <i className="fas fa-user input-icon"></i>
        </div>

        {/* Mot de passe & Confirmation */}
        <div className="form-row">
          {/* Mot de passe */}
          <div className="formUser-group">
            <label htmlFor="admin-password">Mot de passe</label>
            <div className="password-input-container">
              <input
                type={afficherMotDePasseAdmin ? "text" : "password"}
                id="admin-password"
                name="motDePasse"
                placeholder="Entrez votre mot de passe"
                value={formulaireAdmin.motDePasse}
                onChange={gérerChangementAdmin}
                required
              />
              <i className="fas fa-lock input-icon"></i>
              <span
                className="password-toggle"
                onClick={() => setAfficherMotDePasseAdmin(!afficherMotDePasseAdmin)}
              >
                <i
                  className={`fas ${
                    afficherMotDePasseAdmin ? "fa-eye-slash" : "fa-eye"
                  }`}
                ></i>
              </span>
            </div>
            <div className="password-strength">
              <div
                className="password-strength-bar"
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

          {/* Confirmation du mot de passe */}
          <div className="formUser-group">
            <label htmlFor="admin-confirm-password">Confirmer le mot de passe</label>
            <div className="password-input-container">
              <input
                type={afficherConfirmationMotDePasseAdmin ? "text" : "password"}
                id="admin-confirm-password"
                name="confirmerMotDePasse"
                placeholder="Confirmez votre mot de passe"
                value={formulaireAdmin.confirmerMotDePasse}
                onChange={gérerChangementAdmin}
                required
              />
              <i className="fas fa-lock input-icon"></i>
              <span
                className="password-toggle"
                onClick={() =>
                  setAfficherConfirmationMotDePasseAdmin(!afficherConfirmationMotDePasseAdmin)
                }
              >
                <i
                  className={`fas ${
                    afficherConfirmationMotDePasseAdmin ? "fa-eye-slash" : "fa-eye"
                  }`}
                ></i>
              </span>
            </div>
            <div
              id="admin-password-match"
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

        {/* Rôle */}
        <div className="formUser-group">
          <label htmlFor="admin-role">Rôle</label>
          <input type="text" id="admin-role" value={formulaireAdmin.rôle} readOnly />
          <i className="fas fa-user-tag input-icon"></i>
        </div>

        <button type="submit" className="btn">
          S'inscrire
        </button>
        <div className="form-footer">
          <p>
            Déjà un compte ? <Link to="/login">Connectez-vous ici</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default AdminRegisterForm;
