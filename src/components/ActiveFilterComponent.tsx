import React, { useState } from 'react';
import type { FilterChipProps } from '../core/types';
import { Button, Badge } from './ui/basic';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import { FilterValueInput } from './FilterValueInput';
import { cn } from '../core/utils';

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

export function ActiveFilterComponent({
    filter,
    onEdit,
    onRemove,
    compact = false,
    fullWidth = false,
    autoOpen = false,
    isMobile = false,
    components = {}
}: FilterChipProps) {
    const [isOpen, setIsOpen] = useState(autoOpen);

    // Use provided components or defaults
    const ButtonComponent = components.Button || Button;
    const BadgeComponent = components.Badge || Badge;
    const Sheet = components.Sheet || DefaultSheet;
    const SheetContent = components.SheetContent || DefaultSheetContent;
    const SheetHeader = components.SheetHeader || DefaultSheetHeader;
    const SheetTitle = components.SheetTitle || DefaultSheetTitle;
    const SheetTrigger = components.SheetTrigger || DefaultSheetTrigger;

    const handleValueChange = (newValue: unknown) => {
        // Update the filter value through the parent component
        if (onEdit) {
            onEdit(newValue);
        }

        // Only close popover for certain filter types where editing is "complete"
        // Keep open for text/number/range inputs to allow continued editing
        const shouldClosePopover = ['select', 'boolean'].includes(filter.definition.type);

        if (shouldClosePopover) {
            setIsOpen(false);
        }
    };

    // For mobile context inside a sheet, always use popover to avoid nested modals
    // Only use sheet when we're in the main mobile view (not inside another sheet)
    const shouldUseSheet = isMobile && !fullWidth;

    return (
        <div className={cn(
            'filter-chip',
            fullWidth && 'filter-chip--full-width'
        )}>
            {!shouldUseSheet ? (
                // Desktop View - Use Popover
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                    <PopoverTrigger asChild>
                        <BadgeComponent
                            variant="outline"
                            className={cn(
                                'filter-chip__badge',
                                fullWidth && 'filter-chip__badge--full-width',
                                compact && 'filter-chip__badge--compact'
                            )}
                        >
                            <span className="filter-chip__content">
                                <span className="filter-chip__label">{filter.definition.label}:</span>
                                <span className="filter-chip__value">
                                    {filter.displayValue || ''}
                                </span>
                            </span>
                        </BadgeComponent>
                    </PopoverTrigger>

                    <PopoverContent align="start" className="w-full">
                        <div>
                            <h4 className="text-sm font-medium mb-2">{filter.definition.label}</h4>
                            <FilterValueInput
                                filter={filter}
                                value={filter.value}
                                onChange={handleValueChange}
                                components={components}
                            />
                        </div>
                    </PopoverContent>
                </Popover>
            ) : (
                // Mobile View - Use Sheet
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <BadgeComponent
                            variant="outline"
                            className={cn(
                                'filter-chip__badge',
                                fullWidth && 'filter-chip__badge--full-width',
                                compact && 'filter-chip__badge--compact'
                            )}
                        >
                            <span className="filter-chip__content">
                                <span className="filter-chip__label">{filter.definition.label}:</span>
                                <span className="filter-chip__value">
                                    {filter.displayValue || ''}
                                </span>
                            </span>
                        </BadgeComponent>
                    </SheetTrigger>

                    <SheetContent className="filter-sheet__edit">
                        <div className="filter-sheet__content">
                            <SheetHeader className="filter-sheet__header">
                                <SheetTitle>Edit {filter.definition.label}</SheetTitle>
                            </SheetHeader>

                            <div className="filter-sheet__body">
                                <FilterValueInput
                                    filter={filter}
                                    value={filter.value}
                                    onChange={handleValueChange}
                                    components={components}
                                />
                            </div>

                            <div className="filter-sheet__actions">
                                <ButtonComponent
                                    variant="secondary"
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1"
                                >
                                    Done
                                </ButtonComponent>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            )}

            <ButtonComponent
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="filter-chip__remove"
            >
                <svg className="filter-chip__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </ButtonComponent>
        </div>
    );
}