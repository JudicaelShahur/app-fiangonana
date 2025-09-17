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
        setFilteredFiangonanas(fiangos);
      } catch (err) {
        console.error(err);
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
    gérerChangementUtilisateur({ target: { name: "église", value: "" } });
  };

  return (
    <div className="register-formUser active" id="user-form">
        <div className="formUser-group">
        <label>Nom d'utilisateur</label>
        <div className="input-icon-container">
          <input
            type="text"
            name="nomUtilisateur"
            value={formulaireUtilisateur.nomUtilisateur}
            onChange={gérerChangementUtilisateur}
            placeholder="Nom d'utilisateur"
            required
          />
          <i className="fas fa-user inputUser-icon"></i>
        </div>
      </div>

        {/* Mot de passe */}
        <div className="formUser-row">
          <div className="formUser-group">
          <label>Mot de passe</label>
          <div className="input-icon-container has-right-icon">
            <div className="passwordUser-input-container">
              <input
                type={afficherMotDePasseUtilisateur ? "text" : "password"}
                name="motDePasse"
                value={formulaireUtilisateur.motDePasse}
                onChange={gérerChangementUtilisateur}
                placeholder="Mot de passe"
                required
              />
              <i className="fas fa-lock inputUser-icon"></i>
              <span onClick={() => setAfficherMotDePasseUtilisateur(!afficherMotDePasseUtilisateur)} className="password-toggle">
                <i className={`fas ${afficherMotDePasseUtilisateur ? "fa-eye-slash" : "fa-eye"}`}></i>
              </span>
            </div></div>
            <div className="passwordUser-strength">
              <div
                className="passwordUser-strength-bar"
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

          {/* Confirmation */}
          <div className="formUser-group">
            <label>Confirmer le mot de passe</label>
          <div className="input-icon-container has-right-icon">
              <input
                type={afficherConfirmationMotDePasseUtilisateur ? "text" : "password"}
                name="confirmerMotDePasse"
                value={formulaireUtilisateur.confirmerMotDePasse}
                onChange={gérerChangementUtilisateur}
                placeholder="Confirmer mot de passe"
                required
              />
              <i className="fas fa-lock inputUser-icon"></i>
              <span onClick={() => setAfficherConfirmationMotDePasseUtilisateur(!afficherConfirmationMotDePasseUtilisateur)} className="password-toggle">
                <i className={`fas ${afficherConfirmationMotDePasseUtilisateur ? "fa-eye-slash" : "fa-eye"}`}></i>
              </span>
            </div>
            <div
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
        <div className="formUser-row">
          <div className="formUser-group">
          <label>Rôle</label>
          <div className="input-icon-container">
            <select
              name="rôle"
              value={formulaireUtilisateur.rôle}
              onChange={gérerChangementUtilisateur}
              required
            >
              <option value="">Sélectionnez votre rôle</option>
              <option value="katekiste">Katekiste</option>
              <option value="pasteur">pasteur</option>
              <option value="membre">Membre</option>
              <option value="déconne">Déconne</option>
            </select>
            <i className="fas fa-user-tag inputUser-icon"></i>
          </div></div>

          <div className="formUser-group">
            <label>Chercher Église</label>
            <div className="select-wrapper" style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Tapez pour rechercher votre église"
                value={searchChurch}
                onChange={handleSearchChurch}
                autoComplete="off"
                required
              />
              <i className="fas fa-church inputUser-icon"></i>
              {searchChurch && filteredFiangonanas.length > 0 && (
                <ul style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  maxHeight: "200px",
                  overflowY: "auto",
                  background: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  zIndex: 10,
                }}>
                  {filteredFiangonanas.map(f => (
                    <li
                      key={f.id}
                      onClick={() => {
                        setSearchChurch(f.fiang_nom);
                        gérerChangementUtilisateur({ target: { name: "église", value: f.id } });
                        setFilteredFiangonanas([]);
                      }}
                      style={{ padding: "10px", cursor: "pointer", borderBottom: "1px solid #eee" }}
                    >
                      {f.fiang_nom}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <button type="submit" className="btnUser">S'inscrire</button>
    </div>
  );
};

export default UserRegisterForm;
