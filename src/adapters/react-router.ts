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
 * React Router adapter for URL-based filter persistence
 * Works with React Router v6
 */
export function createReactRouterAdapter(
    navigate: (to: string, options?: { replace?: boolean }) => void,
    location: { pathname: string; search: string }
): PersistenceAdapter {

    function filtersFromUrlParams(searchParams: URLSearchParams, availableFilters: FilterDefinition[]): ActiveFilter[] {
        const filters: ActiveFilter[] = [];

        availableFilters.forEach(definition => {
            const paramValue = searchParams.get(definition.key);
            if (paramValue) {
                const decodedValue = decodeFilterValue(paramValue, definition.type);
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

        return filters;
    }

    function updateUrlWithFilters(filters: ActiveFilter[]): void {
        const searchParams = new URLSearchParams(location.search);

        // Add current filter parameters
        filters.forEach(filter => {
            const encodedValue = encodeFilterValue(filter.value);
            if (encodedValue && isValidFilterValue(filter.value, filter.definition)) {
                searchParams.set(filter.definition.key, encodedValue);
            } else {
                searchParams.delete(filter.definition.key);
            }
        });

        // Clean up any filter parameters that are no longer active
        const activeKeys = new Set(filters.map(f => f.definition.key));
        Array.from(searchParams.keys()).forEach(key => {
            if (!activeKeys.has(key) && (
                key.includes('Date') ||
                key.includes('Id') ||
                key === 'status' ||
                key.includes('Range')
            )) {
                searchParams.delete(key);
            }
        });

        const newSearch = searchParams.toString();
        const newUrl = newSearch ? `${location.pathname}?${newSearch}` : location.pathname;

        if (newUrl !== `${location.pathname}${location.search}`) {
            navigate(newUrl, { replace: true });
        }
    }

    return {
        saveFilters: (filters: ActiveFilter[]) => {
            updateUrlWithFilters(filters);
        },

        loadFilters: (availableFilters: FilterDefinition[]) => {
            const searchParams = new URLSearchParams(location.search);
            return filtersFromUrlParams(searchParams, availableFilters);
        },

        clearFilters: () => {
            const searchParams = new URLSearchParams(location.search);
            let hasChanges = false;

            Array.from(searchParams.keys()).forEach(key => {
                if (key.includes('Date') || key.includes('Id') || key === 'status' || key.includes('Range')) {
                    searchParams.delete(key);
                    hasChanges = true;
                }
            });

            if (hasChanges) {
                const newSearch = searchParams.toString();
                const newUrl = newSearch ? `${location.pathname}?${newSearch}` : location.pathname;
                navigate(newUrl, { replace: true });
            }
        }
    };
}