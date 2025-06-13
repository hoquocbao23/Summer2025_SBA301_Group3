export const API_BASE_URL = 'http://localhost:8080/api/v1';

// You can also define other API-related constants here
export const API_ENDPOINTS = {
    TICKET_TYPES: '/ticket-types',
    PROMOTIONS: '/promotions',
    ROUTES: '/routes',
    ROUTE_STATIONS: '/routes/stations',
    STATIONS: '/stations',
    // Add other endpoints here
};

// Utility function to create full API URL
export const createApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`; 