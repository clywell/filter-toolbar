import type {
    PersistenceAdapter,
    FilterDefinition,
    ActiveFilter
} from '../core/types';
import {
    encodeFilterValue,
    decodeFilterValue,
    generateId,
    getDisplayValue,
    isValidFilterValue
} from '../core/utils';

/**
 * LocalStorage adapter for browser-based filter persistence
 */
export function createLocalStorageAdapter(storageKey: string = 'filter-toolbar-filters'): PersistenceAdapter {

    function filtersFromStorage(availableFilters: FilterDefinition[]): ActiveFilter[] {
        try {
            const stored = localStorage.getItem(storageKey);
            if (!stored) return [];

            const parsed = JSON.parse(stored);
            const filters: ActiveFilter[] = [];

            if (Array.isArray(parsed)) {
                parsed.forEach((item: any) => {
                    const definition = availableFilters.find(f => f.key === item.key);
                    if (definition) {
                        const decodedValue = decodeFilterValue(item.encodedValue, definition.type);
                        if (isValidFilterValue(decodedValue, definition)) {
                            filters.push({
                                id: generateId(),
                                definition,
                                value: decodedValue,
                                displayValue: getDisplayValue(definition, decodedValue)
                            });
                        }
                    }
                });
            }

            return filters;
        } catch (error) {
            console.warn('Failed to load filters from localStorage:', error);
            return [];
        }
    }

    return {
        saveFilters: (filters: ActiveFilter[]) => {
            try {
                const toStore = filters.map(filter => ({
                    key: filter.definition.key,
                    encodedValue: encodeFilterValue(filter.value)
                }));
                localStorage.setItem(storageKey, JSON.stringify(toStore));
            } catch (error) {
                console.warn('Failed to save filters to localStorage:', error);
            }
        },

        loadFilters: (availableFilters: FilterDefinition[]) => {
            return filtersFromStorage(availableFilters);
        },

        clearFilters: () => {
            try {
                localStorage.removeItem(storageKey);
            } catch (error) {
                console.warn('Failed to clear filters from localStorage:', error);
            }
        }
    };
}

/**
 * Memory adapter for in-memory filter persistence (useful for testing)
 */
export function createMemoryAdapter(): PersistenceAdapter {
    let memoryFilters: ActiveFilter[] = [];

    return {
        saveFilters: (filters: ActiveFilter[]) => {
            memoryFilters = [...filters];
        },

        loadFilters: (availableFilters: FilterDefinition[]) => {
            return [...memoryFilters];
        },

        clearFilters: () => {
            memoryFilters = [];
        }
    };
}