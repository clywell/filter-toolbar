# Styling Guide

The `@clywell/filter-toolbar` package is designed to be **completely styling-agnostic**, giving you full control over the appearance while providing sensible defaults.

## Styling Approaches

### 1. **Default CSS Variables (Recommended)**
Import the default styles and customize using CSS variables:

```tsx
// Import the default styles
import '@clywell/filter-toolbar/dist/styles.css';
```

Then override any CSS variables in your own CSS:

```css
:root {
  /* Customize colors */
  --filter-primary: #your-brand-color;
  --filter-border: #your-border-color;
  
  /* Customize spacing */
  --filter-spacing-sm: 0.75rem;
  
  /* Customize typography */
  --filter-font-size-sm: 0.9rem;
}
```

### 2. **Complete Custom Styling**
Skip the default CSS entirely and provide your own styles using the semantic class names:

```css
/* Your custom styles */
.filter-button {
  /* Your button styles */
}

.filter-dropdown__content {
  /* Your dropdown styles */
}

.filter-chip {
  /* Your filter chip styles */
}
```

### 3. **Component Override**
Replace entire components with your own implementations:

```tsx
import { FilterToolbar } from '@clywell/filter-toolbar';
import { MyButton, MyBadge } from './my-ui-library';

<FilterToolbar
  // ... other props
  components={{
    Button: MyButton,
    Badge: MyBadge,
    // Override any component
  }}
/>
```

## CSS Variables Reference

### Colors
```css
:root {
  /* Primary colors */
  --filter-primary: #3b82f6;
  --filter-primary-foreground: #ffffff;
  
  /* Secondary colors */
  --filter-secondary: #f1f5f9;
  --filter-secondary-foreground: #0f172a;
  
  /* Neutral colors */
  --filter-muted: #64748b;
  --filter-muted-foreground: #94a3b8;
  --filter-accent: #f8fafc;
  --filter-accent-foreground: #0f172a;
  
  /* Semantic colors */
  --filter-destructive: #ef4444;
  --filter-destructive-foreground: #ffffff;
  
  /* UI colors */
  --filter-border: #e2e8f0;
  --filter-input: #e2e8f0;
  --filter-background: #ffffff;
  --filter-foreground: #0f172a;
  --filter-ring: #3b82f6;
}
```

### Spacing
```css
:root {
  --filter-spacing-xs: 0.25rem;   /* 4px */
  --filter-spacing-sm: 0.5rem;    /* 8px */
  --filter-spacing-md: 0.75rem;   /* 12px */
  --filter-spacing-lg: 1rem;      /* 16px */
  --filter-spacing-xl: 1.5rem;    /* 24px */
}
```

### Border Radius
```css
:root {
  --filter-radius-sm: 0.375rem;   /* 6px */
  --filter-radius-md: 0.5rem;     /* 8px */
  --filter-radius-lg: 0.75rem;    /* 12px */
}
```

### Shadows
```css
:root {
  --filter-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --filter-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --filter-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
```

### Typography
```css
:root {
  --filter-font-size-xs: 0.75rem;    /* 12px */
  --filter-font-size-sm: 0.875rem;   /* 14px */
  --filter-font-size-md: 1rem;       /* 16px */
  --filter-font-size-lg: 1.125rem;   /* 18px */
}
```

### Component Heights
```css
:root {
  --filter-height-sm: 2rem;       /* 32px */
  --filter-height-md: 2.25rem;    /* 36px */
  --filter-height-lg: 2.5rem;     /* 40px */
}
```

## Semantic Class Names

All components use semantic, BEM-style class names that you can target:

### Button
- `.filter-button` - Base button
- `.filter-button--variant-{variant}` - Button variants (default, secondary, ghost, destructive)
- `.filter-button--size-{size}` - Button sizes (sm, md, lg)

### Input
- `.filter-input` - Base input field

### Badge
- `.filter-badge` - Base badge
- `.filter-badge--variant-{variant}` - Badge variants

### Dropdown
- `.filter-dropdown` - Dropdown container
- `.filter-dropdown__content` - Dropdown popup
- `.filter-dropdown__item` - Dropdown menu item
- `.filter-dropdown__empty` - Empty state message

### Toolbar
- `.filter-toolbar` - Main toolbar container
- `.filter-toolbar__desktop` - Desktop layout
- `.filter-toolbar__header` - Toolbar header area
- `.filter-toolbar__filters` - Active filters container
- `.filter-toolbar__clear-all` - Clear all button

### Filter Chip
- `.filter-chip` - Filter chip container
- `.filter-chip__badge` - The clickable badge part
- `.filter-chip__content` - Chip content wrapper
- `.filter-chip__label` - Filter label text
- `.filter-chip__value` - Filter value text
- `.filter-chip__remove` - Remove button

### Mobile Sheet
- `.filter-sheet-overlay` - Modal overlay
- `.filter-sheet` - Sheet container
- `.filter-sheet__content` - Sheet content area
- `.filter-sheet__header` - Sheet header
- `.filter-sheet__title` - Sheet title

## Framework-Specific Styling

### Tailwind CSS
You can easily adapt the package to work with Tailwind:

```css
:root {
  --filter-primary: rgb(59 130 246);  /* blue-500 */
  --filter-secondary: rgb(241 245 249);  /* slate-100 */
  --filter-border: rgb(226 232 240);  /* slate-200 */
  --filter-spacing-sm: 0.5rem;  /* space-2 */
  --filter-radius-md: 0.5rem;  /* rounded-lg */
}
```

### CSS-in-JS (Emotion, Styled Components)
```tsx
import styled from 'styled-components';

const StyledFilterToolbar = styled.div`
  .filter-button {
    background: ${props => props.theme.primary};
    border-radius: ${props => props.theme.borderRadius};
  }
`;
```

### CSS Modules
```css
/* filterToolbar.module.css */
.customButton {
  composes: filter-button;
  background: var(--my-custom-primary);
}
```

## Dark Mode Support

Easy dark mode implementation using CSS variables:

```css
:root {
  /* Light mode (default) */
  --filter-background: #ffffff;
  --filter-foreground: #0f172a;
  --filter-border: #e2e8f0;
}

[data-theme="dark"] {
  /* Dark mode */
  --filter-background: #0f172a;
  --filter-foreground: #f8fafc;
  --filter-border: #374151;
}

@media (prefers-color-scheme: dark) {
  :root {
    /* Auto dark mode */
    --filter-background: #0f172a;
    --filter-foreground: #f8fafc;
    --filter-border: #374151;
  }
}
```

## Examples

### Brand Color Customization
```css
:root {
  --filter-primary: #your-brand-color;
  --filter-primary-foreground: #ffffff;
  --filter-ring: #your-brand-color;
}
```

### Compact Styling
```css
:root {
  --filter-spacing-sm: 0.25rem;
  --filter-spacing-md: 0.5rem;
  --filter-height-sm: 1.75rem;
  --filter-font-size-sm: 0.75rem;
}
```

### Rounded Design
```css
:root {
  --filter-radius-sm: 0.75rem;
  --filter-radius-md: 1rem;
  --filter-radius-lg: 1.5rem;
}
```

This approach gives you **maximum flexibility** while maintaining excellent developer experience and accessibility.