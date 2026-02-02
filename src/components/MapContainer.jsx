import { MapContainer as LeafletMap, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { forwardRef, useState, useEffect } from 'react';

// Fix for default Leaflet marker icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Tile layer configurations
const TILE_LAYERS = {
    light: {
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },
    dark: {
        url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    },
    satellite: {
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        attribution: 'Tiles &copy; Esri'
    }
};

const MapContainer = forwardRef(({ activeTheme = 'light', children }, ref) => {
    const [center, setCenter] = useState([37.7749, -122.4194]);
    const [initialZoom, setInitialZoom] = useState(13);
    const [hasLocated, setHasLocated] = useState(false);

    // Get the correct tile configuration based on activeTheme
    const layerConfig = TILE_LAYERS[activeTheme] || TILE_LAYERS.light;

    // Get user location on mount for initial center
    useEffect(() => {
        if (hasLocated) return;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCenter([latitude, longitude]);
                    setInitialZoom(14);
                    setHasLocated(true);
                },
                (error) => {
                    console.log("Geolocation denied or unavailable, using default location");
                    setHasLocated(true);
                }
            );
        }
    }, [hasLocated]);

    return (
        <LeafletMap
            center={center}
            zoom={initialZoom}
            scrollWheelZoom={true}
            zoomControl={false}
            className="w-full h-full"
            style={{ height: '100%', width: '100%' }}
            ref={ref}
        >
            {/* Dynamic TileLayer based on activeTheme */}
            <TileLayer
                key={activeTheme}
                url={layerConfig.url}
                attribution={layerConfig.attribution}
            />
            {children}
        </LeafletMap>
    );
});

MapContainer.displayName = "MapContainer";

export default MapContainer;
