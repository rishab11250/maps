import { Search, Loader2, X, Settings, Clock, History } from 'lucide-react';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import debounce from 'lodash.debounce';

const SearchBar = ({ onSearch, isSearching }) => {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [recentSearches, setRecentSearches] = useState(() => {
        const saved = localStorage.getItem('recentSearches');
        return saved ? JSON.parse(saved) : [];
    });

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

    const saveToRecent = (searchTerm) => {
        const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem('recentSearches', JSON.stringify(updated));
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        debouncedSearch(value);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        saveToRecent(query.trim());
        onSearch(query);
    };

    const handleRecentClick = (term) => {
        setQuery(term);
        saveToRecent(term);
        onSearch(term);
        setIsFocused(false);
    };

    const clearSearch = () => {
        setQuery('');
    };

    const clearRecent = () => {
        setRecentSearches([]);
        localStorage.removeItem('recentSearches');
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
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
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

            {/* Recent Searches Dropdown */}
            <AnimatePresence>
                {isFocused && recentSearches.length > 0 && !query && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-white mt-2 rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                    >
                        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
                            <span className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                <History size={14} /> Recent
                            </span>
                            <button
                                type="button"
                                onClick={clearRecent}
                                className="text-xs text-blue-500 hover:text-blue-700"
                            >
                                Clear all
                            </button>
                        </div>
                        {recentSearches.map((term, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => handleRecentClick(term)}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700"
                            >
                                <Clock size={16} className="text-gray-400" />
                                <span className="truncate">{term}</span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

import React from 'react';

export default React.memo(SearchBar);
