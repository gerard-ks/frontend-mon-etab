import { IErrorRoute } from "../interfaces/auth.interface";

export const AUTH_CONSTANTS = {
  ENDPOINTS: {
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh'
  },
  STORAGE_KEYS: {
    ACCESS_TOKEN: 'app.access_token',
    REFRESH_TOKEN: 'app.refresh_token',
    TOKEN_EXPIRATION: 'app.token_expiration',
    USER: 'app.user',
  },
  TOKEN_PREFIX: 'Bearer',
  ERRORS_PAGE: {
    DEFAULT_TITLE: 'Ooops..',
    NOT_FOUND: 'Page introuvable',
    ERROR_DESCRIPTION: "Oopps !! La page que vous recherchez n'existe pas.",
    WRONG_ERROR_TITLE: 'Quelque chose s\'est mal passé',
    WRONG_ERROR_DESCRIPTION: `Quelque chose s'est mal passé.<br> Nous travaillons dessus`
  },
  AUTH_MESSAGES: {
    LOGIN_SUCCESS: 'Vous etes à présent connecté',
    LOGOUT_SUCCESS: 'Vous etes à présent déconnecté',
    LOGIN_ERROR: 'Erreur, connexion impossible',
    LOGIN_IN_PROGRESS: 'Connexion en cours',
  }
} as const;

export const ERROR_ROUTES: IErrorRoute[] = [
  {
    status: 401,
    path: '/error/401',
    message: 'Non autorisé'
  },
  {
    status: 403,
    path: '/error/403',
    message: 'Accès refusé'
  },
  {
    status: 404,
    path: '/error/404',
    message: 'Ressource non trouvée'
  },
  {
    status: 500,
    path: '/error/500',
    message: 'Erreur serveur'
  }
];