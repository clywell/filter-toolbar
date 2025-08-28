import React from 'react';
import type { FilterChipProps } from '../core/types';
import { Button, Badge } from './ui/basic';
import { cn } from '../core/utils';

export function ActiveFilterComponent({
    filter,
    onEdit,
    onRemove,
    compact = false,
    fullWidth = false,
    components = {}
}: FilterChipProps) {
    // Use provided components or defaults
    const ButtonComponent = components.Button || Button;
    const BadgeComponent = components.Badge || Badge;

    const handleEditClick = () => {
        if (onEdit) {
            onEdit();
        }
    };

    return (
        <div className={cn(
            'filter-chip',
            fullWidth && 'filter-chip--full-width'
        )}>
            <BadgeComponent
                variant="outline"
                className={cn(
                    'filter-chip__badge',
                    fullWidth && 'filter-chip__badge--full-width',
                    compact && 'filter-chip__badge--compact'
                )}
                onClick={handleEditClick}
            >
                <span className="filter-chip__content">
                    <span className="filter-chip__label">{filter.definition.label}:</span>
                    <span className="filter-chip__value">{filter.displayValue}</span>
                </span>
            </BadgeComponent>

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