import { useLocation, useNavigate } from "react-router-dom";
import { createReactRouterAdapter, FilterToolbar, useFilterBuilder, type FilterDefinition } from "../../../../src";
import { useMemo } from "react";

// Sample data for testing
const sampleData = [
    { id: 1, name: 'John Doe', department: 'Engineering', status: 'Active', salary: 75000, joinDate: '2022-01-15' },
    { id: 2, name: 'Jane Smith', department: 'Marketing', status: 'Active', salary: 65000, joinDate: '2021-08-20' },
    { id: 3, name: 'Bob Johnson', department: 'Engineering', status: 'Inactive', salary: 80000, joinDate: '2020-03-10' },
    { id: 4, name: 'Alice Brown', department: 'Sales', status: 'Active', salary: 55000, joinDate: '2023-02-28' },
    { id: 5, name: 'Charlie Wilson', department: 'HR', status: 'Active', salary: 60000, joinDate: '2021-11-05' },
    { id: 6, name: 'Diana Prince', department: 'Engineering', status: 'Active', salary: 95000, joinDate: '2019-07-12' },
    { id: 7, name: 'Ethan Hunt', department: 'Security', status: 'Active', salary: 70000, joinDate: '2022-06-18' },
    { id: 8, name: 'Fiona Green', department: 'Marketing', status: 'Inactive', salary: 58000, joinDate: '2020-09-22' },
]

function FilterPage() {
    // Define filter configuration
    const availableFilters: FilterDefinition[] = [
        {
            key: 'department',
            type: 'select',
            label: 'Department',
            category: 'basic',
            options: [
                { value: 'Engineering', label: 'Engineering' },
                { value: 'Marketing', label: 'Marketing' },
                { value: 'Sales', label: 'Sales' },
                { value: 'HR', label: 'HR' },
                { value: 'Security', label: 'Security' },
            ],
        },
        {
            key: 'status',
            type: 'select',
            label: 'Status',
            category: 'basic',
            options: [
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' },
            ],
        },
        {
            key: 'salary',
            type: 'number-range',
            label: 'Salary Range',
            category: 'numbers',
        },
        {
            key: 'name',
            type: 'text',
            label: 'Name',
            category: 'basic',
        },
        {
            key: 'joinDate',
            type: 'date',
            label: 'Join Date',
            category: 'dates',
        },
    ];

    const navigate = useNavigate();
    const location = useLocation();

    const persistenceAdapter = createReactRouterAdapter(navigate, location);

    // Use the filter builder hook
    const {
        activeFilters,
        addFilter,
        updateFilter,
        removeFilter,
        clearFilters,
        hasActiveFilters,
        query,
    } = useFilterBuilder({
        availableFilters,
        persistenceAdapter: persistenceAdapter,
    })

    // Filter the data based on active filters
    const filteredData = useMemo(() => {
        return sampleData.filter(item => {
            // Department filter
            if (query.department && item.department !== query.department) {
                return false
            }

            // Status filter
            if (query.status && item.status !== query.status) {
                return false
            }

            // Name filter (text search)
            if (query.name && typeof query.name === 'string') {
                if (!item.name.toLowerCase().includes(query.name.toLowerCase())) {
                    return false
                }
            }

            // Salary range filter
            if (query.salary && typeof query.salary === 'object' && query.salary !== null) {
                const salaryRange = query.salary as { min?: number; max?: number }
                if (salaryRange.min && item.salary < salaryRange.min) {
                    return false
                }
                if (salaryRange.max && item.salary > salaryRange.max) {
                    return false
                }
            }

            // Join date filter
            if (query.joinDate) {
                const filterDate = new Date(query.joinDate as string)
                const itemDate = new Date(item.joinDate)
                if (itemDate.toDateString() !== filterDate.toDateString()) {
                    return false
                }
            }

            return true
        })
    }, [query])

    return (
        <div className="app">
            <h1>Filter Toolbar Test Application</h1>

            <div className="filter-section">
                <h2>Filter Controls</h2>
                <FilterToolbar
                    availableFilters={availableFilters}
                    activeFilters={activeFilters}
                    onAddFilter={addFilter}
                    onUpdateFilter={updateFilter}
                    onRemoveFilter={removeFilter}
                    onClearAll={clearFilters}
                    hasActiveFilters={hasActiveFilters}
                />
            </div>

            <div className="results-section">
                <h2>Results ({filteredData.length} of {sampleData.length})</h2>

                {filteredData.length === 0 ? (
                    <p className="no-results">No results found. Try adjusting your filters.</p>
                ) : (
                    <div className="data-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Department</th>
                                    <th>Status</th>
                                    <th>Salary</th>
                                    <th>Join Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{item.name}</td>
                                        <td>{item.department}</td>
                                        <td>
                                            <span className={`status ${item.status.toLowerCase()}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td>${item.salary.toLocaleString()}</td>
                                        <td>{item.joinDate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="debug-section">
                <h3>Debug Information</h3>
                <div className="debug-info">
                    <h4>Active Filters:</h4>
                    <pre>{JSON.stringify(activeFilters, null, 2)}</pre>

                    <h4>Generated Query:</h4>
                    <pre>{JSON.stringify(query, null, 2)}</pre>
                </div>
            </div>
        </div>
    )
}

export default FilterPage;