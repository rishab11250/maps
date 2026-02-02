import { useState, useEffect } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

const UserLocationMarker = () => {
    const [position, setPosition] = useState(null);
    const map = useMap();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (mounted) return;

        map.locate({ setView: true, maxZoom: 14 });

        const onLocationFound = (e) => {
            setPosition(e.latlng);
            map.flyTo(e.latlng, 14);
            setMounted(true); // Ensure we only auto-fly once on load
        };

        const onLocationError = (e) => {
            console.error("Location access denied or error:", e.message);
        };

        map.on('locationfound', onLocationFound);
        map.on('locationerror', onLocationError);

        return () => {
            map.off('locationfound', onLocationFound);
            map.off('locationerror', onLocationError);
        };
    }, [map, mounted]);

    // Custom Blue Dot Icon
    const userIcon = L.divIcon({
        className: 'user-location-marker',
        html: `<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg relative">
                 <div class="absolute -inset-1 bg-blue-500 rounded-full opacity-30 animate-ping"></div>
               </div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });

    return position === null ? null : (
        <Marker position={position} icon={userIcon}>
            <Popup>You are here</Popup>
        </Marker>
    );
};

export default UserLocationMarker;
