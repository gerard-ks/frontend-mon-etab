export const API_ENDPOINTS = {
  SCHOOLS: {
    BASE: 'schools',
    GET_ALL: 'schools',
    GET_BY_ID: (id: number) => `schools/${id}`,
    CREATE: 'schools',
    UPDATE: (id: number) => `schools/${id}`,
    DELETE: (id: number) => `schools/${id}`,
  }
} as const;