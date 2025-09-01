# Filter Toolbar Testing Guide

This test application provides a comprehensive test environment for the Filter Toolbar package. It demonstrates various filter types and usage patterns to help identify and fix issues.

## 🚀 Getting Started

1. **Start the development server:**
   ```bash
   cd examples/basic
   npm run dev
   ```

2. **Open in browser:**
   Navigate to http://localhost:5173/

## 🧪 Test Scenarios

### 1. Filter Types Testing
The application includes these filter types to test:

- **Text Filter**: Search by name (supports partial matching)
- **Select Filter**: Department and Status dropdowns 
- **Number Range Filter**: Salary range with min/max
- **Date Filter**: Join date filtering

### 2. Data Set
The test uses 8 sample employee records with various:
- Departments: Engineering, Marketing, Sales, HR, Security
- Statuses: Active, Inactive  
- Salary ranges: $55,000 - $95,000
- Join dates: 2019-2023

### 3. Interactive Testing

#### Basic Filter Operations
1. **Add Filters**: Click the filter dropdown to add new filters
2. **Remove Filters**: Use the X button on filter chips
3. **Clear All**: Use "Clear All" button when filters are active
4. **Edit Filters**: Click on filter chips to modify values

#### Mobile Responsiveness  
1. Resize browser window to < 768px width
2. Verify mobile sheet interface appears
3. Test filter management in mobile view

#### Filter Combinations
Test multiple filters simultaneously:
- Department = "Engineering" + Status = "Active" 
- Salary range + Date filter
- Text search + categorical filters

### 4. Expected Behaviors

#### Filtering Logic
- **Text Search**: Case-insensitive partial matching
- **Select Filters**: Exact value matching
- **Number Range**: Min/max boundary filtering  
- **Date Filter**: Exact date matching
- **Multiple Filters**: AND logic (all conditions must match)

#### UI Feedback
- Real-time results updating as filters change
- Result count display (e.g., "Results (3 of 8)")
- Debug panel showing active filters and generated query
- "No results" message when no matches found

## 🐛 Issues to Watch For

### Common Problems
1. **Import Errors**: TypeScript module resolution issues
2. **CSS Import Order**: PostCSS @import ordering warnings  
3. **Component Props**: Mismatched interface implementations
4. **State Management**: Filter state synchronization issues

### Filter-Specific Issues
1. **Number Range**: Ensure min/max validation works
2. **Date Filters**: Check date parsing and formatting
3. **Select Options**: Verify dropdown option rendering
4. **Text Search**: Test special characters and edge cases

### Performance Issues
1. **Re-rendering**: Excessive component re-renders on filter changes
2. **Memory Leaks**: Event listener cleanup
3. **Large Data Sets**: Test with more records if needed

## 📊 Debug Information

The debug panel shows:
- **Active Filters**: Current filter objects with IDs and values
- **Generated Query**: The key-value query object for backend

This helps verify:
- Filter values are correctly captured
- Query generation matches expectations  
- State updates propagate properly

## 🔧 Troubleshooting

### Build Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript compilation
npm run build
```

### CSS Issues  
- Ensure @import statements are at the top of CSS files
- Check that filter toolbar styles are loading properly
- Verify CSS class names match component implementations

### Component Issues
- Check browser console for React warnings/errors
- Verify all required props are provided to components
- Test component lifecycle (mount/unmount/updates)

## 📝 Test Results

Use this section to document findings:

### Working Features
- [ ] Basic filter adding/removing
- [ ] Text search functionality  
- [ ] Select filter dropdowns
- [ ] Number range inputs
- [ ] Date picker integration
- [ ] Mobile responsive design
- [ ] Clear all functionality
- [ ] Real-time filtering

### Issues Found
- [ ] Issue description and steps to reproduce
- [ ] Expected vs actual behavior
- [ ] Proposed fix or workaround

### Performance Notes
- [ ] Initial load time
- [ ] Filter response time
- [ ] Memory usage patterns
- [ ] Mobile performance