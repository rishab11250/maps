import { Search, Loader2, X, Settings } from 'lucide-react';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import debounce from 'lodash.debounce';

const SearchBar = ({ onSearch, isSearching }) => {
    const [query, setQuery] = useState('');

    // Debounced search for auto-search on typing
    const debouncedSearch = useMemo(
        () => debounce((searchQuery) => {
            if (searchQuery.trim().length > 2) {
                onSearch(searchQuery);
            }
        }, 500),
        [onSearch]
    );

    // Cleanup debounce on unmount
    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        debouncedSearch(value);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        onSearch(query);
    };

    const clearSearch = () => {
        setQuery('');
    };

    return (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] w-[90%] max-w-md">
            <motion.form
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onSubmit={handleSearch}
                className="relative flex items-center bg-white rounded-full shadow-xl shadow-black/10 p-2 pr-3"
            >
                {/* Search Icon / Menu Trigger */}
                <button type="button" className="p-3 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                    <Search size={22} />
                </button>

                {/* Input */}
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    placeholder="Search here..."
                    className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder:text-gray-400 text-lg px-2"
                />

                {/* Clear / Loading */}
                <AnimatePresence>
                    {query && (
                        <motion.button
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            type="button"
                            onClick={clearSearch}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-1"
                        >
                            <X size={18} className="text-gray-400" />
                        </motion.button>
                    )}
                </AnimatePresence>

                {/* User Avatar / Profile Placeholder */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-inner shrink-0 cursor-pointer hover:opacity-90 transition-opacity">
                    R
                </div>

            </motion.form>
        </div>
    );
};

import React, { useEffect as useCleanupEffect } from 'react';

export default React.memo(SearchBar);
