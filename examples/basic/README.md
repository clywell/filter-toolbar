# Basic React Example

This example demonstrates how to use `@clywell/filter-toolbar` in a basic React application with localStorage persistence.

## Features Demonstrated

- ✅ Multiple filter types (text, select, date range, number range)
- ✅ LocalStorage persistence
- ✅ Custom styling with CSS variables
- ✅ Simulated data filtering
- ✅ Mobile responsive design

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Open in browser**
   Navigate to `http://localhost:5173`

## Project Structure

```
src/
├── App.tsx          # Main application component
├── index.tsx        # React DOM entry point
├── data.ts          # Mock data
└── styles.css       # Custom styling
```

## Key Implementation Details

### Filter Setup
```tsx
const availableFilters: FilterDefinition[] = [
  {
    key: 'search',
    label: 'Search',
    type: 'text'
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' }
    ]
  }
  // ... more filters
];
```

### Persistence
```tsx
const persistenceAdapter = createLocalStorageAdapter('example-filters');
```

### Data Filtering
The example shows how to apply filters to your data:

```tsx
const filteredData = useMemo(() => {
  return applyFilters(mockData, filterBuilder.query);
}, [filterBuilder.query]);
```

## Customization

The example includes custom CSS variables to demonstrate styling:

```css
:root {
  --filter-primary: #2563eb;
  --filter-border: #e5e7eb;
  --filter-radius-md: 0.75rem;
}
```

## Learn More

- [Main Documentation](../../README.md)
- [Styling Guide](../../STYLING.md)
- [API Reference](../../README.md#api-reference)