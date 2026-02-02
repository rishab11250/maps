import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, SkipForward } from 'lucide-react';

const VoiceNav = ({ steps = [], isActive = false, onToggle }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isSpeaking, setIsSpeaking] = useState(false);

    // Check if speech synthesis is supported
    const isSpeechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

    const speak = useCallback((text) => {
        if (!isSpeechSupported || !isActive) return;

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;

        // Try to use a natural voice
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Natural'));
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    }, [isSpeechSupported, isActive]);

    // Speak current step when it changes
    useEffect(() => {
        if (isActive && steps[currentStep]) {
            const stepText = steps[currentStep].maneuver?.instruction ||
                `Continue for ${Math.round(steps[currentStep].distance)} meters`;
            speak(stepText);
        }
    }, [currentStep, isActive, steps, speak]);

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const stopSpeaking = () => {
        if (isSpeechSupported) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    if (!isSpeechSupported) return null;

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-20 left-4 z-[1000] flex items-center gap-2"
        >
            {/* Voice Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onToggle}
                className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg transition-all
                    ${isActive
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'}
                `}
            >
                {isActive ? <Volume2 size={18} /> : <VolumeX size={18} />}
                <span className="text-sm font-medium">
                    {isActive ? 'Voice On' : 'Voice Off'}
                </span>
            </motion.button>

            {/* Skip to next step (when speaking) */}
            <AnimatePresence>
                {isActive && steps.length > 0 && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={nextStep}
                        className="p-2.5 bg-white rounded-full shadow-lg text-gray-700 hover:bg-gray-50"
                        title="Next instruction"
                    >
                        <SkipForward size={18} />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Speaking indicator */}
            <AnimatePresence>
                {isSpeaking && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-1"
                    >
                        {[0, 1, 2].map(i => (
                            <motion.div
                                key={i}
                                animate={{ scaleY: [1, 1.5, 1] }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 0.5,
                                    delay: i * 0.1
                                }}
                                className="w-1 h-4 bg-blue-500 rounded-full"
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default VoiceNav;
