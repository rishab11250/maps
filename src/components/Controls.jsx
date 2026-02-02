import { Plus, Minus, Crosshair, Ruler, Moon, Sun, Share2, Map, Globe, Satellite } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

// Icon map for map styles
const MapStyleIcons = {
    light: Map,
    dark: Moon,
    satellite: Globe
};

// Generic FAB Component
const FAB = ({ onClick, icon: Icon, title, className, active, delay = 0 }) => (
    <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay, type: "spring", stiffness: 400, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        title={title}
        className={cn(
            "w-12 h-12 flex items-center justify-center rounded-full shadow-xl shadow-black/10 transition-colors",
            "bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-white/20",
            active && "text-blue-600 bg-blue-50 border-blue-100",
            className
        )}
    >
        <Icon size={22} strokeWidth={2} />
    </motion.button>
);

const Controls = ({ onZoomIn, onZoomOut, onLocate, onCycleMapStyle, onMeasure, mapStyle, onShare }) => {
    const CurrentMapIcon = MapStyleIcons[mapStyle] || Map;

    return (
        <>
            {/* Bottom Right: All Controls */}
            <div className="absolute right-4 bottom-32 md:bottom-24 z-[1000] flex flex-col gap-3 items-center">

                {/* Map Style Toggle */}
                <FAB
                    onClick={onCycleMapStyle}
                    icon={CurrentMapIcon}
                    title={`Map: ${mapStyle} (click to change)`}
                    active={mapStyle !== 'light'}
                    delay={0}
                />

                {/* Share */}
                <FAB
                    onClick={onShare}
                    icon={Share2}
                    title="Share Location"
                    delay={0.05}
                />

                {/* Measure */}
                <FAB
                    onClick={onMeasure}
                    icon={Ruler}
                    title="Measure"
                    delay={0.1}
                />

                {/* My Location */}
                <FAB
                    onClick={onLocate}
                    icon={Crosshair}
                    title="My Location"
                    delay={0.15}
                />

                {/* Zoom Group (Pill shape) */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex flex-col bg-white rounded-full shadow-xl border border-white/50 overflow-hidden"
                >
                    <button
                        onClick={onZoomIn}
                        className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-colors text-gray-700"
                    >
                        <Plus size={24} />
                    </button>
                    <div className="h-px w-8 bg-gray-200 mx-auto" />
                    <button
                        onClick={onZoomOut}
                        className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-colors text-gray-700"
                    >
                        <Minus size={24} />
                    </button>
                </motion.div>
            </div>
        </>
    );
};
import React from 'react';

export default React.memo(Controls);
