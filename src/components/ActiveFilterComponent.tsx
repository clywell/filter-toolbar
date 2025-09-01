import { useState } from 'react';
import type { FilterChipProps } from '../core/types';
import { Button, Badge } from './ui/basic';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import { FilterValueInput } from './FilterValueInput';
import { cn } from '../core/utils';

export function ActiveFilterComponent({
    filter,
    onEdit,
    onRemove,
    compact = false,
    fullWidth = false,
    autoOpen = false,
    components = {}
}: FilterChipProps) {
    const [isOpen, setIsOpen] = useState(autoOpen);

    // Use provided components or defaults
    const ButtonComponent = components.Button || Button;
    const BadgeComponent = components.Badge || Badge;

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

    return (
        <div className={cn(
            'filter-chip',
            fullWidth && 'filter-chip--full-width'
        )}>
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