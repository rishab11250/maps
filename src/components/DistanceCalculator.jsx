import { useEffect, useState, useRef } from 'react';
import { useMap, Marker, Polyline, Tooltip, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Ruler, Trash2, X } from 'lucide-react';

const DistanceCalculator = ({ isActive, onClose }) => {
    const map = useMap();
    const [points, setPoints] = useState([]);
    const [distance, setDistance] = useState(0);

    const [cursorPos, setCursorPos] = useState(null);

    // Event Handling using useMapEvents for better integration
    useMapEvents({
        click(e) {
            if (!isActive) return;
            const { lat, lng } = e.latlng;
            setPoints(prev => [...prev, [lat, lng]]);
        },
        mousemove(e) {
            if (!isActive) return;
            setCursorPos(e.latlng);
        }
    });

    useEffect(() => {
        if (isActive) {
            map.getContainer().style.cursor = 'crosshair';
        } else {
            map.getContainer().style.cursor = '';
        }
    }, [isActive, map]);

    useEffect(() => {
        if (points.length < 2) {
            setDistance(0);
            return;
        }

        let totalDist = 0;
        for (let i = 0; i < points.length - 1; i++) {
            const p1 = L.latLng(points[i]);
            const p2 = L.latLng(points[i + 1]);
            totalDist += p1.distanceTo(p2);
        }
        setDistance(totalDist);
    }, [points]);

    const formatDistance = (meters) => {
        if (meters >= 1000) {
            return `${(meters / 1000).toFixed(2)} km`;
        }
        return `${meters.toFixed(0)} m`;
    };

    if (!isActive) return null;

    return (
        <>
            {/* UI Control Overlay */}
            <div className="absolute top-24 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-md rounded-lg shadow-lg p-3 z-[2000] flex items-center gap-4 fade-in border border-white/20">
                <div className="flex items-center gap-2 text-orange-600 font-bold">
                    <Ruler size={18} />
                    <span>Ruler Mode</span>
                </div>
                <div className="w-px h-6 bg-gray-300"></div>
                <div className="font-mono text-gray-800 font-semibold min-w-[80px] text-center">
                    {formatDistance(distance)}
                </div>
                <button
                    onClick={() => { setPoints([]); setDistance(0); }}
                    className="p-1.5 hover:bg-red-100 rounded text-red-500 transition"
                    title="Clear"
                >
                    <Trash2 size={16} />
                </button>
                <button
                    onClick={onClose}
                    className="p-1.5 hover:bg-gray-100 rounded text-gray-500 transition"
                    title="Close"
                >
                    <X size={16} />
                </button>
            </div>

            {/* Map Elements */}
            {points.map((pos, idx) => (
                <Marker
                    key={idx}
                    position={pos}
                    icon={L.divIcon({
                        className: 'bg-transparent',
                        html: `<div style="width: 12px; height: 12px; background: white; border: 2px solid #ea580c; border-radius: 50%;"></div>`
                    })}
                />
            ))}

            {points.length > 1 && (
                <Polyline
                    positions={points}
                    pathOptions={{ color: '#ea580c', weight: 4, dashArray: '10, 10', opacity: 0.8 }}
                />
            )}

            {/* Last point tooltip with cursor hint */}
            {points.length > 0 && (
                <Tooltip position={points[points.length - 1]} permanent direction="top" offset={[0, -10]} className="bg-transparent border-none shadow-none text-orange-600 font-bold">
                    Start
                </Tooltip>
            )}

            {isActive && cursorPos && (
                <Marker position={cursorPos} opacity={0} interactive={false}>
                    <Tooltip permanent direction="right" offset={[10, 0]} className="custom-tooltip">
                        <span className="font-semibold text-orange-600">
                            {points.length === 0 ? "Click to start" : "Click to add"}
                        </span>
                    </Tooltip>
                </Marker>
            )}
        </>
    );
};

export default DistanceCalculator;
