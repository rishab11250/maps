import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Navigation, Star, Trash2, ArrowUpDown, MapPin, LocateFixed, Plus, Car, Footprints, Bike, Clock, Route } from 'lucide-react';
import { cn } from '../lib/utils';

// Transport Mode Button Component
const TransportButton = ({ icon: Icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={cn(
            "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all",
            isActive
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        )}
    >
        <Icon size={20} />
        <span className="text-xs font-medium">{label}</span>
    </button>
);

const BottomPanel = ({
    isOpen,
    onClose,
    savedPlaces,
    selectedPlace,
    onSelectPlace,
    onDeletePlace,
    onClearSelection,
    activeTab,
    onTabChange,
    routeData,
    onClearRoute,
    onCalculateRoute
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [startInput, setStartInput] = useState("Your Location");
    const [endInput, setEndInput] = useState("");
    const [waypoints, setWaypoints] = useState([]);
    const [transportMode, setTransportMode] = useState('driving');

    useEffect(() => {
        if (selectedPlace && activeTab === 'directions') {
            setEndInput(selectedPlace.display_name);
        }
    }, [selectedPlace, activeTab]);

    useEffect(() => {
        if (selectedPlace || routeData || isOpen) {
            setIsExpanded(true);
        } else {
            setIsExpanded(false);
        }
    }, [selectedPlace, routeData, isOpen]);

    const handleSwap = () => {
        setStartInput(endInput);
        setEndInput(startInput);
    };

    const addWaypoint = () => {
        if (waypoints.length < 5) {
            setWaypoints([...waypoints, '']);
        }
    };

    const updateWaypoint = (index, value) => {
        const updated = [...waypoints];
        updated[index] = value;
        setWaypoints(updated);
    };

    const removeWaypoint = (index) => {
        setWaypoints(waypoints.filter((_, i) => i !== index));
    };

    const handleStartNavigation = () => {
        if (onCalculateRoute && endInput.trim()) {
            onCalculateRoute(startInput, endInput, waypoints.filter(w => w.trim()), transportMode);
        }
    };

    const toggleExpand = () => setIsExpanded(!isExpanded);

    return (
        <div className="absolute bottom-0 left-0 w-full z-[1000] pointer-events-none flex justify-center">
            <motion.div
                initial={{ y: "100%" }}
                animate={{ y: isExpanded ? "0%" : "85%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className={cn(
                    "pointer-events-auto bg-white w-full max-w-lg shadow-2xl rounded-t-3xl overflow-hidden flex flex-col",
                    isExpanded ? "h-panel-expanded" : "h-panel-collapsed"
                )}
            >
                {/* Drag Handle */}
                <div
                    onClick={toggleExpand}
                    className="w-full bg-white p-3 flex flex-col items-center cursor-pointer border-b border-gray-100 shrink-0 hover:bg-gray-50"
                >
                    <div className="w-12 h-1.5 bg-gray-300 rounded-full mb-2" />
                    <div className="text-sm font-medium text-gray-500">
                        {isExpanded ? "Swipe down" : "Swipe up"}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50">

                    {/* Saved Places Tab */}
                    {activeTab === 'saved' && !routeData && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-gray-800">Saved Places</h2>
                            {savedPlaces.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <Star className="mx-auto mb-2 opacity-20" size={48} />
                                    <p className="text-sm">No saved places yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {savedPlaces.map((place, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            onClick={() => onSelectPlace(place)}
                                            className={cn(
                                                "p-3 bg-white rounded-xl border cursor-pointer hover:shadow-md flex items-center justify-between",
                                                selectedPlace?.display_name === place.display_name && "ring-2 ring-blue-500"
                                            )}
                                        >
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <Star size={16} className="text-yellow-500 fill-yellow-400" />
                                                <span className="text-sm truncate">{place.display_name}</span>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onDeletePlace(place); }}
                                                className="p-2 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-500"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            {/* Selected Place Card */}
                            {selectedPlace && (
                                <div className="p-4 bg-white rounded-2xl shadow-lg border space-y-3 mt-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <MapPin className="text-blue-600" size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-gray-900 truncate">
                                                {selectedPlace.display_name?.split(',')[0]}
                                            </h3>
                                            <p className="text-xs text-gray-500 truncate">{selectedPlace.display_name}</p>
                                        </div>
                                        <button onClick={onClearSelection} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                                            <X size={18} />
                                        </button>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setEndInput(selectedPlace.display_name);
                                                onTabChange('directions');
                                            }}
                                            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg flex items-center justify-center gap-2"
                                        >
                                            <Navigation size={18} />
                                            Directions
                                        </button>
                                        <button
                                            onClick={() => onDeletePlace(selectedPlace)}
                                            className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl"
                                        >
                                            <Star size={20} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Directions Tab - Google Maps Style */}
                    {activeTab === 'directions' && (
                        <div className="space-y-4">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">Get Directions</h2>
                                <button
                                    onClick={() => {
                                        onClearRoute();
                                        onTabChange('saved');
                                    }}
                                    className="text-sm font-medium text-gray-600 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full"
                                >
                                    ✕ Close
                                </button>
                            </div>

                            {/* Transport Mode Selector */}
                            <div className="flex gap-2 justify-center p-2 bg-gray-100 rounded-2xl">
                                <TransportButton icon={Car} label="Drive" isActive={transportMode === 'driving'} onClick={() => setTransportMode('driving')} />
                                <TransportButton icon={Footprints} label="Walk" isActive={transportMode === 'walking'} onClick={() => setTransportMode('walking')} />
                                <TransportButton icon={Bike} label="Cycle" isActive={transportMode === 'cycling'} onClick={() => setTransportMode('cycling')} />
                            </div>

                            {/* Route Inputs */}
                            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                                {/* Start */}
                                <div className="flex items-center gap-3 p-3 border-b">
                                    <div className="w-3 h-3 rounded-full bg-blue-500 ring-4 ring-blue-100" />
                                    <div className="flex-1 flex items-center gap-2">
                                        {startInput === "Your Location" && <LocateFixed size={14} className="text-blue-500" />}
                                        <input
                                            value={startInput}
                                            onChange={(e) => setStartInput(e.target.value)}
                                            placeholder="Choose starting point"
                                            className="w-full bg-transparent outline-none text-sm font-medium"
                                        />
                                    </div>
                                    {startInput && startInput !== "Your Location" && (
                                        <button onClick={() => setStartInput('')} className="text-gray-400 hover:text-gray-600 p-1">
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>

                                {/* Waypoints */}
                                <AnimatePresence>
                                    {waypoints.map((wp, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="flex items-center gap-3 p-3 border-b bg-orange-50"
                                        >
                                            <div className="w-3 h-3 rounded-full bg-orange-400 ring-4 ring-orange-100" />
                                            <input
                                                value={wp}
                                                onChange={(e) => updateWaypoint(idx, e.target.value)}
                                                placeholder={`Stop ${idx + 1}`}
                                                className="flex-1 bg-transparent outline-none text-sm"
                                            />
                                            <button onClick={() => removeWaypoint(idx)} className="text-gray-400 hover:text-red-500 p-1">
                                                <X size={14} />
                                            </button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {/* End */}
                                <div className="flex items-center gap-3 p-3">
                                    <div className="w-3 h-3 rounded-full bg-red-500 ring-4 ring-red-100" />
                                    <input
                                        value={endInput}
                                        onChange={(e) => setEndInput(e.target.value)}
                                        placeholder="Choose destination"
                                        className="flex-1 bg-transparent outline-none text-sm font-medium"
                                    />
                                    {endInput && (
                                        <button onClick={() => setEndInput('')} className="text-gray-400 hover:text-gray-600 p-1">
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-between p-3 border-t bg-gray-50">
                                    <button onClick={addWaypoint} disabled={waypoints.length >= 5} className="flex items-center gap-1 text-sm text-blue-600 font-medium disabled:opacity-50">
                                        <Plus size={16} /> Add stop
                                    </button>
                                    <button onClick={handleSwap} className="flex items-center gap-1 text-sm text-gray-600 font-medium">
                                        <ArrowUpDown size={16} /> Swap
                                    </button>
                                </div>
                            </div>

                            {/* START Button - Google Maps Style */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleStartNavigation}
                                disabled={!endInput.trim()}
                                className={cn(
                                    "w-full py-4 rounded-2xl font-bold text-lg shadow-xl flex items-center justify-center gap-3",
                                    endInput.trim()
                                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
                                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                )}
                            >
                                <Navigation size={22} className={endInput.trim() ? "animate-pulse" : ""} />
                                Start
                            </motion.button>

                            {/* Route Results */}
                            {routeData && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                                    {/* Summary Card */}
                                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-4 text-white shadow-lg">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-3xl font-bold">{routeData.duration} min</div>
                                                <div className="text-blue-200 text-sm">{routeData.distance} km</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm text-blue-200">Arrive by</div>
                                                <div className="text-2xl font-bold">
                                                    {new Date(Date.now() + routeData.duration * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full mt-4 py-3 bg-white text-blue-600 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg"
                                        >
                                            <Navigation size={20} />
                                            Start Navigation
                                        </motion.button>
                                    </div>

                                    {/* Turn by Turn */}
                                    <div className="bg-white rounded-2xl overflow-hidden border">
                                        <div className="p-3 bg-gray-50 border-b flex items-center gap-2">
                                            <Route size={16} className="text-gray-500" />
                                            <span className="font-semibold text-gray-700 text-sm">Turn-by-turn directions</span>
                                        </div>
                                        <div className="max-h-[35vh] overflow-y-auto">
                                            {routeData.steps.map((step, idx) => (
                                                <div key={idx} className={cn("flex gap-4 p-4 items-start border-b last:border-0", idx === 0 && "bg-blue-50")}>
                                                    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold", idx === 0 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500")}>
                                                        {idx + 1}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className={cn("text-sm leading-relaxed", idx === 0 ? "font-semibold text-gray-900" : "text-gray-700")}>
                                                            {step.maneuver?.instruction || step.name || "Continue"}
                                                        </p>
                                                        {step.distance > 0 && (
                                                            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                                                <Clock size={10} /> {Math.round(step.distance)}m
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Empty State */}
                            {!routeData && (
                                <div className="text-center py-6">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Navigation size={28} className="text-gray-400" />
                                    </div>
                                    <p className="text-sm text-gray-500">Enter a destination to see route options</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default BottomPanel;
