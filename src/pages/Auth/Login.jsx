import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "/src/styles/Login.css";
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
    <div className="containerLogin left-panel-active">
      <div className="formLogin-container sign-in-container">
        <form className="formLogin" onSubmit={gererSoumission(onLogin)}>
          <h1>Se connecter</h1>
          <div className="logoLogin">
            <img src="src/assets/flmLogo.png" alt="Logo FLM" />
          </div>

          <div className="formLogin-group">
            <label htmlFor="nomUtilisateur">Nom d'utilisateur</label>
            <div className="input-with-icon">
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
          </div>

          <div className="formLogin-group">
            <label htmlFor="motDePasse">Mot de passe</label>
            <div className="input-with-icon password-container">
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
                  className={`fas ${afficherMotDePasse ? "fa-eye-slash" : "fa-eye"}`}
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

          <button type="submit" className="btnLogin">
            Se connecter
          </button>
        </form>
      </div>

      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-right">
            <h1>Bonjour, cher ami !</h1>
            <p>Entrez vos données personnelles et commencez votre voyage avec nous</p>
            <button className="ghost"><Link to="/register">S'inscrire</Link></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;