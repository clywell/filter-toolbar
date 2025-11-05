# Changelog

## [1.1.0] - 2025-11-05

### Added
- **Typeahead/Autocomplete Feature** for faster filter and option selection
  - Search input automatically appears in "Add Filter" dropdown when >3 filters available
  - Search input automatically appears in select/multi-select when >5 options available
  - Real-time filtering as users type
  - Case-insensitive partial matching across filter labels, keys, and option values
  - Keyboard support (Escape to close and clear search)
  - Auto-focus search input on dropdown open for better UX
  - Empty state messaging for better user feedback
- New CSS classes for typeahead styling:
  - `.filter-dropdown__search-container`, `.filter-dropdown__search-input`, `.filter-dropdown__items-container`
  - `.filter-select-container`, `.filter-select__search*`, `.filter-select__empty`
  - `.filter-multi-select-container`, `.filter-multi-select__search*`, `.filter-multi-select__empty`
- Updated `FilterDropdownProps` to include optional `Input` component override for custom search inputs

### Changed
- Enhanced `FilterDropdown` component with intelligent search functionality
- Enhanced `FilterValueInput` component with search for select/multi-select filters
- Improved dropdown UX with threshold-based search visibility (appears only when needed)

### Technical Details
- Zero breaking changes - fully backward compatible
- Client-side filtering optimized for lists up to 5,000 items
- Minimal bundle size impact (~150 bytes)
- Full TypeScript support with proper type definitions


## [1.0.0] - 2025-08-28

### Added
- Initial release of @clywell/filter-toolbar
- Core `useFilterBuilder` hook with framework-agnostic design
- `FilterToolbar` component with mobile/desktop responsive design
- Multiple persistence adapters:
  - Next.js adapter for URL-based persistence
  - React Router adapter for URL-based persistence
  - LocalStorage adapter for browser storage
  - Memory adapter for testing
- Support for multiple filter types:
  - Text filters
  - Select/multi-select filters
  - Date and date range filters
  - Number and number range filters
  - Boolean filters
  - Custom lookup filters
- Full TypeScript support with comprehensive type definitions
- Customizable UI components through component override system
- Comprehensive documentation and examples
- Tree-shakeable package structure
- Mobile-responsive filter interface with sheet-based mobile view

### Features
- Framework-agnostic core with adapters for popular routing solutions
- Persistent filter state across page reloads and navigation
- Automatic encoding/decoding of complex filter values
- Support for custom lookup functions
- Built-in validation and error handling
- Accessible keyboard navigation
- RTL language support ready
- Performance optimized with React hooks best practices