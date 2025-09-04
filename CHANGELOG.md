# Changelog

## [0.0.4] - 2025-09-04

### Added
- Version 0.0.4 release


## [0.0.3] - 2025-09-01

### Added
- Version 0.0.3 release


## [0.0.2] - 2025-08-29

### Added
- Version 0.0.2 release


## [1.0.1] - 2025-08-29

### Added
- Version 1.0.1 release


All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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