import L from 'leaflet';

// Custom marker icons for different POI categories
export const createCustomIcon = (category) => {
    const iconMap = {
        restaurant: '🍽️',
        gas: '⛽',
        hospital: '🏥',
        hotel: '🏨',
        shopping: '🛒',
        parking: '🅿️',
        cafe: '☕',
        bank: '🏦',
        pharmacy: '💊',
        default: '📍'
    };

    const emoji = iconMap[category] || iconMap.default;

    return L.divIcon({
        className: 'custom-marker',
        html: `
            <div class="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-lg border-2 border-white transform -translate-x-1/2 -translate-y-1/2 text-2xl hover:scale-110 transition-transform cursor-pointer">
                ${emoji}
            </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20]
    });
};

// Colored marker for route waypoints
export const createRouteIcon = (type) => {
    const colors = {
        start: '#22c55e', // green
        end: '#ef4444',   // red
        waypoint: '#f97316' // orange
    };

    const color = colors[type] || colors.waypoint;

    return L.divIcon({
        className: 'route-marker',
        html: `
            <div style="background-color: ${color};" class="w-6 h-6 rounded-full border-4 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2"></div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });
};

export default createCustomIcon;
