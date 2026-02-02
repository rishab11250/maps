import { motion } from 'framer-motion';
import { Compass as CompassIcon } from 'lucide-react';

const Compass = ({ bearing = 0, onResetNorth }) => {
    return (
        <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 400, damping: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onResetNorth}
            title="Reset to North"
            className="absolute top-20 right-4 z-[1000] w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-xl shadow-black/10 border border-white/20 text-gray-700 hover:bg-gray-50"
        >
            <motion.div
                animate={{ rotate: -bearing }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                <CompassIcon size={24} strokeWidth={1.5} className="text-red-500" />
            </motion.div>
            {/* North indicator */}
            <span className="absolute -top-1 text-[10px] font-bold text-red-500">N</span>
        </motion.button>
    );
};

export default Compass;
