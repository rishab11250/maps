import L from 'leaflet';

export const StartIcon = L.divIcon({
    className: 'bg-transparent',
    html: `
        <div style="position: relative; width: 30px; height: 30px;">
            <div style="position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 12px solid #22c55e;"></div>
            <div style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 24px; height: 24px; background: #22c55e; border: 3px solid white; border-radius: 50%; box-shadow: 0 4px 6px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center;">
                <div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div>
            </div>
        </div>
    `,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -42]
});

export const EndIcon = L.divIcon({
    className: 'bg-transparent',
    html: `
        <div style="position: relative; width: 30px; height: 30px;">
             <div style="position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 12px solid #ef4444;"></div>
            <div style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 24px; height: 24px; background: #ef4444; border: 3px solid white; border-radius: 50%; box-shadow: 0 4px 6px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center;">
                <div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div>
            </div>
        </div>
    `,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -42]
});

// Helper to get icon based on maneuver
// We won't strictly use this here as sidebar handles UI, but good for map reference if needed
