// API Endpoints
export const API = {
    NOMINATIM_SEARCH: 'https://nominatim.openstreetmap.org/search',
    NOMINATIM_REVERSE: 'https://nominatim.openstreetmap.org/reverse',
    OSRM_ROUTE: 'https://router.project-osrm.org/route/v1/driving',
};

// Tile Layers
export const TILE_URLS = {
    STREET: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    DARK: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    SATELLITE: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
};

// Default Map Settings
export const MAP_DEFAULTS = {
    CENTER: [37.7749, -122.4194], // San Francisco
    ZOOM: 13,
    USER_ZOOM: 14,
};

// LocalStorage Keys
export const STORAGE_KEYS = {
    SAVED_PLACES: 'savedPlaces',
    RECENT_SEARCHES: 'recentSearches',
    THEME: 'mapTheme',
};
