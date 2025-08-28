# @clywell/filter-toolbar

A flexible and powerful React filter system with framework adapters for Next.js, React Router, and more. Build dynamic, persistent filter interfaces with minimal configuration.

## Features

- 🚀 **Framework Agnostic** - Works with Next.js, React Router, or any routing solution
- 💾 **Persistent Filters** - URL params, localStorage, or custom persistence adapters
- 🎨 **Customizable UI** - Bring your own components or use the defaults
- 📱 **Mobile Responsive** - Automatic mobile/desktop layout switching
- 🔍 **Rich Filter Types** - Text, select, date ranges, number ranges, lookups, and more
- 🎯 **TypeScript First** - Full type safety and IntelliSense support
- 🌳 **Tree Shakeable** - Import only what you need

## Installation

```bash
npm install @clywell/filter-toolbar
# or
yarn add @clywell/filter-toolbar
# or
pnpm add @clywell/filter-toolbar
```

## Quick Start

### Basic Usage (Next.js)

```tsx
import React from 'react';
import { 
  useFilterBuilder, 
  FilterToolbar, 
  createNextJSAdapter,
  type FilterDefinition 
} from '@clywell/filter-toolbar';

// Optional: Import default styles
import '@clywell/filter-toolbar/dist/styles.css';

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

export function MyComponent() {
  const filterBuilder = useFilterBuilder({
    availableFilters,
    persistenceAdapter: createNextJSAdapter(),
    onQueryChange: (query) => {
      console.log('Filter query changed:', query);
      // Use query to fetch filtered data
    }
  });

  return (
    <div>
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
      <div>
        <pre>{JSON.stringify(filterBuilder.query, null, 2)}</pre>
      </div>
    </div>
  );
}
```

### React Router Usage

```tsx
import { useNavigate, useLocation } from 'react-router-dom';
import { createReactRouterAdapter } from '@clywell/filter-toolbar';

export function MyComponent() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const persistenceAdapter = createReactRouterAdapter(navigate, location);

  const filterBuilder = useFilterBuilder({
    availableFilters,
    persistenceAdapter,
    onQueryChange: (query) => {
      // Handle query changes
    }
  });

  // ... rest of component
}
```

### Memory/LocalStorage Usage

```tsx
import { createLocalStorageAdapter, createMemoryAdapter } from '@clywell/filter-toolbar';

// For localStorage persistence
const persistenceAdapter = createLocalStorageAdapter('my-filters');

// For in-memory only (useful for testing)
const persistenceAdapter = createMemoryAdapter();

const filterBuilder = useFilterBuilder({
  availableFilters,
  persistenceAdapter,
  onQueryChange: (query) => {
    // Handle query changes
  }
});
```

## Styling

The package is **completely styling-agnostic** - no CSS framework dependencies!

### Option 1: Use Default Styles
```tsx
// Import the default CSS variables-based styles
import '@clywell/filter-toolbar/dist/styles.css';
```

### Option 2: Customize with CSS Variables
```css
:root {
  /* Customize any aspect */
  --filter-primary: #your-brand-color;
  --filter-spacing-sm: 0.75rem;
  --filter-radius-md: 0.75rem;
}
```

### Option 3: Complete Custom Styling
```css
/* Target semantic class names */
.filter-button { /* your styles */ }
.filter-dropdown__content { /* your styles */ }
.filter-chip { /* your styles */ }
```

### Option 4: Component Override
```tsx
<FilterToolbar
  components={{
    Button: MyCustomButton,
    Badge: MyCustomBadge,
    // Override any component
  }}
  // ... other props
/>
```

**See [STYLING.md](./STYLING.md) for complete customization guide.**

## Filter Types

### Text Filter
```tsx
{
  key: 'search',
  label: 'Search',
  type: 'text'
}
```

### Select Filter
```tsx
{
  key: 'status',
  label: 'Status',
  type: 'select',
  options: [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ]
}
```

### Multi-Select Filter
```tsx
{
  key: 'categories',
  label: 'Categories',
  type: 'multi-select',
  options: [
    { value: 'tech', label: 'Technology' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' }
  ]
}
```

### Date Filter
```tsx
{
  key: 'createdDate',
  label: 'Created Date',
  type: 'date'
}
```

### Date Range Filter
```tsx
{
  key: 'dateRange',
  label: 'Date Range',
  type: 'date-range'
}
```

### Number Filter
```tsx
{
  key: 'price',
  label: 'Price',
  type: 'number'
}
```

### Number Range Filter
```tsx
{
  key: 'priceRange',
  label: 'Price Range',
  type: 'number-range'
}
```

### Boolean Filter
```tsx
{
  key: 'isActive',
  label: 'Is Active',
  type: 'boolean'
}
```

