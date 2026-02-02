import { MapContainer as LeafletMiniMap, TileLayer, Rectangle, useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Component to track main map bounds
const BoundsTracker = ({ parentMap, onBoundsChange }) => {
    useEffect(() => {
        if (!parentMap) return;

        const updateBounds = () => {
            onBoundsChange(parentMap.getBounds());
        };

        parentMap.on('moveend', updateBounds);
        parentMap.on('zoomend', updateBounds);
        updateBounds();

        return () => {
            parentMap.off('moveend', updateBounds);
            parentMap.off('zoomend', updateBounds);
        };
    }, [parentMap, onBoundsChange]);

    return null;
};

const MiniMap = ({ parentMap }) => {
    const [bounds, setBounds] = useState(null);
    const [center, setCenter] = useState([37.7749, -122.4194]);

    useEffect(() => {
        if (parentMap) {
            const c = parentMap.getCenter();
            setCenter([c.lat, c.lng]);
        }
    }, [parentMap]);

    if (!parentMap) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-32 left-4 z-[1000] w-36 h-36 rounded-xl overflow-hidden shadow-xl border-2 border-white/50 bg-white"
        >
            <LeafletMiniMap
                center={center}
                zoom={parentMap.getZoom() - 4}
                zoomControl={false}
                dragging={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
                attributionControl={false}
                className="w-full h-full"
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <BoundsTracker parentMap={parentMap} onBoundsChange={setBounds} />
                {bounds && (
                    <Rectangle
                        bounds={bounds}
                        pathOptions={{
                            color: '#2563eb',
                            weight: 2,
                            fillColor: '#2563eb',
                            fillOpacity: 0.1
                        }}
                    />
                )}
            </LeafletMiniMap>
        </motion.div>
    );
};

export default MiniMap;
