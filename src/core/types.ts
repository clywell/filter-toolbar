import React from 'react';

// Core filter types
export interface FilterDefinition {
    key: string;
    label: string;
    type: FilterFieldType;
    category?: FilterCategory;

    // For select/multi-select with predefined options
    options?: FilterOption[];

    // For lookup integration (users provide their own lookup function)
    lookupKey?: string;
    multiple?: boolean; // For multi-select

    // Simple validation
    required?: boolean;
    permissions?: string[];
}

export interface FilterOption {
    value: string;
    label: string;
    disabled?: boolean;
}

// Simplified field types
export type FilterFieldType =
    | 'text'           // Simple text input
    | 'select'         // Single select dropdown  
    | 'multi-select'   // Multiple select dropdown
    | 'date'           // Single date picker
    | 'date-range'     // Date range picker
    | 'number'         // Number input
    | 'number-range'   // Min/Max number inputs
    | 'boolean'        // Toggle/checkbox
    | 'lookup';        // Custom lookup system

export type FilterCategory =
    | 'basic'
    | 'dates'
    | 'relationships'
    | 'numbers'
    | 'custom';

export interface ActiveFilter {
    id: string;
    definition: FilterDefinition;
    value: unknown;
    displayValue: string;
}

// Simple query object - just key-value pairs for backend
export interface FilterQuery {
    [key: string]: unknown;
}

// Date range value type (supports both Date objects and ISO strings)
export interface DateRangeValue {
    from?: Date | string;
    to?: Date | string;
}

// Number range value type
export interface NumberRangeValue {
    min?: number;
    max?: number;
}

// Lookup function type - users provide this
export type LookupFunction = (key: string) => Promise<FilterOption[]> | FilterOption[];

// Persistence adapter interface
export interface PersistenceAdapter {
    saveFilters: (filters: ActiveFilter[]) => void;
    loadFilters: (availableFilters: FilterDefinition[]) => ActiveFilter[];
    clearFilters: () => void;
}

// Hook options
export interface UseFilterBuilderOptions {
    availableFilters: FilterDefinition[];
    onQueryChange?: (query: FilterQuery) => void;
    initialFilters?: ActiveFilter[];
    persistenceAdapter?: PersistenceAdapter;
    lookupFunction?: LookupFunction;
}

export interface UseFilterBuilderReturn {
    activeFilters: ActiveFilter[];
    isBuilderOpen: boolean;
    setIsBuilderOpen: React.Dispatch<React.SetStateAction<boolean>>;
    addFilter: (definition: FilterDefinition) => void;
    updateFilter: (filterId: string, value: unknown) => void;
    removeFilter: (filterId: string) => void;
    clearFilters: () => void;
    hasActiveFilters: boolean;
    query: FilterQuery;
}

// Component props
export interface FilterBuilderProps {
    availableFilters: FilterDefinition[];
    activeFilters: ActiveFilter[];
    onAddFilter: (definition: FilterDefinition) => void;
    onUpdateFilter: (filterId: string, value: unknown) => void;
    onRemoveFilter: (filterId: string) => void;
}

export interface FilterToolbarProps {
    availableFilters: FilterDefinition[];
    activeFilters: ActiveFilter[];
    onAddFilter: (definition: FilterDefinition) => void;
    onUpdateFilter: (filterId: string, value: unknown) => void;
    onRemoveFilter: (filterId: string) => void;
    onClearAll: () => void;
    hasActiveFilters: boolean;
    className?: string;
    // Mobile behavior
    isMobile?: boolean;
    // Component customization
    components?: {
        Button?: React.ComponentType<any>;
        Sheet?: React.ComponentType<any>;
        SheetContent?: React.ComponentType<any>;
        SheetHeader?: React.ComponentType<any>;
        SheetTitle?: React.ComponentType<any>;
        SheetTrigger?: React.ComponentType<any>;
    };
}

export interface FilterChipProps {
    filter: ActiveFilter;
    onEdit?: () => void;
    onRemove: () => void;
    compact?: boolean;
    fullWidth?: boolean;
    autoOpen?: boolean;
    // Component customization
    components?: {
        Button?: React.ComponentType<any>;
        Badge?: React.ComponentType<any>;
        Popover?: React.ComponentType<any>;
        PopoverContent?: React.ComponentType<any>;
        PopoverTrigger?: React.ComponentType<any>;
    };
}

export interface FilterValueInputProps {
    filter: ActiveFilter;
    value: unknown;
    onChange: (value: unknown) => void;
    lookupFunction?: LookupFunction;
    // Component customization
    components?: {
        Input?: React.ComponentType<any>;
        Select?: React.ComponentType<any>;
        SelectContent?: React.ComponentType<any>;
        SelectItem?: React.ComponentType<any>;
        SelectTrigger?: React.ComponentType<any>;
        SelectValue?: React.ComponentType<any>;
        Switch?: React.ComponentType<any>;
        Calendar?: React.ComponentType<any>;
        Popover?: React.ComponentType<any>;
        PopoverContent?: React.ComponentType<any>;
        PopoverTrigger?: React.ComponentType<any>;
        Button?: React.ComponentType<any>;
    };
}

export interface FilterDropdownProps {
    availableFilters: FilterDefinition[];
    activeFilters: ActiveFilter[];
    onAddFilter: (definition: FilterDefinition) => void;
    // Component customization
    components?: {
        Button?: React.ComponentType<any>;
        DropdownMenu?: React.ComponentType<any>;
        DropdownMenuContent?: React.ComponentType<any>;
        DropdownMenuItem?: React.ComponentType<any>;
        DropdownMenuTrigger?: React.ComponentType<any>;
    };
}