### Custom Lookup Filter
```tsx
{
  key: 'userId',
  label: 'User',
  type: 'lookup',
  lookupKey: 'users' // Your custom lookup key
}
```

## Custom Components

You can override any UI component by passing them through the `components` prop:

```tsx
import { Button, Sheet, SheetContent } from '@/components/ui';

<FilterToolbar
  // ... other props
  components={{
    Button: Button,
    Sheet: Sheet,
    SheetContent: SheetContent,
    // ... other component overrides
  }}
/>
```

### Available Component Overrides

- `Button` - All buttons in the interface
- `Sheet`, `SheetContent`, `SheetHeader`, `SheetTitle`, `SheetTrigger` - Mobile sheet components
- `Input` - Text inputs
- `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue` - Select dropdowns
- `Badge` - Filter chips
- `Popover`, `PopoverContent`, `PopoverTrigger` - Popup overlays
- `Calendar` - Date pickers
- `Switch` - Boolean toggles
- `DropdownMenu`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuTrigger` - Dropdown menus

## Custom Lookup Function

Provide your own lookup function for dynamic data:

```tsx
const lookupFunction = async (key: string) => {
  switch (key) {
    case 'users':
      const users = await fetchUsers();
      return users.map(user => ({
        value: user.id,
        label: user.name
      }));
    case 'categories':
      const categories = await fetchCategories();
      return categories.map(cat => ({
        value: cat.id,
        label: cat.name
      }));
    default:
      return [];
  }
};

const filterBuilder = useFilterBuilder({
  availableFilters,
  lookupFunction,
  persistenceAdapter,
  onQueryChange: (query) => {
    // Handle query changes
  }
});
```

## Creating Custom Persistence Adapters

You can create your own persistence adapter by implementing the `PersistenceAdapter` interface:

```tsx
import type { PersistenceAdapter } from '@clywell/filter-toolbar';

const customAdapter: PersistenceAdapter = {
  saveFilters: (filters) => {
    // Save filters to your preferred storage
    localStorage.setItem('filters', JSON.stringify(filters));
  },
  
  loadFilters: (availableFilters) => {
    // Load filters from your storage
    const saved = localStorage.getItem('filters');
    if (saved) {
      return JSON.parse(saved);
    }
    return [];
  },
  
  clearFilters: () => {
    // Clear filters from your storage
    localStorage.removeItem('filters');
  }
};
```

## API Reference

### `useFilterBuilder(options)`

Main hook for managing filter state.

#### Options
- `availableFilters: FilterDefinition[]` - Array of available filter definitions
- `onQueryChange?: (query: FilterQuery) => void` - Callback when filter query changes
- `initialFilters?: ActiveFilter[]` - Initial filters to set
- `persistenceAdapter?: PersistenceAdapter` - Adapter for filter persistence
- `lookupFunction?: LookupFunction` - Function for resolving lookup data

#### Returns
- `activeFilters: ActiveFilter[]` - Currently active filters
- `isBuilderOpen: boolean` - Whether the filter builder is open
- `setIsBuilderOpen: (open: boolean) => void` - Toggle filter builder
- `addFilter: (definition: FilterDefinition) => void` - Add a new filter
- `updateFilter: (filterId: string, value: unknown) => void` - Update filter value
- `removeFilter: (filterId: string) => void` - Remove a filter
- `clearFilters: () => void` - Clear all filters
- `hasActiveFilters: boolean` - Whether there are active filters
- `query: FilterQuery` - Current filter query object

### `FilterToolbar`

Main filter toolbar component.

#### Props
- `availableFilters: FilterDefinition[]` - Available filters
- `activeFilters: ActiveFilter[]` - Active filters
- `onAddFilter: (definition: FilterDefinition) => void` - Add filter handler
- `onUpdateFilter: (filterId: string, value: unknown) => void` - Update filter handler
- `onRemoveFilter: (filterId: string) => void` - Remove filter handler
- `onClearAll: () => void` - Clear all filters handler
- `hasActiveFilters: boolean` - Whether there are active filters
- `className?: string` - Additional CSS classes
- `isMobile?: boolean` - Force mobile/desktop mode
- `components?: ComponentOverrides` - Custom component overrides

## Examples

Check out the `examples/` directory for complete working examples:

- `examples/nextjs/` - Next.js App Router example
- `examples/react-router/` - React Router example  
- `examples/basic/` - Basic React example with localStorage

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to our GitHub repository.

## License

MIT License - see LICENSE file for details.

## Support

- 📖 [Documentation](https://github.com/clywell/filter-toolbar)
- 🐛 [Issue Tracker](https://github.com/clywell/filter-toolbar/issues)
- 💬 [Discussions](https://github.com/clywell/filter-toolbar/discussions)