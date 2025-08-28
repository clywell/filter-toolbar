'use client';

import React from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import {
    useFilterBuilder,
    FilterToolbar,
    createNextJSAdapter,
    type FilterDefinition
} from '@clywell/filter-toolbar';

// Example filter definitions
const availableFilters: FilterDefinition[] = [
    {
        key: 'status',
        label: 'Status',
        type: 'select',
        category: 'basic',
        options: [
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
            { value: 'pending', label: 'Pending' }
        ]
    },
    {
        key: 'name',
        label: 'Name',
        type: 'text',
        category: 'basic'
    },
    {
        key: 'category',
        label: 'Category',
        type: 'multi-select',
        category: 'relationships',
        options: [
            { value: 'tech', label: 'Technology' },
            { value: 'design', label: 'Design' },
            { value: 'marketing', label: 'Marketing' },
            { value: 'sales', label: 'Sales' }
        ]
    },
    {
        key: 'dateRange',
        label: 'Date Range',
        type: 'date-range',
        category: 'dates'
    },
    {
        key: 'price',
        label: 'Price Range',
        type: 'number-range',
        category: 'numbers'
    },
    {
        key: 'isActive',
        label: 'Is Active',
        type: 'boolean',
        category: 'basic'
    }
];

// Mock data for demonstration
const mockData = [
    { id: 1, name: 'Product A', status: 'active', category: 'tech', price: 100, createdAt: '2024-01-15' },
    { id: 2, name: 'Product B', status: 'inactive', category: 'design', price: 200, createdAt: '2024-02-15' },
    { id: 3, name: 'Product C', status: 'pending', category: 'marketing', price: 150, createdAt: '2024-03-15' },
    // Add more mock data as needed
];

export default function FilterExample() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Create persistence adapter for Next.js
    const persistenceAdapter = createNextJSAdapter(
        router,
        pathname,
        searchParams
    );

    // Set up filter builder
    const filterBuilder = useFilterBuilder({
        availableFilters,
        persistenceAdapter,
        onQueryChange: (query) => {
            console.log('Filter query changed:', query);
            // Here you would typically update your data fetching
            // For example, call an API with the new query parameters
        }
    });

    // Filter the mock data based on active filters
    const filteredData = React.useMemo(() => {
        let filtered = [...mockData];

        filterBuilder.activeFilters.forEach(filter => {
            const { key, type } = filter.definition;
            const value = filter.value;

            switch (key) {
                case 'status':
                    if (value) {
                        filtered = filtered.filter(item => item.status === value);
                    }
                    break;
                case 'name':
                    if (value && typeof value === 'string') {
                        filtered = filtered.filter(item =>
                            item.name.toLowerCase().includes(value.toLowerCase())
                        );
                    }
                    break;
                case 'category':
                    if (Array.isArray(value) && value.length > 0) {
                        filtered = filtered.filter(item => value.includes(item.category));
                    }
                    break;
                case 'price':
                    if (value && typeof value === 'object' && 'min' in value && 'max' in value) {
                        const range = value as { min?: number; max?: number };
                        if (range.min !== undefined) {
                            filtered = filtered.filter(item => item.price >= range.min!);
                        }
                        if (range.max !== undefined) {
                            filtered = filtered.filter(item => item.price <= range.max!);
                        }
                    }
                    break;
                // Add more filter logic as needed
            }
        });

        return filtered;
    }, [filterBuilder.activeFilters]);

    return (
        <div className="container mx-auto py-8 space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2">Filter Toolbar Example</h1>
                <p className="text-gray-600">
                    This example demonstrates the filter toolbar with Next.js App Router integration.
                    Filters are persisted in the URL and survive page refreshes.
                </p>
            </div>

            {/* Filter Toolbar */}
            <div className="bg-white p-6 rounded-lg border">
                <h2 className="text-lg font-semibold mb-4">Filters</h2>
                <FilterToolbar
                    availableFilters={availableFilters}
                    activeFilters={filterBuilder.activeFilters}
                    onAddFilter={filterBuilder.addFilter}
                    onUpdateFilter={filterBuilder.updateFilter}
                    onRemoveFilter={filterBuilder.removeFilter}
                    onClearAll={filterBuilder.clearFilters}
                    hasActiveFilters={filterBuilder.hasActiveFilters}
                />
            </div>

            {/* Current Query Display */}
            {filterBuilder.hasActiveFilters && (
                <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Current Filter Query:</h3>
                    <pre className="text-sm bg-white p-3 rounded border overflow-x-auto">
                        {JSON.stringify(filterBuilder.query, null, 2)}
                    </pre>
                </div>
            )}

            {/* Filtered Results */}
            <div className="bg-white p-6 rounded-lg border">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">
                        Results ({filteredData.length} items)
                    </h2>
                    {filterBuilder.hasActiveFilters && (
                        <p className="text-sm text-gray-500">
                            Showing filtered results
                        </p>
                    )}
                </div>

                {filteredData.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No items match the current filters.
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredData.map(item => (
                            <div key={item.id} className="border rounded-lg p-4">
                                <h3 className="font-medium">{item.name}</h3>
                                <p className="text-sm text-gray-600">Status: {item.status}</p>
                                <p className="text-sm text-gray-600">Category: {item.category}</p>
                                <p className="text-sm text-gray-600">Price: ${item.price}</p>
                                <p className="text-sm text-gray-600">Created: {item.createdAt}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Active Filters Summary */}
            {filterBuilder.hasActiveFilters && (
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Active Filters Summary:</h3>
                    <div className="space-y-1">
                        {filterBuilder.activeFilters.map(filter => (
                            <div key={filter.id} className="flex items-center gap-2 text-sm">
                                <span className="font-medium">{filter.definition.label}:</span>
                                <span>{filter.displayValue}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}