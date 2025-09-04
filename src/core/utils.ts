import { format } from 'date-fns';
import type {
    FilterDefinition,
    ActiveFilter,
    FilterQuery,
    DateRangeValue,
    NumberRangeValue
} from './types';

// Generate unique ID for filters
export function generateId(): string {
    return `filter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Get default value based on filter type
export function getDefaultValue(definition: FilterDefinition): unknown {
    switch (definition.type) {
        case 'text':
            return '';
        case 'select':
            return null; // Use null instead of first option to avoid scalar issues
        case 'multi-select':
            return [];
        case 'lookup':
            return definition.multiple ? [] : null;
        case 'date':
            return null;
        case 'date-range':
            return { from: undefined, to: undefined };
        case 'number':
            return '';
        case 'number-range':
            return { min: undefined, max: undefined };
        case 'boolean':
            return null; // Use null instead of false for cleaner default state
        default:
            return '';
    }
}

// Generate display value for filter chips
export function getDisplayValue(definition: FilterDefinition, value: unknown): string {
    if (!value) return '';

    switch (definition.type) {
        case 'text':
        case 'number':
            return value.toString();

        case 'select':
            const option = definition.options?.find(opt => opt.value === value);
            return option?.label || value.toString();

        case 'multi-select':
            if (Array.isArray(value) && value.length > 0) {
                if (value.length === 1) {
                    const option = definition.options?.find(opt => opt.value === value[0]);
                    return option?.label || value[0].toString();
                }
                return `${value.length} selected`;
            }
            return '';

        case 'lookup':
            if (definition.multiple && Array.isArray(value)) {
                return value.length > 0 ? `${value.length} selected` : '';
            }
            return value.toString();

        case 'boolean':
            return typeof value === 'boolean' ? (value ? 'Yes' : 'No') : '';

        case 'date':
            return value ? new Date(value as string | number | Date).toLocaleDateString() : '';

        case 'date-range':
            const dateRange = value as DateRangeValue;
            if (dateRange.from && dateRange.to) {
                return `${new Date(dateRange.from).toLocaleDateString()} - ${new Date(dateRange.to).toLocaleDateString()}`;
            } else if (dateRange.from) {
                return `From ${new Date(dateRange.from).toLocaleDateString()}`;
            } else if (dateRange.to) {
                return `Until ${new Date(dateRange.to).toLocaleDateString()}`;
            }
            return '';

        case 'number-range':
            const numberRange = value as NumberRangeValue;
            if (numberRange.min !== undefined && numberRange.max !== undefined) {
                return `${numberRange.min} - ${numberRange.max}`;
            } else if (numberRange.min !== undefined) {
                return `Min ${numberRange.min}`;
            } else if (numberRange.max !== undefined) {
                return `Max ${numberRange.max}`;
            }
            return '';

        default:
            return value.toString();
    }
}

// Check if filter value is valid (not empty/default)
export function isValidFilterValue(value: unknown, definition: FilterDefinition): boolean {
    if (value === null || value === undefined) return false;

    switch (definition.type) {
        case 'text':
        case 'number':
            return value !== '' && value !== null && value !== undefined;

        case 'select':
            return value !== '' && value !== null && value !== undefined;

        case 'multi-select':
        case 'lookup':
            if (definition.multiple) {
                return Array.isArray(value) && value.length > 0;
            }
            return value !== '' && value !== null && value !== undefined;

        case 'date':
            return value !== null && value !== undefined;

        case 'date-range':
            const dateRange = value as DateRangeValue;
            return dateRange.from !== undefined || dateRange.to !== undefined;

        case 'number-range':
            const numberRange = value as NumberRangeValue;
            return numberRange.min !== undefined || numberRange.max !== undefined;

        case 'boolean':
            return true; // Boolean is always valid

        default:
            return false;
    }
}

// Convert filters to query object for backend
export function buildQueryFromFilters(filters: ActiveFilter[]): FilterQuery {
    const query: FilterQuery = {};

    filters.forEach(filter => {
        if (isValidFilterValue(filter.value, filter.definition)) {
            const key = filter.definition.key;
            let queryValue = filter.value;

            // Special handling for different filter types
            switch (filter.definition.type) {
                case 'date-range':
                    // Return an object with from and to properties
                    if (filter.value) {
                        const dateRange = filter.value as DateRangeValue;
                        const rangeValue: { from?: string; to?: string } = {};
                        if (dateRange.from) {
                            rangeValue.from = formatDateOnly(dateRange.from);
                        }
                        if (dateRange.to) {
                            rangeValue.to = formatDateOnly(dateRange.to);
                        }
                        // Only set the key if we have at least one value
                        if (Object.keys(rangeValue).length > 0) {
                            query[key] = rangeValue;
                        }
                    }
                    return;

                case 'number-range':
                    const numberRange = filter.value as NumberRangeValue;
                    // Return an object with min and max properties
                    const rangeValue: { min?: number; max?: number } = {};
                    if (numberRange.min !== undefined) {
                        rangeValue.min = numberRange.min;
                    }
                    if (numberRange.max !== undefined) {
                        rangeValue.max = numberRange.max;
                    }
                    // Only set the key if we have at least one value
                    if (Object.keys(rangeValue).length > 0) {
                        query[key] = rangeValue;
                    }
                    return;

                case 'date':
                    if (filter.value) {
                        // Convert to yyyy-mm-dd format (date only)
                        queryValue = formatDateOnly(filter.value as string | Date);
                    }
                    break;

                case 'multi-select':
                case 'lookup':
                    if (filter.definition.multiple && Array.isArray(filter.value)) {
                        queryValue = filter.value;
                    }
                    break;
            }

            // Special handling for boolean fields that need string-to-boolean conversion
            if (key === 'refundIssued' && typeof filter.value === 'string') {
                queryValue = filter.value === 'true';
            }

            query[key] = queryValue;
        }
    });

    return query;
}

// Date formatting utilities
export function formatDateOnly(date: string | Date): string {
    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return format(dateObj, 'yyyy-MM-dd');
    } catch {
        return '';
    }
}

export function formatDateForApi(date: string | Date): string {
    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return format(dateObj, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
    } catch {
        return '';
    }
}

export function formatDateTimeForApi(date: string | Date): string {
    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return format(dateObj, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
    } catch {
        return '';
    }
}

// Encoding/Decoding utilities for persistence
export function encodeFilterValue(value: unknown): string {
    if (value === null || value === undefined) return '';

    if (typeof value === 'object') {
        // Handle date ranges
        if (value && typeof value === 'object' && 'from' in value && 'to' in value) {
            const range = value as DateRangeValue;
            const from = range.from ? (range.from instanceof Date ? formatDateOnly(range.from) : range.from) : '';
            const to = range.to ? (range.to instanceof Date ? formatDateOnly(range.to) : range.to) : '';
            return `${from}|${to}`;
        }

        // Handle number ranges
        if (value && typeof value === 'object' && 'min' in value && 'max' in value) {
            const range = value as NumberRangeValue;
            return `${range.min || ''}|${range.max || ''}`;
        }

        // Handle arrays (multi-select)
        if (Array.isArray(value)) {
            return value.join(',');
        }

        return JSON.stringify(value);
    }

    return String(value);
}

export function decodeFilterValue(encodedValue: string, filterType: string): unknown {
    if (!encodedValue) return getDefaultValueByType(filterType);

    switch (filterType) {
        case 'date-range':
            const [from, to] = encodedValue.split('|');
            return {
                from: from ? new Date(from) : undefined,
                to: to ? new Date(to) : undefined
            };

        case 'number-range':
            const [min, max] = encodedValue.split('|');
            return {
                min: min ? Number(min) : undefined,
                max: max ? Number(max) : undefined
            };

        case 'multi-select':
        case 'lookup':
            return encodedValue.split(',').filter(Boolean);

        case 'boolean':
            return encodedValue === 'true';

        case 'number':
            return Number(encodedValue) || '';

        case 'date':
            return encodedValue ? new Date(encodedValue) : null;

        default:
            return encodedValue;
    }
}

function getDefaultValueByType(filterType: string): unknown {
    switch (filterType) {
        case 'text':
            return '';
        case 'select':
            return null;
        case 'multi-select':
        case 'lookup':
            return [];
        case 'date':
            return null;
        case 'date-range':
            return { from: undefined, to: undefined };
        case 'number':
            return '';
        case 'number-range':
            return { min: undefined, max: undefined };
        case 'boolean':
            return null;
        default:
            return '';
    }
}

// Utility to combine class names (basic implementation)
export function cn(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ');
}