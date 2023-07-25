import Keycloak from "keycloak-js";

const _kc = new Keycloak('/keycloak.json');



/**
 * Initializes Keycloak instance and calls the provided callback function if successfully authenticated.
 *
 * @param onAuthenticatedCallback
 */
const initKeycloak = (onAuthenticatedCallback) => {
  _kc.init({

    
    onLoad: 'check-sso',
    // checkLoginIframe: false,
    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
    pkceMethod: 'S256',
    redirectUri: 'http://localhost:3000'
  })
    .then((authenticated) => {
      if (!authenticated) {
        console.log("user is not authenticated..!");
      }
      onAuthenticatedCallback();

      console.log("ID Token: ", _kc.idTokenParsed)
      console.log("Token: ", _kc.tokenParsed)


      return fetch('http://localhost:8080/realms/widergy-directory/broker/oidc/token', {
        headers: {
          'Origin':'http://localhost:3000',
          'Authorization': 'Bearer ' + _kc.token
           
        }
      })
    })

    .catch(console.error);
};

const doLogin = () => _kc.login({ 
  idpHint:'oidc'
});

const doLogout = _kc.logout;

const getToken = () => _kc.token;

const getTokenParsed = () => _kc.tokenParsed;

const isLoggedIn = () => !!_kc.token;

const updateToken = (successCallback) =>
  _kc.updateToken(5)
    .then(successCallback)
    .catch(doLogin);

const getUsername = () => _kc.tokenParsed?.preferred_username;

const hasRole = (roles) => roles.some((role) => _kc.hasRealmRole(role));

const getUserInfo = _kc.loadUserInfo

const UserService = {
  initKeycloak,
  doLogin,
  doLogout,
  isLoggedIn,
  getToken,
  getTokenParsed,
  updateToken,
  getUsername,
  hasRole,
  getUserInfo,
};

export default UserService;
