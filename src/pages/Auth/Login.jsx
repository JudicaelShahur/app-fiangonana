import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import ChurchLogo from "../../pages/Shared/ChurchLogo";
import "/src/styles/Auth.css";
import useLoginForm from "../../hooks/useLoginForm";

const Login = () => {
  const {
    donneesFormulaire,
    afficherMotDePasse,
    gererChangement,
    basculerVisibiliteMotDePasse,
    gererSoumission,
    onLogin,
    error,
  } = useLoginForm();

  return (
    <div className="fullscreen-container">
      <div className="left-panel">
        <div className="welcome-text">
          <h1>Content de vous revoir</h1>
          <h2>Connectez-vous</h2>
          <div className="divider"></div>
          <p>
            Accédez à votre espace personnel pour gérer les activités de votre
            église et rester connecté avec votre communauté.
          </p>
          <p>
            Si vous n'avez pas encore de compte, inscrivez-vous pour profiter de
            tous nos services.
          </p>
        </div>
        <div className="terms">
          <p>
            En vous connectant, vous acceptez nos{" "}
            <a href="#">Conditions d'utilisation</a> et notre{" "}
            <a href="#">Politique de confidentialité</a>.
          </p>
        </div>
      </div>

      <div className="right-panel">
        <ChurchLogo title="Connexion Fiangonana" />

        <div className="login-form active">
          <form onSubmit={gererSoumission(onLogin)}>
            <div className="formUser-group">
              <label htmlFor="nomUtilisateur">Nom d'utilisateur</label>
              <input
                type="text"
                id="nomUtilisateur"
                name="nomUtilisateur"
                placeholder="Entrez votre nom d'utilisateur"
                value={donneesFormulaire.nomUtilisateur}
                onChange={gererChangement}
                required
                autoComplete="username"
              />
              <i className="fas fa-user input-icon"></i>
            </div>

            <div className="formUser-group">
              <label htmlFor="motDePasse">Mot de passe</label>
              <div className="password-input-container">
                <input
                  type={afficherMotDePasse ? "text" : "password"}
                  id="motDePasse"
                  name="motDePasse"
                  placeholder="Entrez votre mot de passe"
                  value={donneesFormulaire.motDePasse}
                  onChange={gererChangement}
                  required
                  autoComplete="current-password"
                />
                <i className="fas fa-lock input-icon"></i>
                <span
                  className="password-toggle"
                  onClick={basculerVisibiliteMotDePasse}
                >
                  <i
                    className={`fas ${afficherMotDePasse ? "fa-eye-slash" : "fa-eye"
                      }`}
                  ></i>
                </span>
              </div>
            </div>

            {error && <p className="error-message">{error}</p>}

            <div className="remember-forgot">
              <div className="remember">
                <input
                  type="checkbox"
                  id="seSouvenir"
                  name="seSouvenir"
                  onChange={gererChangement}
                />
                <label htmlFor="seSouvenir">Se souvenir de moi</label>
              </div>
              <a href="#" className="forgot-password">
                Mot de passe oublié?
              </a>
            </div>

            <button type="submit" className="btn">
              Se connecter
            </button>

            <div className="register-link">
              <p>
                Pas encore de compte? <Link to="/register">S'inscrire</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
