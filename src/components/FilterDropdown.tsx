import React from 'react';
import type { FilterDropdownProps } from '../core/types';
import { Button, Input } from './ui/basic';

// Default dropdown components - users should override these
const DefaultDropdownMenu: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="filter-dropdown">{children}</div>
);

const DefaultDropdownMenuTrigger: React.FC<{ asChild?: boolean; children: React.ReactNode }> = ({ children }) => (
    <>{children}</>
);

const DefaultDropdownMenuContent: React.FC<{ children: React.ReactNode; align?: string; isOpen?: boolean }> = ({ children, isOpen }) => {
    if (!isOpen) return null;
    return (
        <div className="filter-dropdown__content">
            {children}
        </div>
    );
};

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
    const [searchQuery, setSearchQuery] = React.useState('');
    const dropdownRef = React.useRef<HTMLDivElement>(null);
    const searchInputRef = React.useRef<HTMLInputElement>(null);

    // Focus search input when dropdown opens
    React.useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: globalThis.MouseEvent) => {
            const target = event.target as globalThis.Node | null;
            if (dropdownRef.current && target && !dropdownRef.current.contains(target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
            setSearchQuery('');
        }
    };

    // Use provided components or defaults
    const DropdownMenu = components.DropdownMenu || DefaultDropdownMenu;
    const DropdownMenuTrigger = components.DropdownMenuTrigger || DefaultDropdownMenuTrigger;
    const DropdownMenuContent = components.DropdownMenuContent || DefaultDropdownMenuContent;
    const DropdownMenuItem = components.DropdownMenuItem || DefaultDropdownMenuItem;
    const ButtonComponent = components.Button || Button;
    const InputComponent = components.Input || Input;

    // Get filters that aren't already active
    const availableToAdd = availableFilters.filter(
        filter => !activeFilters.find(active => active.definition.key === filter.key)
    );

    // Filter based on search query
    const filteredFilters = availableToAdd.filter((filter) => {
        const query = searchQuery.toLowerCase();
        return (
            filter.label.toLowerCase().includes(query) ||
            filter.key.toLowerCase().includes(query)
        );
    });

    return (
        <div ref={dropdownRef}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <ButtonComponent
                        variant="secondary"
                        size="sm"
                        className="filter-button--add-filter"
                        onClick={() => {
                            setIsOpen(!isOpen);
                            setSearchQuery('');
                        }}
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

                <DropdownMenuContent align="start" isOpen={isOpen}>
                    {availableToAdd.length > 3 && (
                        <div className="filter-dropdown__search-container">
                            <InputComponent
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search filters..."
                                value={searchQuery}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="filter-dropdown__search-input"
                            />
                        </div>
                    )}

                    <div className="filter-dropdown__items-container">
                        {filteredFilters.length === 0 ? (
                            <div className="filter-dropdown__empty">
                                {availableToAdd.length === 0 ? 'No filters available' : 'No matching filters'}
                            </div>
                        ) : (
                            filteredFilters.map((filter) => (
                                <DropdownMenuItem
                                    key={filter.key}
                                    onClick={() => {
                                        onAddFilter(filter);
                                        setIsOpen(false);
                                        setSearchQuery('');
                                    }}
                                >
                                    <div>
                                        <div className="filter-dropdown__item-label">{filter.label}</div>
                                        {filter.category && (
                                            <div className="filter-dropdown__item-category">{filter.category}</div>
                                        )}
                                    </div>
                                </DropdownMenuItem>
                            ))
                        )}
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}