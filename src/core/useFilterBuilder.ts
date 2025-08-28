import { useState, useEffect, useCallback, useMemo } from 'react';
import type {
    FilterDefinition,
    ActiveFilter,
    UseFilterBuilderOptions,
    UseFilterBuilderReturn
} from './types';
import {
    generateId,
    getDefaultValue,
    getDisplayValue,
    buildQueryFromFilters
} from './utils';

/**
 * Framework-agnostic filter builder hook
 * Uses adapters for different persistence strategies (URL, localStorage, etc.)
 */
export function useFilterBuilder(options: UseFilterBuilderOptions): UseFilterBuilderReturn {
    const {
        availableFilters,
        onQueryChange,
        initialFilters = [],
        persistenceAdapter,
        lookupFunction: _lookupFunction
    } = options;

    // Initialize filters with persistence
    const initializeFilters = useCallback((): ActiveFilter[] => {
        // Priority 1: Persistence adapter (URL params, localStorage, etc.)
        if (persistenceAdapter) {
            try {
                const persistedFilters = persistenceAdapter.loadFilters(availableFilters);
                if (persistedFilters.length > 0) {
                    return persistedFilters;
                }
            } catch (_error) {
                // Failed to load persisted filters, fall back to initial filters
            }
        }

        // Priority 2: Initial filters passed via props
        return initialFilters;
    }, [persistenceAdapter, availableFilters, initialFilters]);

    const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>(initializeFilters);
    const [isBuilderOpen, setIsBuilderOpen] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize filters on mount (client-side only)
    useEffect(() => {
        if (!isInitialized) {
            const initialFilters = initializeFilters();
            setActiveFilters(initialFilters);
            setIsInitialized(true);
        }
    }, [initializeFilters, isInitialized]);

    // Sync filters to persistence when they change
    useEffect(() => {
        if (!persistenceAdapter || !isInitialized) return;

        try {
            if (activeFilters.length > 0) {
                persistenceAdapter.saveFilters(activeFilters);
            } else {
                persistenceAdapter.clearFilters();
            }
        } catch (_error) {
            // Failed to persist filters - continue silently
        }
    }, [activeFilters, persistenceAdapter, isInitialized]);

    // Add a new filter
    const addFilter = useCallback((definition: FilterDefinition) => {
        setActiveFilters(prev => {
            // Don't add if already exists
            if (prev.find(f => f.definition.key === definition.key)) return prev;

            const defaultValue = getDefaultValue(definition);
            const newFilter: ActiveFilter = {
                id: generateId(),
                definition,
                value: defaultValue,
                displayValue: getDisplayValue(definition, defaultValue)
            };

            return [...prev, newFilter];
        });
    }, []);

    // Update filter value
    const updateFilter = useCallback((filterId: string, value: unknown) => {
        setActiveFilters(prev => prev.map(filter =>
            filter.id === filterId
                ? {
                    ...filter,
                    value,
                    displayValue: getDisplayValue(filter.definition, value)
                }
                : filter
        ));
    }, []);

    // Remove a filter
    const removeFilter = useCallback((filterId: string) => {
        setActiveFilters(prev => prev.filter(filter => filter.id !== filterId));
    }, []);

    // Clear all filters
    const clearFilters = useCallback(() => {
        setActiveFilters([]);
    }, []);

    // Build query for backend
    const query = useMemo(() => buildQueryFromFilters(activeFilters), [activeFilters]);

    // Notify parent when query changes
    useEffect(() => {
        onQueryChange?.(query);
    }, [query, onQueryChange]);

    return {
        activeFilters,
        isBuilderOpen,
        setIsBuilderOpen,
        addFilter,
        updateFilter,
        removeFilter,
        clearFilters,
        hasActiveFilters: activeFilters.length > 0,
        query
    };
}