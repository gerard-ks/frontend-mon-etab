export const APP_CONSTANTS = {
  TOASTS_MESSAGES: {
    CREATE: 'Création avec succès',
    UPDATE: 'Mise à jour avec succès',
    DELETE: 'Suppression avec succès',
    STATUS: 'Status mise à jour avec succès',
    CONFIRM_TEXT: 'Vous êtes sûr de vouloir supprimer' + ' ',
    HEADER: 'Confirmation',
  },
  LOADING_MESSAGES: {
    GET: 'Chargement en cours...',
    CREATE: 'Création en cours...',
    UPDATE: 'Modification en cours...',
    DELETE: 'Suppression en cours...',
  },
} as const;

export const ROUTES = {
  AUTH: {
    ROOT: 'auth',
    LOGIN: 'login'
  },
  BACKOFFICE: {
    ROOT: 'backoffice',
    DASHBOARD: 'dashboard',
    STUDENTS: 'students',
    PROFESSORS: 'professors',
    USERS: 'users',
    REPORTS: 'reports'
  }
} as const;