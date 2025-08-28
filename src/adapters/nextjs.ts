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
 * Next.js adapter for URL-based filter persistence
 * Requires Next.js router and searchParams
 */
export function createNextJSAdapter(
    router: { replace: (url: string, options?: { scroll?: boolean }) => void },
    pathname: string,
    searchParams: URLSearchParams
): PersistenceAdapter {

    function filtersFromUrlParams(searchParams: URLSearchParams, availableFilters: FilterDefinition[]): ActiveFilter[] {
        const filters: ActiveFilter[] = [];

        availableFilters.forEach(definition => {
            const paramValue = searchParams.get(definition.key);
            if (paramValue) {
                const decodedValue = decodeFilterValue(paramValue, definition.type);
                // Only add filter if the value is meaningful (not empty/default)
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
        const newParams = new URLSearchParams(searchParams);

        // Add current filter parameters
        filters.forEach(filter => {
            const encodedValue = encodeFilterValue(filter.value);
            if (encodedValue && isValidFilterValue(filter.value, filter.definition)) {
                newParams.set(filter.definition.key, encodedValue);
            } else {
                newParams.delete(filter.definition.key);
            }
        });

        // Clean up any filter parameters that are no longer active
        const activeKeys = new Set(filters.map(f => f.definition.key));
        Array.from(newParams.keys()).forEach(key => {
            // Check if this looks like a filter parameter that's not currently active
            if (!activeKeys.has(key) && (
                key.includes('Date') ||
                key.includes('Id') ||
                key === 'status' ||
                key.includes('Range')
            )) {
                newParams.delete(key);
            }
        });

        const newUrl = `${pathname}?${newParams.toString()}`;
        const currentUrl = `${pathname}?${searchParams.toString()}`;

        if (newUrl !== currentUrl) {
            router.replace(newUrl, { scroll: false });
        }
    }

    return {
        saveFilters: (filters: ActiveFilter[]) => {
            updateUrlWithFilters(filters);
        },

        loadFilters: (availableFilters: FilterDefinition[]) => {
            return filtersFromUrlParams(searchParams, availableFilters);
        },

        clearFilters: () => {
            const newParams = new URLSearchParams(searchParams);
            let hasChanges = false;

            // Remove all filter-related parameters
            Array.from(newParams.keys()).forEach(key => {
                if (key.includes('Date') || key.includes('Id') || key === 'status' || key.includes('Range')) {
                    newParams.delete(key);
                    hasChanges = true;
                }
            });

            if (hasChanges) {
                const newUrl = newParams.toString() ? `${pathname}?${newParams.toString()}` : pathname;
                router.replace(newUrl, { scroll: false });
            }
        }
    };
}