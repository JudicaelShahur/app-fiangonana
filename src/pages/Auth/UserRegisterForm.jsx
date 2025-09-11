import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getFiangonanas } from "../../services/fiangonanaService";

const UserRegisterForm = ({
  formulaireUtilisateur,
  afficherMotDePasseUtilisateur,
  afficherConfirmationMotDePasseUtilisateur,
  setAfficherMotDePasseUtilisateur,
  setAfficherConfirmationMotDePasseUtilisateur,
  gérerChangementUtilisateur,
  vérifierSoliditéMotDePasse,
  gérerSoumission,
}) => {
  const [fiangonanas, setFiangonanas] = useState([]);
  const [filteredFiangonanas, setFilteredFiangonanas] = useState([]);
  const [searchChurch, setSearchChurch] = useState("");

  useEffect(() => {
    const fetchFiangonanas = async () => {
      try {
        const fiangos = await getFiangonanas();
        setFiangonanas(fiangos);
        setFilteredFiangonanas(fiangos); // default rehetra
      } catch (err) {
        console.error("Erreur lors du chargement des fiangonanas:", err);
      }
    };
    fetchFiangonanas();
  }, []);

  const handleSearchChurch = (e) => {
    const value = e.target.value;
    setSearchChurch(value);
    const filtered = fiangonanas.filter(f =>
      f.fiang_nom.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredFiangonanas(filtered);
    gérerChangementUtilisateur({ target: { name: "église", value: "" } }); // clear value
  };

  return (
    <div id="user-form" className="login-form active">
      <form onSubmit={gérerSoumission}>
        {/* Nom d'utilisateur */}
        <div className="formUser-group">
          <label htmlFor="user-username">Nom d'utilisateur</label>
          <input
            type="text"
            id="user-username"
            name="nomUtilisateur"
            placeholder="Entrez votre nom d'utilisateur"
            value={formulaireUtilisateur.nomUtilisateur}
            onChange={gérerChangementUtilisateur}
            required
          />
          <i className="fas fa-user input-icon"></i>
        </div>

        {/* Mot de passe & Confirmation */}
        <div className="form-row">
          {/* Mot de passe */}
          <div className="formUser-group">
            <label htmlFor="user-password">Mot de passe</label>
            <div className="password-input-container">
              <input
                type={afficherMotDePasseUtilisateur ? "text" : "password"}
                id="user-password"
                name="motDePasse"
                placeholder="Entrez votre mot de passe"
                value={formulaireUtilisateur.motDePasse}
                onChange={gérerChangementUtilisateur}
                required
              />
              <i className="fas fa-lock input-icon"></i>
              <span
                className="password-toggle"
                onClick={() =>
                  setAfficherMotDePasseUtilisateur(!afficherMotDePasseUtilisateur)
                }
              >
                <i className={`fas ${afficherMotDePasseUtilisateur ? "fa-eye-slash" : "fa-eye"}`}></i>
              </span>
            </div>
            <div className="password-strength">
              <div
                className="password-strength-bar"
                style={{
                  width: `${vérifierSoliditéMotDePasse(formulaireUtilisateur.motDePasse)}%`,
                  backgroundColor:
                    vérifierSoliditéMotDePasse(formulaireUtilisateur.motDePasse) < 40
                      ? "#ff4d4d"
                      : vérifierSoliditéMotDePasse(formulaireUtilisateur.motDePasse) < 80
                        ? "#ffa64d"
                        : "#2ecc71",
                }}
              ></div>
            </div>
          </div>

          {/* Confirmation du mot de passe */}
          <div className="formUser-group">
            <label htmlFor="user-confirm-password">Confirmer le mot de passe</label>
            <div className="password-input-container">
              <input
                type={afficherConfirmationMotDePasseUtilisateur ? "text" : "password"}
                id="user-confirm-password"
                name="confirmerMotDePasse"
                placeholder="Confirmez votre mot de passe"
                value={formulaireUtilisateur.confirmerMotDePasse}
                onChange={gérerChangementUtilisateur}
                required
              />
              <i className="fas fa-lock input-icon"></i>
              <span
                className="password-toggle"
                onClick={() =>
                  setAfficherConfirmationMotDePasseUtilisateur(
                    !afficherConfirmationMotDePasseUtilisateur
                  )
                }
              >
                <i className={`fas ${afficherConfirmationMotDePasseUtilisateur ? "fa-eye-slash" : "fa-eye"}`}></i>
              </span>
            </div>
            <div
              id="user-password-match"
              style={{
                height: "5px",
                marginTop: "8px",
                backgroundColor: formulaireUtilisateur.confirmerMotDePasse
                  ? formulaireUtilisateur.motDePasse === formulaireUtilisateur.confirmerMotDePasse
                    ? "#2ecc71"
                    : "#ff4d4d"
                  : "#eee",
              }}
            ></div>
          </div>
        </div>

        {/* Rôle & Église */}
        <div className="form-row">
          <div className="formUser-group">
            <label htmlFor="user-role">Rôle</label>
            <div className="select-wrapper">
              <select
                id="user-role"
                name="rôle"
                value={formulaireUtilisateur.rôle}
                onChange={gérerChangementUtilisateur}
                required
              >
                <option value="">Sélectionnez votre rôle</option>
                <option value="katekiste">Katekiste</option>
                <option value="diacre">Diacre</option>
                <option value="membre">Membre</option>
                <option value="déconne">Déconne</option>
              </select>
            </div>
            <i className="fas fa-user-tag input-icon"></i>
          </div>

          {/* Église avec autocomplete */}
          <div className="formUser-group">
            <label htmlFor="user-church">Cherche Église</label>
            <div className="select-wrapper" style={{ position: "relative" }}>
              <input
                type="text"
                id="user-church"
                placeholder="Tapez pour rechercher votre église"
                value={searchChurch}
                onChange={handleSearchChurch}
                autoComplete="off"
                required
              />
              <i className="fas fa-church input-icon"></i>

              {searchChurch && filteredFiangonanas.length > 0 && (
                <ul style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  maxHeight: "200px",
                  overflowY: "auto",
                  background: "white",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  zIndex: 10,
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                }}>
                  {filteredFiangonanas.map(f => (
                    <li
                      key={f.id}
                      onClick={() => {
                        setSearchChurch(f.fiang_nom);
                        gérerChangementUtilisateur({ target: { name: "église", value: f.id } });
                        setFilteredFiangonanas([]);
                      }}
                      style={{
                        padding: "10px",
                        cursor: "pointer",
                        borderBottom: "1px solid #eee"
                      }}
                    >
                      {f.fiang_nom}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

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

export default UserRegisterForm;
