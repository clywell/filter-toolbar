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

// Component prop interfaces
export interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    variant?: string;
    size?: string;
    className?: string;
}

export interface SheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}

export interface SheetContentProps {
    children: React.ReactNode;
    className?: string;
}

export interface SheetHeaderProps {
    children: React.ReactNode;
}

export interface SheetTitleProps {
    children: React.ReactNode;
}

export interface SheetTriggerProps {
    children: React.ReactNode;
    asChild?: boolean;
}

export interface BadgeProps {
    children: React.ReactNode;
    variant?: string;
    className?: string;
}

export interface PopoverProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children: React.ReactNode;
}

export interface PopoverContentProps {
    children: React.ReactNode;
    align?: string;
    side?: string;
    className?: string;
}

export interface PopoverTriggerProps {
    children: React.ReactNode;
    asChild?: boolean;
}

export interface InputProps {
    value?: string | number;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    placeholder?: string;
    className?: string;
    min?: number;
    max?: number;
    step?: number;
}

export interface SelectProps {
    value?: string;
    onValueChange?: (value: string) => void;
    children: React.ReactNode;
    multiple?: boolean;
}

export interface SelectContentProps {
    children: React.ReactNode;
}

export interface SelectItemProps {
    value: string;
    children: React.ReactNode;
}

export interface SelectTriggerProps {
    children: React.ReactNode;
    className?: string;
}

export interface SelectValueProps {
    placeholder?: string;
}

export interface CalendarProps {
    mode?: string;
    selected?: Date | Date[];
    onSelect?: (date: Date | Date[] | undefined) => void;
    className?: string;
}

export interface SwitchProps {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    className?: string;
}

export interface DropdownMenuProps {
    children: React.ReactNode;
}

export interface DropdownMenuContentProps {
    children: React.ReactNode;
    align?: string;
}

export interface DropdownMenuItemProps {
    children: React.ReactNode;
    onClick?: () => void;
}

export interface DropdownMenuTriggerProps {
    children: React.ReactNode;
    asChild?: boolean;
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
        Button?: React.ComponentType<ButtonProps>;
        Sheet?: React.ComponentType<SheetProps>;
        SheetContent?: React.ComponentType<SheetContentProps>;
        SheetHeader?: React.ComponentType<SheetHeaderProps>;
        SheetTitle?: React.ComponentType<SheetTitleProps>;
        SheetTrigger?: React.ComponentType<SheetTriggerProps>;
    };
}

export interface FilterChipProps {
    filter: ActiveFilter;
    onEdit?: (newValue: unknown) => void;
    onRemove: () => void;
    compact?: boolean;
    fullWidth?: boolean;
    autoOpen?: boolean;
    isMobile?: boolean;
    // Component customization
    components?: {
        Button?: React.ComponentType<ButtonProps>;
        Badge?: React.ComponentType<BadgeProps>;
        Popover?: React.ComponentType<PopoverProps>;
        PopoverContent?: React.ComponentType<PopoverContentProps>;
        PopoverTrigger?: React.ComponentType<PopoverTriggerProps>;
        Sheet?: React.ComponentType<SheetProps>;
        SheetContent?: React.ComponentType<SheetContentProps>;
        SheetHeader?: React.ComponentType<SheetHeaderProps>;
        SheetTitle?: React.ComponentType<SheetTitleProps>;
        SheetTrigger?: React.ComponentType<SheetTriggerProps>;
    };
}

export interface FilterValueInputProps {
    filter: ActiveFilter;
    value: unknown;
    onChange: (value: unknown) => void;
    lookupFunction?: LookupFunction;
    // Component customization
    components?: {
        Input?: React.ComponentType<InputProps>;
        Select?: React.ComponentType<SelectProps>;
        SelectContent?: React.ComponentType<SelectContentProps>;
        SelectItem?: React.ComponentType<SelectItemProps>;
        SelectTrigger?: React.ComponentType<SelectTriggerProps>;
        SelectValue?: React.ComponentType<SelectValueProps>;
        Switch?: React.ComponentType<SwitchProps>;
        Calendar?: React.ComponentType<CalendarProps>;
        Popover?: React.ComponentType<PopoverProps>;
        PopoverContent?: React.ComponentType<PopoverContentProps>;
        PopoverTrigger?: React.ComponentType<PopoverTriggerProps>;
        Button?: React.ComponentType<ButtonProps>;
    };
}

export interface FilterDropdownProps {
    availableFilters: FilterDefinition[];
    activeFilters: ActiveFilter[];
    onAddFilter: (definition: FilterDefinition) => void;
    // Component customization
    components?: {
        Button?: React.ComponentType<ButtonProps>;
        Input?: React.ComponentType<InputProps>;
        DropdownMenu?: React.ComponentType<DropdownMenuProps>;
        DropdownMenuContent?: React.ComponentType<DropdownMenuContentProps>;
        DropdownMenuItem?: React.ComponentType<DropdownMenuItemProps>;
        DropdownMenuTrigger?: React.ComponentType<DropdownMenuTriggerProps>;
    };
}