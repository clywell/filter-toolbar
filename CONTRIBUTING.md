# Contributing to @clywell/filter-toolbar

Thank you for your interest in contributing! This document outlines the process for contributing to this project.

## Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/clywell/filter-toolbar.git
   cd filter-toolbar
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development**
   ```bash
   npm run dev  # Watch mode for development
   ```

4. **Run checks**
   ```bash
   npm run type-check  # TypeScript checking
   npm run lint        # ESLint
   npm run build       # Build the package
   ```

## Project Structure

```
src/
├── core/           # Framework-agnostic core logic
├── components/     # React UI components  
├── adapters/       # Framework-specific adapters
└── styles.css      # Default CSS variables

examples/           # Usage examples
.github/workflows/  # CI/CD automation
```

## Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow existing code patterns and naming conventions
- Use semantic commit messages (conventional commits)

### Commit Messages
```
feat: add new filter type
fix: resolve dropdown positioning issue  
docs: update styling guide
chore: bump dependencies
```

### CSS Guidelines
- Use CSS custom properties (variables) for all styling values
- Follow BEM methodology for class names
- Maintain semantic class names that describe function, not appearance

## Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the coding guidelines
   - Add/update documentation as needed
   - Ensure all checks pass

3. **Test your changes**
   ```bash
   npm run type-check
   npm run lint  
   npm run build
   ```

4. **Submit a pull request**
   - Use a descriptive title
   - Include a detailed description of changes
   - Reference any related issues

## Release Process

Releases are automated through GitHub Actions:

1. **Create a release** using the GitHub Actions workflow
2. **Automatic publishing** to NPM registry on release creation
3. **Changelog generation** and version bumping

## Questions?

- 📖 Check the [README](./README.md) and [STYLING](./STYLING.md) guides
- 🐛 Open an [issue](https://github.com/clywell/filter-toolbar/issues) for bugs
- 💬 Start a [discussion](https://github.com/clywell/filter-toolbar/discussions) for questions

Thank you for contributing! 🎉