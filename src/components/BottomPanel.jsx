import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Navigation, Star, ChevronUp, ChevronDown, Trash2, ArrowUpDown, MapPin, LocateFixed, Plus, GripVertical } from 'lucide-react';
import { cn } from '../lib/utils';

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
    onCalculateRoute // Updated: (start, end, waypoints) => void
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [startInput, setStartInput] = useState("Your Location");
    const [endInput, setEndInput] = useState("");
    const [waypoints, setWaypoints] = useState([]); // Array of stop strings

    // Auto-fill end input if a place is selected when opening directions
    useEffect(() => {
        if (selectedPlace && activeTab === 'directions') {
            setEndInput(selectedPlace.display_name);
        }
    }, [selectedPlace, activeTab]);

    // Auto-expand if there's a selected place or route data
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

    const handleRouteSubmit = () => {
        if (onCalculateRoute) onCalculateRoute(startInput, endInput, waypoints.filter(w => w.trim()));
    };

    const toggleExpand = () => setIsExpanded(!isExpanded);

    return (
        <div className="absolute bottom-0 left-0 w-full z-[1000] pointer-events-none flex justify-center">

            <motion.div
                initial={{ y: "100%" }}
                animate={{ y: isExpanded ? "0%" : "85%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className={cn(
                    "pointer-events-auto bg-white w-full max-w-lg shadow-2xl rounded-t-3xl overflow-hidden flex flex-col transition-all duration-300 ease-spring",
                    isExpanded ? "h-panel-expanded" : "h-panel-collapsed"
                )}
            >
                {/* Drag Handle / Header */}
                <div
                    onClick={toggleExpand}
                    className="w-full bg-white p-3 flex flex-col items-center cursor-pointer border-b border-gray-100 shrink-0 hover:bg-gray-50 transition-colors"
                >
                    <div className="w-12 h-1.5 bg-gray-300 rounded-full mb-2" />
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                        {isExpanded ? "Swipe down to minimize" : "Swipe up for details"}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50">

                    {/* Navigation Tabs (Only visible when expanded or partially visible) */}
                    {activeTab === 'saved' && !routeData && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-gray-800 px-1">Saved Places</h2>
                            {savedPlaces.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <Star className="mx-auto mb-2 opacity-20" size={48} />
                                    <p>No saved places yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {savedPlaces.map((place, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => onSelectPlace(place)}
                                            className="group flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
                                        >
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                                    <Star size={18} fill="currentColor" />
                                                </div>
                                                <div className="truncate">
                                                    <h3 className="font-semibold text-gray-900 truncate">{place.display_name.split(',')[0]}</h3>
                                                    <p className="text-xs text-gray-500 truncate">{place.display_name}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onDeletePlace(place); }}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Place Details View */}
                    {selectedPlace && activeTab === 'saved' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">Selected Place</h2>
                                <button onClick={onClearSelection} className="p-2 hover:bg-gray-100 rounded-full">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="font-bold text-lg mb-1">{selectedPlace.display_name.split(',')[0]}</h3>
                                <p className="text-sm text-gray-500 mb-4">{selectedPlace.display_name}</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            onTabChange('directions');
                                            // Ideally execute route logic here or via parent
                                        }}
                                        className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Navigation size={18} />
                                        Directions
                                    </button>
                                    <button
                                        onClick={() => onDeletePlace(selectedPlace)} // Using delete as toggle
                                        className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                                    >
                                        {/* Logic for isSaved needs to be passed or handled better, assuming toggle for now */}
                                        <Star size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Route/Directions View */}
                    {activeTab === 'directions' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">Plan Trip</h2>
                                <button onClick={onClearRoute} className="text-sm font-medium text-red-500 hover:text-red-600 px-3 py-1 bg-red-50 rounded-full">
                                    Exit
                                </button>
                            </div>

                            {/* Trip Inputs */}
                            <div className="flex flex-col gap-3 p-4 bg-gray-100 rounded-2xl relative">
                                {/* Vertical Line Decor */}
                                <div className="absolute left-[27px] top-[30px] bottom-[30px] w-0.5 bg-gray-300 border-l border-dashed border-gray-400 pointer-events-none" />

                                {/* Start Input */}
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full border-2 border-blue-500 shrink-0 bg-white" />
                                    <div className="flex-1 bg-white rounded-xl px-3 py-2 shadow-sm border border-gray-200 flex items-center gap-2">
                                        {startInput === "Your Location" && <LocateFixed size={14} className="text-blue-500" />}
                                        <input
                                            value={startInput}
                                            onChange={(e) => setStartInput(e.target.value)}
                                            placeholder="Choose starting point"
                                            className="w-full bg-transparent outline-none text-sm text-gray-700 font-medium"
                                        />
                                        {startInput && (
                                            <button onClick={() => setStartInput('')} className="text-gray-400 hover:text-gray-600">
                                                <X size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Swap Button */}
                                {/* <button onClick={handleSwap} className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 bg-white rounded-full shadow-md text-gray-500 hover:text-blue-600 z-10">
                                    <ArrowUpDown size={14} />
                                </button> */}
                                {/* Keep layout simple for now, drag/swap can complicate mobile layout height */}

                                {/* Waypoints (Stops) */}
                                {waypoints.map((waypoint, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-orange-400 shrink-0 ml-0.5" />
                                        <div className="flex-1 bg-white rounded-xl px-3 py-2 shadow-sm border border-gray-200 flex items-center gap-2">
                                            <input
                                                value={waypoint}
                                                onChange={(e) => updateWaypoint(index, e.target.value)}
                                                placeholder={`Stop ${index + 1}`}
                                                className="w-full bg-transparent outline-none text-sm text-gray-700 font-medium"
                                            />
                                            <button onClick={() => removeWaypoint(index)} className="text-gray-400 hover:text-red-500">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {/* Add Stop Button */}
                                {waypoints.length < 5 && (
                                    <button
                                        type="button"
                                        onClick={addWaypoint}
                                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium py-1 ml-6"
                                    >
                                        <Plus size={16} />
                                        Add stop
                                    </button>
                                )}

                                {/* End Input */}
                                <div className="flex items-center gap-3">
                                    <MapPin size={18} className="text-red-500 shrink-0" />
                                    <div className="flex-1 bg-white rounded-xl px-3 py-2 shadow-sm border border-gray-200 flex items-center gap-2">
                                        <input
                                            value={endInput}
                                            onChange={(e) => setEndInput(e.target.value)}
                                            placeholder="Choose destination"
                                            className="w-full bg-transparent outline-none text-sm text-gray-700 font-medium"
                                        />
                                        {endInput && (
                                            <button onClick={() => setEndInput('')} className="text-gray-400 hover:text-gray-600">
                                                <X size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={handleRouteSubmit}
                                    className="mt-2 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
                                >
                                    <Navigation size={16} />
                                    Start Navigation
                                </button>
                            </div>

                            {routeData ? (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex gap-4 p-4 bg-green-50 rounded-2xl border border-green-100 items-center justify-between">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-700">{routeData.duration}</div>
                                            <div className="text-xs font-semibold text-green-600 uppercase tracking-wide">min</div>
                                        </div>
                                        <div className="h-8 w-px bg-green-200" />
                                        <div className="text-center">
                                            <div className="text-xl font-bold text-green-700">{routeData.distance}</div>
                                            <div className="text-xs font-semibold text-green-600 uppercase tracking-wide">km</div>
                                        </div>
                                        <div className="h-8 w-px bg-green-200" />
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-green-700">
                                                {new Date(Date.now() + routeData.duration * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            <div className="text-xs font-semibold text-green-600 uppercase tracking-wide">ETA</div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 max-h-[40vh] overflow-y-auto scrollbar-hide">
                                        <h3 className="font-semibold text-gray-700 ml-1 sticky top-0 bg-white py-2">Steps</h3>
                                        {routeData.steps.map((step, idx) => (
                                            <div key={idx} className="flex gap-4 p-3 bg-white rounded-xl border border-gray-100 items-start">
                                                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0 mt-0.5">
                                                    {idx + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-700 leading-relaxed font-medium">
                                                        {step.maneuver.instruction || step.name || "Continue"}
                                                    </p>
                                                    {step.distance > 0 && (
                                                        <p className="text-xs text-gray-400 mt-0.5">{Math.round(step.distance)}m</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 text-center">
                                    <p className="text-xs text-gray-400">Enter locations above to see route.</p>
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
