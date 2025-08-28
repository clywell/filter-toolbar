import React from 'react';
import {
    useFilterBuilder,
    FilterToolbar,
    createNextJSAdapter,
    type FilterDefinition
} from '@clywell/filter-toolbar';

// Import default styles (optional)
import '@clywell/filter-toolbar/dist/styles.css';

// Optional: Import your custom CSS to override variables
import './custom-filter-styles.css';

const availableFilters: FilterDefinition[] = [
    {
        key: 'status',
        label: 'Status',
        type: 'select',
        options: [
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' }
        ]
    },
    {
        key: 'name',
        label: 'Name',
        type: 'text'
    },
    {
        key: 'dateRange',
        label: 'Date Range',
        type: 'date-range'
    }
];

export function ExampleWithStyling() {
    const filterBuilder = useFilterBuilder({
        availableFilters,
        persistenceAdapter: createNextJSAdapter(),
        onQueryChange: (query) => {
            console.log('Filter query changed:', query);
            // Use query to fetch filtered data
        }
    });

    return (
        <div className="example-container">
            <h2>Filter Toolbar Example</h2>

            {/* The FilterToolbar will use your CSS variables for styling */}
            <FilterToolbar
                availableFilters={availableFilters}
                activeFilters={filterBuilder.activeFilters}
                onAddFilter={filterBuilder.addFilter}
                onUpdateFilter={filterBuilder.updateFilter}
                onRemoveFilter={filterBuilder.removeFilter}
                onClearAll={filterBuilder.clearFilters}
                hasActiveFilters={filterBuilder.hasActiveFilters}
            />

            {/* Your filtered content here */}
            <div className="results">
                <h3>Current Filters:</h3>
                <pre>{JSON.stringify(filterBuilder.query, null, 2)}</pre>
            </div>
        </div>
    );
}