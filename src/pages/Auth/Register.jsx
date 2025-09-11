import "@fortawesome/fontawesome-free/css/all.min.css";
import ChurchLogo from "../Shared/ChurchLogo";
import "/src/styles/Auth.css";
import useRegisterForm from "../../hooks/useRegisterForm";
import FormulaireInscriptionAdmin from "./AdminRegisterForm";
import FormulaireInscriptionUtilisateur from "./UserRegisterForm";
import flmlogo from '../../assets/flmLogo.png'
const Register = () => {
  const {
    rôleActif,
    formulaireAdmin,
    formulaireUtilisateur,
    afficherMotDePasseAdmin,
    afficherConfirmationMotDePasseAdmin,
    afficherMotDePasseUtilisateur,
    afficherConfirmationMotDePasseUtilisateur,
    gérerChangementRôle,
    gérerChangementAdmin,
    gérerChangementUtilisateur,
    vérifierSoliditéMotDePasse,
    gérerSoumission,
    setAfficherMotDePasseAdmin,
    setAfficherConfirmationMotDePasseAdmin,
    setAfficherMotDePasseUtilisateur,
    setAfficherConfirmationMotDePasseUtilisateur,
  } = useRegisterForm();

  return (
    <div className="fullscreen-container">
      {/* panneau gauche */}
      <div className="left-panel">
        <div className="welcome-text">
          <h1>Bienvenue</h1>
          <h2>Rejoignez-nous</h2>
          <div className="divider"></div>
          <p>
            Inscrivez-vous selon votre rôle pour accéder aux services de
            l'église. Les administrateurs et les utilisateurs réguliers ont
            différents niveaux d'accès.
          </p>
          <p>En cliquant sur "S'inscrire", vous acceptez les conditions.</p>
        </div>
        <div className="terms">
          <p>
            En vous inscrivant, vous acceptez nos{" "}
            <a href="#">Conditions d'utilisation</a> et notre{" "}
            <a href="#">Politique de confidentialité</a>.
          </p>
        </div>
      </div>

      {/* panneau droit */}
      <div className="right-panel">
        <img src={flmlogo} alt="" />
        <div className="role-selector">
          <button
            className={`role-btn ${rôleActif === "admin" ? "active" : ""}`}
            onClick={() => gérerChangementRôle("admin")}
          >
            Admin Fiangonana
          </button>
          <button
            className={`role-btn ${rôleActif === "user" ? "active" : ""}`}
            onClick={() => gérerChangementRôle("user")}
          >
            Utilisateur Fiangonana
          </button>
        </div>

        {rôleActif === "admin" ? (
          <FormulaireInscriptionAdmin
            formulaireAdmin={formulaireAdmin}
            afficherMotDePasseAdmin={afficherMotDePasseAdmin}
            afficherConfirmationMotDePasseAdmin={afficherConfirmationMotDePasseAdmin}
            setAfficherMotDePasseAdmin={setAfficherMotDePasseAdmin}
            setAfficherConfirmationMotDePasseAdmin={setAfficherConfirmationMotDePasseAdmin}
            gérerChangementAdmin={gérerChangementAdmin}
            vérifierSoliditéMotDePasse={vérifierSoliditéMotDePasse}
            gérerSoumission={gérerSoumission}
          />
        ) : (
          <FormulaireInscriptionUtilisateur
            formulaireUtilisateur={formulaireUtilisateur}
            afficherMotDePasseUtilisateur={afficherMotDePasseUtilisateur}
            afficherConfirmationMotDePasseUtilisateur={afficherConfirmationMotDePasseUtilisateur}
            setAfficherMotDePasseUtilisateur={setAfficherMotDePasseUtilisateur}
            setAfficherConfirmationMotDePasseUtilisateur={setAfficherConfirmationMotDePasseUtilisateur}
            gérerChangementUtilisateur={gérerChangementUtilisateur}
            vérifierSoliditéMotDePasse={vérifierSoliditéMotDePasse}
            gérerSoumission={gérerSoumission}
          />
        )}
      </div>
    </div>
  );
};

export default Register;
