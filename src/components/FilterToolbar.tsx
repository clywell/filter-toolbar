import React from 'react';
import type { FilterToolbarProps, FilterDefinition } from '../core/types';
import { FilterDropdown } from './FilterDropdown';
import { ActiveFilterComponent } from './ActiveFilterComponent';
import { Button } from './ui/basic';

// Default mobile hook - users can override
const useIsMobile = () => {
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return isMobile;
};

// Default Sheet components - users should override these
const DefaultSheet: React.FC<{ open: boolean; onOpenChange: (open: boolean) => void; children: React.ReactNode }> =
    ({ open, children, onOpenChange: _onOpenChange }) => {
        if (!open) return null;
        return (
            <div className="filter-sheet-overlay">
                <div className="filter-sheet">
                    {children}
                </div>
            </div>
        );
    };

const DefaultSheetContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={`filter-sheet__content ${className || ''}`}>{children}</div>
);

const DefaultSheetHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={`filter-sheet__header ${className || ''}`}>{children}</div>
);

const DefaultSheetTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 className="filter-sheet__title">{children}</h3>
);

const DefaultSheetTrigger: React.FC<{ asChild?: boolean; children: React.ReactNode }> = ({ children }) => (
    <>{children}</>
);

export function FilterToolbar({
    availableFilters,
    activeFilters,
    onAddFilter,
    onUpdateFilter: _onUpdateFilter,
    onRemoveFilter,
    onClearAll,
    hasActiveFilters,
    className,
    isMobile: providedIsMobile,
    components = {}
}: FilterToolbarProps) {
    // Track which filter was just added to auto-open it
    const [lastAddedFilterId, setLastAddedFilterId] = React.useState<string | null>(null);
    const [isMobileSheetOpen, setIsMobileSheetOpen] = React.useState(false);

    const defaultIsMobile = useIsMobile();
    const isMobile = providedIsMobile ?? defaultIsMobile;

    // Use provided components or defaults
    const Sheet = components.Sheet || DefaultSheet;
    const SheetContent = components.SheetContent || DefaultSheetContent;
    const SheetHeader = components.SheetHeader || DefaultSheetHeader;
    const SheetTitle = components.SheetTitle || DefaultSheetTitle;
    const SheetTrigger = components.SheetTrigger || DefaultSheetTrigger;
    const ButtonComponent = components.Button || Button;

    // Memoize the callback functions to prevent recreation on every render
    const memoizedOnRemoveFilter = React.useCallback(onRemoveFilter, [onRemoveFilter]);

    const handleAddFilter = (definition: FilterDefinition) => {
        onAddFilter(definition);
        // Set the last added filter to auto-open (we'll identify it by key since we don't have ID yet)
        setLastAddedFilterId(definition.key);
        // Keep mobile sheet open when filter is added so users can add multiple filters
    };

    // Clear the auto-open flag after a short delay
    React.useEffect(() => {
        if (lastAddedFilterId) {
            const timer = setTimeout(() => {
                setLastAddedFilterId(null);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [lastAddedFilterId]);

    return (
        <div className={`filter-toolbar ${className || ''}`}>
            {/* Conditional rendering based on mobile state */}
            {!isMobile ? (
                // Desktop View - Inline filters
                <div className="filter-toolbar__desktop">
                    {/* Add Filter Dropdown at the top */}
                    <div className="filter-toolbar__header">
                        <FilterDropdown
                            availableFilters={availableFilters}
                            activeFilters={activeFilters}
                            onAddFilter={handleAddFilter}
                            components={components}
                        />
                        {hasActiveFilters && (
                            <ButtonComponent
                                variant="ghost"
                                size="sm"
                                onClick={onClearAll}
                                className="filter-toolbar__clear-all"
                            >
                                Clear All ({activeFilters.length})
                            </ButtonComponent>
                        )}
                    </div>

                    {/* Active Filters Grid - Desktop Only */}
                    {hasActiveFilters && (
                        <div className="filter-toolbar__filters">
                            {activeFilters.map((filter) => (
                                <ActiveFilterComponent
                                    key={filter.id}
                                    filter={filter}
                                    onEdit={() => {/* TODO: Handle edit */ }}
                                    onRemove={() => memoizedOnRemoveFilter(filter.id)}
                                    autoOpen={lastAddedFilterId === filter.definition.key}
                                    components={components}
                                />
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                // Mobile View - Sheet-based filters
                <div>
                    <Sheet open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
                        <SheetTrigger asChild>
                            <ButtonComponent
                                variant="secondary"
                                size="sm"
                                className="filter-toolbar__mobile-trigger"
                            >
                                Filters {hasActiveFilters && `(${activeFilters.length})`}
                            </ButtonComponent>
                        </SheetTrigger>
                        <SheetContent className="filter-sheet__mobile">
                            <div className="filter-sheet__content">
                                <SheetHeader className="filter-sheet__header">
                                    <SheetTitle>Filters</SheetTitle>
                                </SheetHeader>

                                <div className="filter-sheet__body">
                                    <div className="filter-sheet__sections">
                                        {/* Add Filter Section */}
                                        <div>
                                            <h4 className="filter-sheet__section-title">Add Filter</h4>
                                            <FilterDropdown
                                                availableFilters={availableFilters}
                                                activeFilters={activeFilters}
                                                onAddFilter={handleAddFilter}
                                                components={components}
                                            />
                                        </div>

                                        {/* Active Filters Section */}
                                        {hasActiveFilters && (
                                            <div>
                                                <div className="filter-sheet__section-header">
                                                    <h4 className="filter-sheet__section-title">Active Filters ({activeFilters.length})</h4>
                                                    <ButtonComponent
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={onClearAll}
                                                        className="filter-toolbar__clear-all"
                                                    >
                                                        Clear All
                                                    </ButtonComponent>
                                                </div>
                                                <div className="filter-sheet__active-filters">
                                                    {activeFilters.map((filter) => (
                                                        <div key={filter.id} className="filter-sheet__filter-item">
                                                            <ActiveFilterComponent
                                                                filter={filter}
                                                                onEdit={() => {/* TODO: Handle edit */ }}
                                                                onRemove={() => memoizedOnRemoveFilter(filter.id)}
                                                                autoOpen={lastAddedFilterId === filter.definition.key}
                                                                fullWidth={true}
                                                                components={components}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            )}
        </div>
    );
}