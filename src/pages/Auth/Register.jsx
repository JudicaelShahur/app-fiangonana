import "@fortawesome/fontawesome-free/css/all.min.css";
import "/src/styles/Register.css";
import useRegisterForm from "../../hooks/useRegisterForm";
import FormulaireInscriptionAdmin from "./AdminRegisterForm";
import FormulaireInscriptionUtilisateur from "./UserRegisterForm";
import flmlogo from '../../assets/flmLogo.png';
import { Link } from "react-router-dom";

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
    <div className="containerResiger right-panel-active">
      {/* panneau droit */}
      <div className="formLogin-container sign-up-container">
        {/* FORMULAIRE PRINCIPAL */}
        <form onSubmit={gérerSoumission}>
          <h1>Créer un compte</h1>

          <div className="btn-switch">
            <button
              type="button"
              className={rôleActif === "admin" ? "active" : ""}
              onClick={() => gérerChangementRôle("admin")}
            >
              Admin Fiangonana
            </button>
            <button
              type="button"
              className={rôleActif === "user" ? "active" : ""}
              onClick={() => gérerChangementRôle("user")}
            >
              Utilisateur Fiangonana
            </button>
          </div>

          {/* SOUS-FORMULAIRE */}
          {rôleActif === "admin" ? (
            <FormulaireInscriptionAdmin
              formulaireAdmin={formulaireAdmin}
              afficherMotDePasseAdmin={afficherMotDePasseAdmin}
              afficherConfirmationMotDePasseAdmin={afficherConfirmationMotDePasseAdmin}
              setAfficherMotDePasseAdmin={setAfficherMotDePasseAdmin}
              setAfficherConfirmationMotDePasseAdmin={setAfficherConfirmationMotDePasseAdmin}
              gérerChangementAdmin={gérerChangementAdmin}
              vérifierSoliditéMotDePasse={vérifierSoliditéMotDePasse}
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
            />
          )}
        </form>
      </div>

      {/* Overlay */}
      <div className="overlayRegister-container">
        <div className="overlayRegister">
          <div className="overlayRegister-panel overlayRegister-rigth">
            <h1>Content de vous revoir !</h1>
            <p>Pour rester connecté avec nous, veuillez vous connecter avec vos informations personnelles</p>
            <button className="ghost">
              <Link to="/login">Connectez-vous ici</Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
