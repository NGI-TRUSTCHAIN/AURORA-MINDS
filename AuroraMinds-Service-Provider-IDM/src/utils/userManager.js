import { createUserManager } from 'redux-oidc';

const userManagerConfig = {
  client_id: 'olympus-service-provider',
  redirect_uri: 'http://localhost:3000/callbackKC',
  response_type: 'token id_token',
  scope: 'openid profile',
  authority: 'http://localhost:8082/auth/realms/olympus-realm/',
  silent_redirect_uri: 'localhost:3000/silent_renew.html',
  automaticSilentRenew: false,
  filterProtocolClaims: true,
  loadUserInfo: true,
};

const olympusUserManagerConfig = {
  client_id: 'olympus-service-provider',
  redirect_uri: 'http://localhost:3000/callbackOL',
  response_type: 'id_token',
  scope: 'openid name',
  authority: 'http://localhost:8080/',
  silent_redirect_uri: `localhost:3000/silent_renew.html`,
  automaticSilentRenew: false,
  filterProtocolClaims: true,
  loadUserInfo: true,
};

const userManager = createUserManager(userManagerConfig);
const userManagerOlympus = createUserManager(olympusUserManagerConfig);

export {userManager, userManagerOlympus};
