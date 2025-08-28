import React from 'react';
import type { FilterDropdownProps } from '../core/types';
import { Button } from './ui/basic';

// Default dropdown components - users should override these
const DefaultDropdownMenu: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="filter-dropdown">{children}</div>
);

const DefaultDropdownMenuTrigger: React.FC<{ asChild?: boolean; children: React.ReactNode }> = ({ children }) => (
    <>{children}</>
);

const DefaultDropdownMenuContent: React.FC<{ children: React.ReactNode; align?: string }> = ({ children }) => (
    <div className="filter-dropdown__content">
        {children}
    </div>
);

const DefaultDropdownMenuItem: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({ children, onClick }) => (
    <button
        className="filter-dropdown__item"
        onClick={onClick}
    >
        {children}
    </button>
);

export function FilterDropdown({
    availableFilters,
    activeFilters,
    onAddFilter,
    components = {}
}: FilterDropdownProps) {
    const [isOpen, setIsOpen] = React.useState(false);

    // Use provided components or defaults
    const DropdownMenu = components.DropdownMenu || DefaultDropdownMenu;
    const DropdownMenuTrigger = components.DropdownMenuTrigger || DefaultDropdownMenuTrigger;
    const DropdownMenuContent = components.DropdownMenuContent || DefaultDropdownMenuContent;
    const DropdownMenuItem = components.DropdownMenuItem || DefaultDropdownMenuItem;
    const ButtonComponent = components.Button || Button;

    // Get filters that aren't already active
    const availableToAdd = availableFilters.filter(
        filter => !activeFilters.find(active => active.definition.key === filter.key)
    );

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <ButtonComponent
                    variant="secondary"
                    size="sm"
                    className="filter-button--add-filter"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span>Add Filter</span>
                    <svg
                        className="filter-dropdown__icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ height: '0.75rem', width: '0.75rem' }}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </ButtonComponent>
            </DropdownMenuTrigger>

            {isOpen && (
                <DropdownMenuContent align="start">
                    {availableToAdd.length === 0 ? (
                        <div className="filter-dropdown__empty">
                            No filters available
                        </div>
                    ) : (
                        availableToAdd.map((filter) => (
                            <DropdownMenuItem
                                key={filter.key}
                                onClick={() => {
                                    onAddFilter(filter);
                                    setIsOpen(false);
                                }}
                            >
                                <div>
                                    <div className="filter-dropdown__item-label">{filter.label}</div>
                                    {filter.category && (
                                        <div className="filter-dropdown__item-category">
                                            {filter.category}
                                        </div>
                                    )}
                                </div>
                            </DropdownMenuItem>
                        ))
                    )}
                </DropdownMenuContent>
            )}
        </DropdownMenu>
    );
}