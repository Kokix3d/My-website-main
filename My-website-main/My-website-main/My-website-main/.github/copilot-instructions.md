# KOKI VFX & 3D Website - AI Coding Agent Guide

## Project Overview
**KOKI VFX & 3D** is a static web platform for browsing and discovering VFX/3D assets (Blender add-ons, Unreal plugins, models). It's a **client-side SPA (single-page application)** using vanilla JS with no build tools or backend—pure HTML, CSS, and JavaScript.

### Key Architecture
- **Two-page structure**: `index.html` (main catalog with sidebar), `product.html` (product detail page)
- **Data model**: Products array in `script.js` (6 items) is duplicated in `product.html` for standalone access
- **Navigation**: Onclick handlers in sidebar trigger JS functions; product links pass ID via URL params
- **Styling**: Dark glassmorphism theme with CSS variables in `style.css`

## Critical Developer Patterns

### 1. Product Data & Navigation
- **Data location**: `script.js` contains source-of-truth `products` array (id, title, image, description, download)
- **Duplication**: Product data is **also hardcoded in `product.html`** to allow standalone page loads
- **Pattern to maintain**: Always update BOTH locations when modifying product data
- **Navigation**: Use `onclick="viewProduct(id)"` for JS routing or `product.html?id=X` for direct links

### 2. Sidebar Navigation
- **Structure**: Dropdown menus for "Blender" and "Unreal" categories
- **Implementation**: `toggleSubmenu(event)` adds/removes "active" class; `.submenu` visibility controlled by `.open` class
- **Chevron rotation**: CSS transition on `.chevron` element via `rotate` class
- **Pattern**: All sidebar clicks call `showCategory()` or inline functions—no actual routing, just alerts for now

### 3. Styling & Layout
- **Layout**: CSS Grid sidebar (`250px` fixed left) + main content flex layout
- **Theme tokens** (`.root` variables):
  - `--accent: #00bfff` (cyan, used for buttons, hovers, titles)
  - `--bg-glass: rgba(255,255,255,0.08)` (glassmorphism cards)
  - `--text-light: #eaeaea`, `--text-dim: #aaa`
- **Responsive grid**: Products grid starts at 6 columns, scales down to 1 on mobile (breakpoints at 1600px, 1300px, 992px, 768px, 480px)
- **Backdrop blur & shadows** on all interactive elements

### 4. Asset Handling
- **Images**: All products reference `backgrounds/theme.jpg` as placeholder
- **Background**: Body uses `backgrounds/IMG_2254.JPG` as fixed background with `rgba(0,0,0,0.6)` overlay
- **External**: Font Awesome 6.4.0 loaded from CDN for icons

### 5. JavaScript Function Map
| Function | Purpose | Triggered By |
|----------|---------|--------------|
| `loadHome()` | Show products grid | Sidebar "Home" link |
| `displayProducts()` | Render grid with pagination (30 items/page) | `loadHome()`, `nextPage()`, `previousPage()` |
| `viewProduct(id)` | Navigate to product detail | Product card "View Details" button |
| `toggleSubmenu(event)` | Toggle dropdown visibility | Blender/Unreal sidebar icons |
| `showCategory(category)` | Placeholder for filtering (currently alerts) | Category sidebar links |

## Common Tasks & Implementation Patterns

### Adding/Modifying Products
1. Update `products` array in `script.js` (add/edit object with id, title, image, description, download)
2. **Also update** the `products` array in `product.html` script section
3. Update image paths in `backgrounds/` folder or link external CDN URLs

### Styling Changes
- Edit color tokens in `:root` in `style.css` for theme-wide updates
- Product cards use `.product-card` class; grid layout uses media queries (no breakpoint logic in JS)
- Hover states use `transform: translateY(-8px)` and shadow effects

### Adding Navigation/Categories
- Update sidebar HTML in `index.html` with new `<li>` items
- Add corresponding `onclick="showCategory('new-category')"` calls
- Implement logic in `showCategory()` to filter products (currently unimplemented)

## Project-Specific Conventions

### Naming
- CSS classes: kebab-case (e.g., `.product-card`, `.sidebar-menu`)
- JS functions: camelCase (e.g., `loadHome()`, `viewProduct()`)
- CSS variables: kebab-case with `--` prefix

### No Build Process
- No npm scripts, webpack, or bundlers—serve files directly
- All dependencies are external (Font Awesome CDN only)
- Local testing: Open `index.html` in browser or use simple HTTP server (`python -m http.server 8000`)

### Class Toggle Pattern
- Animations use `.open`, `.active`, `.hidden` classes
- Transitions defined in CSS, triggered by JS class additions

## Known Limitations & TODOs
- Category filtering (`showCategory()`) currently alerts—needs implementation to actually filter products
- Product detail page (`product.html`) is semi-static; download links are hardcoded to `#`
- Pagination UI elements referenced in JS (`pageNumber`, `productPage`) not in current HTML
- Search box in header not wired to any function
- Data persistence: No local storage or backend; refreshing resets state

## File Reference Guide
- `index.html` - Main catalog page with sidebar and product grid
- `product.html` - Product detail page (has duplicate product data)
- `script.js` - All JS logic, product data, event handlers (~100 LOC)
- `style.css` - All styling, CSS variables, media queries (~230 LOC)
- `backgrounds/` - Background images and placeholder product images
