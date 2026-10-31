# Glossary

Anchors are the slug in brackets.

## ARIA Attributes (aria-attributes)

HTML attributes that provide accessibility information to assistive technologies

ARIA (Accessible Rich Internet Applications) attributes are HTML attributes that provide additional information about web content and UI components to assistive technologies, such as screen readers. They help make web applications more accessible to users with disabilities.

### Common ARIA Attributes

- `aria-label`: Provides a text label for elements
- `aria-current`: Indicates the current item in a set
- `aria-expanded`: Shows if an expandable element is open
- `aria-hidden`: Hides elements from assistive technologies
- `aria-live`: Announces dynamic content changes

### Best Practices

- Use semantic HTML elements when possible
- Only add ARIA attributes when necessary
- Test with screen readers
- Keep labels clear and concise

### Implementation Examples

```html
<!-- Navigation with ARIA -->
<nav aria-label="Pagination">
  <button aria-label="Previous page">Previous</button>
  <button aria-current="page">1</button>
  <button aria-label="Next page">Next</button>
</nav>
```

### Related Patterns

- [Pagination](patterns/navigation/pagination.md)

## Canonical Tags (canonical-tags)

HTML elements that specify the preferred URL for duplicate or similar content to prevent SEO issues

- **Related patterns:** patterns/navigation/pagination.md, patterns/navigation/infinite-scroll.md
- **Topics:** SEO, HTML, Web Standards

**Definition:** HTML link elements that tell search engines which version of a URL should be considered the primary or canonical version when duplicate or similar content exists across multiple URLs. (SEO,HTML,Web Standards)

A canonical tag (rel="canonical") is an HTML element that helps webmasters prevent duplicate content issues by specifying the "canonical" or "preferred" version of a web page. This is crucial for SEO as it consolidates ranking signals for duplicate or similar content to a single URL.

### What Problems Do They Solve?

### Duplicate Content Issues
Search engines may penalize sites for duplicate content. Common causes include:
- HTTP vs HTTPS versions
- WWW vs non-WWW versions
- URL parameters (sorting, filtering, tracking)
- Mobile vs desktop URLs
- Paginated content
- Print versions of pages

### Link Equity Dilution
Without canonicalization, link equity (PageRank) gets split between duplicate pages instead of consolidating to one authoritative version.

### Implementation

### Basic Syntax
Add to the `<head>` section of your HTML:
```html
<link rel="canonical" href="https://example.com/preferred-page">
```

### Self-Referencing Canonicals
Even unique pages should include self-referencing canonicals:
```html
<!-- On https://example.com/unique-page -->
<link rel="canonical" href="https://example.com/unique-page">
```

### Common Use Cases

### Pagination
Self-canonicalize each page in the series; only use a view-all page if it fully represents the series and canonicalize that page to itself:
```html
<!-- On page 2 of results -->
<link rel="canonical" href="https://example.com/products?page=2">
<!-- OR point to view-all if it exists and represents the series -->
<link rel="canonical" href="https://example.com/products?view=all">
```

### URL Parameters
Point filtered or sorted versions to the main category:
```html
<!-- On /products?sort=price&color=red -->
<link rel="canonical" href="https://example.com/products">
```

### Cross-Domain
Syndicated content can point to the original source:
```html
<!-- On republishing site -->
<link rel="canonical" href="https://original-site.com/article">
```

### Mobile/AMP Versions
Mobile or AMP pages reference the desktop version:
```html
<!-- On m.example.com/page -->
<link rel="canonical" href="https://example.com/page">
```

### Best Practices

### Do's ✅

1. **Use absolute URLs**
   ```html
   <!-- Good -->
   <link rel="canonical" href="https://example.com/page">

   <!-- Bad -->
   <link rel="canonical" href="/page">
   ```

2. **Be consistent**
   - Pick one version (www or non-www, HTTP or HTTPS)
   - Use the same format everywhere

3. **Validate URLs exist**
   - Canonical URLs should return 200 status
   - Don't point to 404s or redirects

4. **Match content closely**
   - Canonical pages should have very similar content
   - Don't canonicalize unrelated pages

5. **Include in sitemaps**
   - Only include canonical URLs in XML sitemaps
   - This reinforces your preference

### Don'ts ❌

1. **Don't chain canonicals**
   ```html
   <!-- Page A → Page B → Page C (Bad) -->
   <!-- Page A → Page C (Good) -->
   ```

2. **Don't mix signals**
   - If using canonical to Page A, don't noindex Page A
   - Don't block canonical URLs in robots.txt

3. **Don't canonicalize to redirects**
   - Point directly to the final URL
   - Avoid redirect chains

4. **Don't use relative URLs**
   - Protocol and domain can be misinterpreted
   - Always use full absolute URLs

### Relationship with Other Tags

### With rel="prev" and rel="next"
For paginated content, can be used together. Note: major search engines like Google do not use these hints for indexing; treat them as navigational aids, not SEO signals:
```html
<link rel="canonical" href="https://example.com/article">
<link rel="prev" href="https://example.com/article?page=1">
<link rel="next" href="https://example.com/article?page=3">
```

### With hreflang
Each locale self-canonicalizes and references alternates:
```html
<!-- On English page -->
<link rel="canonical" href="https://example.com/page">
<link rel="alternate" hreflang="es" href="https://example.es/page">
<link rel="alternate" hreflang="fr" href="https://example.fr/page">

<!-- On Spanish page -->
<link rel="canonical" href="https://example.es/page">
<link rel="alternate" hreflang="en" href="https://example.com/page">
<link rel="alternate" hreflang="fr" href="https://example.fr/page">

<!-- On French page -->
<link rel="canonical" href="https://example.fr/page">
<link rel="alternate" hreflang="en" href="https://example.com/page">
<link rel="alternate" hreflang="es" href="https://example.es/page">
```

### With meta robots
Canonical and robots directives should align:
```html
<!-- Don't do this -->
<link rel="canonical" href="https://example.com/page">
<meta name="robots" content="noindex"> <!-- Conflicting signal -->
```

### JavaScript Implementation

For SPAs or dynamic content:
```javascript
// Remove existing canonical(s)
document.querySelectorAll('link[rel="canonical"]').forEach(el => el.remove());

// Add new canonical
const link = document.createElement('link');
link.setAttribute('rel', 'canonical');
link.setAttribute('href', 'https://example.com/preferred-url');
document.head.appendChild(link);
```

### Common Mistakes

### Multiple Canonical Tags
Having multiple canonical tags confuses search engines:
```html
<!-- Wrong: Multiple canonicals -->
<link rel="canonical" href="https://example.com/page1">
<link rel="canonical" href="https://example.com/page2">
```

### Protocol Mismatches
Ensure canonical URLs match your site's protocol:
```html
<!-- If site is HTTPS, don't use HTTP canonical -->
<link rel="canonical" href="http://example.com/page"> <!-- Wrong -->
<link rel="canonical" href="https://example.com/page"> <!-- Right -->
```

### Parameter Handling
Be careful with parameter URLs:
```html
<!-- Decide if parameters create different content -->
<!-- Same content: canonicalize to base URL -->
<link rel="canonical" href="https://example.com/page">

<!-- Different content: self-canonical with parameters -->
<link rel="canonical" href="https://example.com/page?category=shoes">
```

### Testing & Validation

### Tools for Testing
- Google Search Console URL Inspection
- Screaming Frog SEO Spider
- Browser extensions (SEO Meta in 1 Click)
- Google Rich Results Test (structured data)

### What to Check
1. Canonical tag is present
2. URL is absolute and valid
3. No redirect chains
4. Content similarity between pages
5. No conflicting signals

### Related Patterns

Canonical tags are crucial for:
- [Pagination](patterns/navigation/pagination.md) - Managing duplicate content across pages
- [Infinite Scroll](patterns/navigation/infinite-scroll.md) - Handling dynamically loaded content
- Filtered/sorted product listings
- Multi-step forms with unique URLs

### Key Takeaways

1. **One canonical tag per page** pointing to the preferred version
2. **Use absolute URLs** including protocol and domain
3. **Ensure canonical URLs are accessible** (200 status)
4. **Align with other SEO signals** (sitemaps, robots.txt)
5. **Test implementation** with SEO tools
6. **Monitor in Search Console** for canonicalization issues

## CLS (Cumulative Layout Shift) (cls-cumulative-layout-shift)

A Core Web Vital metric that measures visual stability by quantifying unexpected layout shifts during page load

- **Related patterns:** patterns/navigation/pagination.md, patterns/navigation/infinite-scroll.md
- **Topics:** Performance, Web Vitals, UX

**Definition:** A Core Web Vital metric that measures the visual stability of a page by quantifying how much content unexpectedly shifts during the page lifecycle. (Performance,Web Vitals,UX)

Cumulative Layout Shift (CLS) is a Core Web Vital metric that measures the visual stability of a web page. It quantifies how much visible content shifts unexpectedly during session windows (typically the user's browsing session), helping developers identify and fix jarring user experiences.

### What It Measures

CLS captures the sum of all individual layout shift scores for unexpected layout shifts that occur during session windows (typically the user's browsing session, not necessarily the entire page lifecycle). A layout shift occurs when a visible element changes its position from one frame to the next.

### Scoring

- **Good:** CLS < 0.1
- **Needs Improvement:** 0.1 ≤ CLS ≤ 0.25
- **Poor:** CLS > 0.25

### Common Causes

- Images without dimensions
- Ads, embeds, and iframes without reserved space
- Dynamically injected content
- Web fonts causing FOIT/FOUT
- Actions waiting for network response before updating DOM

### Impact on User Experience

High CLS scores lead to:
- Accidental clicks on wrong elements
- Lost reading position
- Frustration and confusion
- Perceived poor quality of the website

### How to Improve CLS

1. **Reserve Space:** Always include size attributes on images and video elements
   - Alternatively, use CSS `aspect-ratio` to reserve space when intrinsic sizes aren't available
2. **Static Containers:** Pre-allocate space for ads and dynamic content
3. **Font Loading:** Use `font-display: optional` or preload critical fonts
4. **Animations:** Prefer `transform` animations over properties that trigger layout
5. **Avoid DOM Insertions:** Don't insert content above existing content except in response to user interaction

### Measurement Tools

- Chrome DevTools Performance panel
- Lighthouse
- PageSpeed Insights
- Chrome User Experience Report
- Web Vitals JavaScript library

### Related Patterns

When implementing UI patterns, consider their impact on CLS:
- [Pagination](patterns/navigation/pagination.md) - Ensure smooth transitions between pages
- [Infinite Scroll](patterns/navigation/infinite-scroll.md) - Prevent layout shifts when loading new content
- [Load More](patterns/navigation/load-more.md) - Reserve space for loading indicators

### Learn More

Understanding and optimizing CLS is crucial for creating stable, user-friendly interfaces that don't frustrate users with unexpected movement.

## Design Tokens (design-tokens)

Platform-agnostic variables that store design decisions for consistent implementation across products and teams

- **Related patterns:** patterns/navigation/pagination.md, patterns/forms/button.md, patterns/navigation/tabs.md
- **Topics:** Design Systems, CSS, Architecture

**Definition:** Named entities that store visual design attributes, acting as a single source of truth for design decisions that can be transformed and applied across different platforms and technologies. (Design Systems,CSS,Architecture)

Design tokens are the visual design atoms of a design system — specifically, they are named entities that store visual design attributes. They act as a single source of truth for design decisions, replacing hard-coded values with semantic references that can be maintained, scaled, and transformed across different platforms and technologies.

### What Are Design Tokens?

Instead of:
```css
.button {
  background-color: #0066cc;
  padding: 12px 24px;
  border-radius: 4px;
}
```

You use:
```css
.button {
  background-color: var(--color-primary-base);
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: var(--radius-small);
}
```

### Types of Design Tokens

### Core Tokens (Global)
Foundation-level values without context:
```json
{
  "color": {
    "blue-500": "#0066cc",
    "gray-100": "#f5f5f5"
  },
  "spacing": {
    "4": "16px",
    "8": "32px"
  }
}
```

### Semantic Tokens (Alias)
Reference core tokens with meaning:
```json
{
  "color": {
    "primary": "{color.blue-500}",
    "background": "{color.gray-100}"
  },
  "spacing": {
    "button-padding": "{spacing.4}"
  }
}
```

### Component Tokens
Specific to component implementations:
```json
{
  "button": {
    "background": "{color.primary}",
    "padding-x": "{spacing.button-padding}",
    "border-radius": "{spacing.sm}"
  }
}
```

### Token Categories

### Colors
```json
{
  "color": {
    "primary": {
      "50": "#e6f0ff",
      "500": "#0066cc",
      "900": "#002244"
    },
    "semantic": {
      "error": "#dc3545",
      "success": "#28a745",
      "warning": "#ffc107"
    }
  }
}
```

### Typography
```json
{
  "font": {
    "family": {
      "base": "'Inter', sans-serif",
      "heading": "'Poppins', sans-serif"
    },
    "size": {
      "sm": "14px",
      "base": "16px",
      "lg": "20px"
    },
    "weight": {
      "normal": 400,
      "bold": 700
    }
  }
}
```

### Spacing
```json
{
  "spacing": {
    "xs": "4px",
    "sm": "8px",
    "md": "16px",
    "lg": "24px",
    "xl": "32px"
  }
}
```

### Sizing
```json
{
  "size": {
    "icon": {
      "sm": "16px",
      "md": "24px",
      "lg": "32px"
    },
    "button": {
      "height": "44px"
    }
  }
}
```

### Effects
```json
{
  "shadow": {
    "sm": "0 1px 2px rgba(0,0,0,0.1)",
    "md": "0 4px 6px rgba(0,0,0,0.1)",
    "lg": "0 10px 15px rgba(0,0,0,0.1)"
  },
  "blur": {
    "sm": "4px",
    "md": "8px"
  }
}
```

### Token Formats

### Design Tokens Format (DTF)
Industry standard specification:
```json
{
  "$schema": "https://design-tokens.org/schema.json",
  "colors": {
    "primary": {
      "$value": "#0066cc",
      "$type": "color",
      "$description": "Primary brand color"
    }
  }
}
```

### Style Dictionary Format
Amazon's popular format:
```json
{
  "color": {
    "base": {
      "gray": {
        "light": { "value": "#CCCCCC" },
        "medium": { "value": "#999999" },
        "dark": { "value": "#111111" }
      }
    }
  }
}
```

### Implementation Strategies

### CSS Custom Properties
```css
:root {
  --color-primary: #0066cc;
  --spacing-base: 16px;
  --font-size-lg: 1.25rem;
}

.component {
  color: var(--color-primary);
  padding: var(--spacing-base);
  font-size: var(--font-size-lg);
}
```

### JavaScript/TypeScript
```typescript
export const tokens = {
  color: {
    primary: '#0066cc',
    secondary: '#6c757d'
  },
  spacing: {
    sm: '8px',
    md: '16px',
    lg: '24px'
  }
} as const;
```

### Sass Variables
```scss
$color-primary: #0066cc;
$spacing-base: 16px;
$border-radius-sm: 4px;

.button {
  background: $color-primary;
  padding: $spacing-base;
  border-radius: $border-radius-sm;
}
```

### Token Transformation

### Build Tools
Transform tokens for different platforms:

```javascript
// Input tokens.json
const tokens = {
  "color": {
    "primary": "#0066cc"
  }
};

// Output: CSS
:root {
  --color-primary: #0066cc;
}

// Output: iOS Swift
struct Colors {
  static let primary = UIColor(hex: "#0066cc")
}

// Output: Android XML
<color name="color_primary">#0066cc</color>
```

### Popular Tools
- **Style Dictionary** - Amazon's token transformer
- **Theo** - Salesforce's token generator
- **Design Tokens Plugin** - Figma to code
- **Tokens Studio** - Figma plugin for managing tokens

### Benefits

### Consistency
Single source of truth ensures visual consistency across:
- Different pages and components
- Multiple platforms (web, iOS, Android)
- Design tools and code

### Maintainability
Change once, update everywhere:
```json
// Change primary color in tokens.json
"color": {
  "primary": "#0052cc" // was #0066cc
}
// Automatically updates all uses
```

### Scalability
- Easy to add new themes
- Support multiple brands
- Enable dark mode with token swapping

### Communication
- Shared language between designers and developers
- Self-documenting design decisions
- Clear design system governance

### Theme Switching

Enable multiple themes through token swapping:
```css
/* Light theme */
[data-theme="light"] {
  --color-background: #ffffff;
  --color-text: #000000;
}

/* Dark theme */
[data-theme="dark"] {
  --color-background: #1a1a1a;
  --color-text: #ffffff;
}
```

### Common Patterns

### Naming Conventions
```
[category]-[property]-[variant]-[state]

Examples:
color-primary-500
spacing-inline-lg
font-size-heading-1
button-background-hover
```

### Token Aliasing
Reference other tokens for flexibility:
```json
{
  "color-brand": "{color.blue-500}",
  "color-action": "{color-brand}",
  "button-primary-bg": "{color-action}"
}
```

### Best Practices

### Do's ✅

1. **Start with core tokens** - Build foundation first
2. **Use semantic naming** - `color-danger` not `color-red`
3. **Document token usage** - When and why to use each token
4. **Version your tokens** - Track changes over time
5. **Validate token usage** - Lint for hard-coded values

### Don'ts ❌

1. **Don't over-tokenize** - Not every value needs to be a token
2. **Don't break contracts** - Removing tokens breaks implementations
3. **Don't mix concerns** - Keep tokens focused on visual properties
4. **Don't forget platforms** - Consider all target platforms

### Related Patterns

Design tokens are fundamental for:
- [Pagination](patterns/navigation/pagination.md) - Consistent spacing and colors
- [Buttons](patterns/forms/button.md) - Standardized sizes and styles
- [Tabs](patterns/navigation/tabs.md) - Unified visual language

### Tools & Resources

- [Design Tokens W3C Community Group](https://design-tokens.github.io/community-group/format/)
- [Tokens Studio for Figma](https://tokens.studio/)
- [Theo by Salesforce](https://github.com/salesforce-ux/theo)

### Key Takeaways

1. Design tokens create a **single source of truth** for design decisions
2. They enable **consistency across platforms** and teams
3. **Semantic naming** makes tokens self-documenting
4. **Token transformation** adapts values for different platforms
5. **Proper organization** with core, semantic, and component tokens
6. **Version and document** tokens for maintainability

## DOM (Document Object Model) (dom)

A programming interface that represents HTML and XML documents as a tree structure, allowing JavaScript to interact with and modify page content

- **Related patterns:** patterns/content-management/modal.md, patterns/navigation/infinite-scroll.md
- **Topics:** Web Development, JavaScript, Browser API

**Definition:** A tree-like representation of HTML or XML documents that allows programming languages to access and manipulate page content, structure, and styles dynamically. (Web Development,JavaScript,Browser API)

The Document Object Model (DOM) is a programming interface for web documents. It represents the structure of HTML and XML documents as a tree of objects, where each node represents part of the document (elements, attributes, text). JavaScript can interact with this tree to dynamically change content, structure, and styling.

### How the DOM Works

When a browser loads a web page:
1. **Parses HTML** into a tree structure
2. **Creates DOM nodes** for each element
3. **Builds the DOM tree** with parent-child relationships
4. **Provides API** for JavaScript interaction

```html
<!-- HTML -->
<div id="container">
  <h1>Title</h1>
  <p>Content</p>
</div>
```

Becomes this DOM tree:
```
document
  └── html
      └── body
          └── div#container
              ├── h1
              │   └── "Title" (text node)
              └── p
                  └── "Content" (text node)
```

### DOM Nodes

### Node Types
- **Element nodes** - HTML tags (`<div>`, `<p>`, `<button>`)
- **Text nodes** - Text content inside elements
- **Attribute nodes** - Element attributes (id, class, href)
- **Comment nodes** - HTML comments
- **Document node** - Root of the DOM tree

### Node Relationships
```javascript
// Parent/Child relationships
element.parentNode        // Parent element
element.childNodes        // All child nodes
element.firstChild        // First child node
element.lastChild         // Last child node

// Sibling relationships
element.previousSibling   // Previous node
element.nextSibling      // Next node

// Element-only relationships (skip text nodes)
element.children          // Element children only
element.firstElementChild // First element child
element.nextElementSibling // Next element sibling
```

### DOM Manipulation

### Selecting Elements
```javascript
// Single element selectors
document.getElementById('header')          // By ID
document.querySelector('.class')          // CSS selector (first match)
document.querySelector('[data-id="123"]') // Attribute selector

// Multiple element selectors
document.getElementsByClassName('item')    // By class (live collection)
document.getElementsByTagName('div')      // By tag (live collection)
document.querySelectorAll('.item')        // CSS selector (static NodeList)
```

### Creating Elements
```javascript
// Create new elements
const div = document.createElement('div');
const text = document.createTextNode('Hello');

// Set attributes and content
div.className = 'container';
div.id = 'main';
div.textContent = 'Hello World';
div.innerHTML = '<span>HTML content</span>';

// Add to DOM
document.body.appendChild(div);
parentElement.insertBefore(div, referenceNode);
```

### Modifying Elements
```javascript
// Content
element.textContent = 'Plain text';        // Text only
element.innerHTML = '<b>HTML</b>';         // HTML content (avoid with untrusted input to prevent XSS)

// Attributes
element.setAttribute('data-id', '123');
element.getAttribute('data-id');
element.removeAttribute('data-id');
element.id = 'newId';
element.className = 'class1 class2';

// Styles
element.style.color = 'red';
element.style.display = 'none';
element.classList.add('active');
element.classList.remove('active');
element.classList.toggle('active');
```

### Removing Elements
```javascript
// Remove from DOM
element.remove();                   // Modern way
parent.removeChild(child);         // Legacy way
element.innerHTML = '';            // Clear content
```

### DOM Events

The DOM provides an event system for handling user interactions:

```javascript
// Adding event listeners
element.addEventListener('click', handleClick);
element.addEventListener('submit', (e) => {
  e.preventDefault();
  // Handle form submission
});

// For scroll/touch events, consider passive listeners:
// window.addEventListener('scroll', onScroll, { passive: true });

// Event delegation
document.addEventListener('click', (e) => {
  if (e.target.matches('.button')) {
    // Handle button click
  }
});

// Removing event listeners
element.removeEventListener('click', handleClick);
```

### DOM Performance

### Reflow and Repaint
DOM changes can trigger:
- **Reflow**: Recalculating element positions and geometry
- **Repaint**: Updating visual appearance

### Performance Tips
```javascript
// Bad: Multiple DOM updates
for (let i = 0; i < 1000; i++) {
  document.body.innerHTML += '<div>' + i + '</div>';
}

// Good: Batch updates
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
  const div = document.createElement('div');
  div.textContent = i;
  fragment.appendChild(div);
}
document.body.appendChild(fragment);

// Good: Use CSS classes instead of inline styles
element.classList.add('hidden');  // Better
element.style.display = 'none';   // Causes reflow
```

### Virtual DOM

Some frameworks use a Virtual DOM - a JavaScript representation of the real DOM:
- **React, Vue**: Compare virtual DOM trees and update only changes
- **Benefits**: Batched updates, predictable performance
- **Trade-off**: Memory overhead, additional complexity

### DOM vs HTML

| HTML | DOM |
|------|-----|
| Static markup language | Dynamic object model |
| Text-based source code | In-memory tree structure |
| What you write | What the browser creates |
| Cannot be manipulated | Can be manipulated via JavaScript |

### Common DOM Methods

### Traversal
```javascript
// Find elements
element.closest('.parent')           // Nearest parent matching selector
element.contains(otherElement)       // Check if contains element
element.matches('.selector')          // Check if matches selector
```

### Dimensions & Position
```javascript
// Size
element.offsetWidth / offsetHeight   // Including borders
element.clientWidth / clientHeight   // Including padding
element.scrollWidth / scrollHeight   // Including overflow

// Position
element.offsetTop / offsetLeft       // Position relative to offsetParent
element.getBoundingClientRect()      // Position relative to viewport
```

### Browser Compatibility

Modern DOM APIs with good support:
- `querySelector/querySelectorAll` - All modern browsers
- `classList` - All modern browsers
- `Element.remove()` - All modern browsers
- `Element.closest()` - All modern browsers

Legacy alternatives still needed for:
- Very old browsers (IE11 and below)
- Some mobile browsers

### Common Pitfalls

### Live vs Static Collections
```javascript
// Live collection (updates automatically)
const divs = document.getElementsByTagName('div');
console.log(divs.length); // 5
document.body.appendChild(document.createElement('div'));
console.log(divs.length); // 6

// Static collection (snapshot)
const divs2 = document.querySelectorAll('div');
console.log(divs2.length); // 5
document.body.appendChild(document.createElement('div'));
console.log(divs2.length); // Still 5
```

### Memory Leaks
```javascript
// Potential leak: event listener holds reference
element.addEventListener('click', () => {
  // This closure keeps element in memory
});

// Clean up when removing elements
element.removeEventListener('click', handler);
element.remove();
```

### Related Concepts

- [Screen Reader](glossary.md#screen-reader) - Interprets DOM for accessibility
- [Live Regions](glossary.md#live-regions) - DOM areas that announce changes
- Shadow DOM - Encapsulated DOM trees
- CSSOM - CSS Object Model

### Key Takeaways

- The DOM is a tree representation of HTML documents
- JavaScript manipulates web pages through the DOM API
- DOM operations can be expensive - batch updates when possible
- Understanding DOM relationships helps write better selectors
- Modern frameworks abstract DOM manipulation but understanding it is still crucial

## Helper Text (helper-text)

Short, contextual text that provides guidance, clarification, or examples for a user interface element, typically an input field.

- **Also called:** Hint text, Instructional text, Guidance text, Descriptive text
- **Related patterns:** [
- **Topics:** UX

**Definition:** Short, contextual text that provides guidance, clarification, or examples for a user interface element, typically an input field. (UX)

Helper text is a UI component used to assist users in understanding how to interact with an element, such as a form input, by offering additional context, explaining expected input formats, detailing constraints (e.g., character limits), or providing examples. It aims to prevent user errors, reduce cognitive load, and improve the overall usability of a form or interactive component, often appearing persistently below a field or dynamically on focus. This reduces the likelihood of users encountering validation errors or needing to guess the correct input.

### Related Patterns

- [command palette](patterns/advanced/command-palette.md)
- [search results](patterns/advanced/search-results.md)
- [wizard](patterns/advanced/wizard.md)

## Keyboard Navigation (keyboard-navigation)

The ability to navigate and interact with a website or application using only keyboard input, without requiring a mouse

- **Related patterns:** patterns/navigation/pagination.md, patterns/content-management/modal.md, patterns/forms/button.md
- **Topics:** Accessibility, User Interaction

**Definition:** The practice of making web interfaces fully accessible and usable through keyboard-only input, essential for users who cannot or prefer not to use a mouse. (Accessibility,User Interaction)

Keyboard navigation refers to the ability to navigate through and interact with all elements of a website or application using only the keyboard. This is crucial for accessibility, as many users rely on keyboards due to motor disabilities, visual impairments, or personal preference.

### Why Keyboard Navigation Matters

### User Groups Who Depend on It
- **Users with motor disabilities** who cannot use a mouse precisely
- **Blind and low-vision users** who use screen readers
- **Power users** who prefer keyboard efficiency
- **Users with temporary limitations** (broken arm, holding a baby)
- **Users of assistive technologies** like switch devices or voice control

### Standard Keyboard Controls

### Essential Keys
| Key | Action |
|-----|--------|
| **Tab** | Move forward through interactive elements |
| **Shift + Tab** | Move backward through interactive elements |
| **Enter** | Activate buttons, submit forms, follow links |
| **Space** | Toggle checkboxes, activate buttons, scroll |
| **Arrow Keys** | Navigate within components (menus, radio groups) |
| **Escape** | Close modals, cancel operations, exit menus |

### Navigation Patterns
```html
<!-- Focusable elements in order -->
<a href="#">Link</a>              <!-- Tab stop 1 -->
<button>Button</button>           <!-- Tab stop 2 -->
<input type="text">              <!-- Tab stop 3 -->
<select>...</select>             <!-- Tab stop 4 -->
<textarea>...</textarea>         <!-- Tab stop 5 -->
```

### Implementation Requirements

### Making Elements Keyboard Accessible

#### Native Interactive Elements
Already keyboard accessible by default:
- `<a href>`
- `<button>`
- `<input>`
- `<select>`
- `<textarea>`

#### Custom Interactive Elements
Require additional attributes:
```html
<!-- Make div interactive -->
<div
  role="button"
  tabindex="0"
  onclick="doSomething()"
  onkeydown="if(event.key === 'Enter' || event.key === ' ') doSomething()"
>
  Custom Button
</div>
```

### Focus Management

#### Visible Focus Indicators
```css
/* Good: Clear focus style with :focus-visible for keyboard users */
:focus-visible {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

/* Alternative: Custom focus style that's always visible */
:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.5);
  border: 2px solid #0066cc;
}
```

#### Focus Order (tabindex)
```html
<!-- Natural tab order (recommended) -->
<button>First</button>   <!-- tabindex = 0 (implicit) -->
<button>Second</button>  <!-- tabindex = 0 (implicit) -->

<!-- Custom tab order (ANTI-PATTERN - avoid positive tabindex) -->
<button tabindex="2">Third</button>  <!-- ❌ Creates fragile focus order -->
<button tabindex="1">First</button>  <!-- ❌ Hard to maintain -->

<!-- Remove from tab order -->
<button tabindex="-1">Not tabbable</button>

<!-- Warning: Positive tabindex values create maintenance issues and can break when DOM changes.
     Prefer natural document order or restructure your HTML instead. -->
```

### Complex Widget Patterns

### Modal Dialogs
```javascript
// Focus trap implementation
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      } else if (!e.shiftKey && document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
    if (e.key === 'Escape') {
      closeModal();
    }
  });
}
```

### Dropdown Menus
```javascript
// Arrow key navigation
menu.addEventListener('keydown', (e) => {
  const items = menu.querySelectorAll('[role="menuitem"]');

  // Guard against empty menu
  if (items.length === 0) return;

  const currentIndex = Array.from(items).indexOf(document.activeElement);

  switch(e.key) {
    case 'ArrowDown':
      e.preventDefault();
      if (currentIndex === -1) {
        // No focus, go to first item
        items[0].focus();
      } else {
        // Go to next item, wrap to first
        items[(currentIndex + 1) % items.length].focus();
      }
      break;

    case 'ArrowUp':
      e.preventDefault();
      if (currentIndex === -1) {
        // No focus, go to last item
        items[items.length - 1].focus();
      } else {
        // Go to previous item, wrap to last
        items[(currentIndex - 1 + items.length) % items.length].focus();
      }
      break;

    case 'Home':
      e.preventDefault();
      items[0].focus();
      break;

    case 'End':
      e.preventDefault();
      items[items.length - 1].focus();
      break;

    case 'Escape':
      closeMenu();
      break;
  }
});
```

### Skip Links

Provide shortcuts to main content:
```html
<body>
  <!-- Skip link (visually hidden until focused) -->
  <a href="#main" class="skip-link">Skip to main content</a>

  <nav><!-- Long navigation --></nav>

  <main id="main">
    <!-- Main content -->
  </main>
</body>

<style>
.skip-link {
  position: absolute;
  left: -10000px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.skip-link:focus {
  position: static;
  width: auto;
  height: auto;
}
</style>
```

### Common Keyboard Navigation Issues

### Problems to Avoid

1. **Keyboard Traps**: User can't escape an element
2. **Missing Focus Indicators**: No visual feedback
3. **Illogical Tab Order**: Focus jumps unexpectedly
4. **Inaccessible Custom Controls**: Divs acting as buttons without proper keyboard support
5. **Focus Lost**: Focus disappears after actions

### Testing Checklist

- [ ] Can you reach all interactive elements with Tab?
- [ ] Can you activate all controls with Enter/Space?
- [ ] Can you see which element has focus?
- [ ] Can you escape from all components with Escape?
- [ ] Does focus move logically through the page?
- [ ] Can you complete all tasks without a mouse?

### ARIA Attributes for Keyboard Navigation

```html
<!-- Indicate keyboard shortcuts -->
<button aria-keyshortcuts="Alt+S">Save</button>

<!-- Group related controls -->
<div role="toolbar" aria-label="Text formatting">
  <button>Bold</button>
  <button>Italic</button>
</div>

<!-- Indicate current state -->
<button aria-pressed="true">Toggle</button>
<button aria-expanded="false">Menu</button>
```

### Best Practices

### Do's ✅
- Use semantic HTML elements that are naturally keyboard accessible
- Provide visible focus indicators
- Implement logical tab order
- Add skip links for repetitive content
- Test with keyboard only (unplug your mouse!)
- Support both Enter and Space for buttons
- Provide keyboard shortcuts for frequent actions

### Don'ts ❌
- Don't remove focus indicators without providing alternatives
- Avoid positive tabindex values (use 0 or -1)
- Don't trap keyboard focus unintentionally
- Never make elements keyboard-only (mouse should work too)
- Don't rely on accesskey (conflicts with browser/screen reader shortcuts)

### Browser Differences

Different browsers handle keyboard navigation slightly differently:
- **Chrome/Edge**: Space scrolls page when button not focused
- **Firefox**: F7 toggles caret browsing
- **Safari**: Requires enabling full keyboard access in settings

### Related Concepts

- [Screen Reader](glossary.md#screen-reader) - Depends on keyboard navigation
- [ARIA Attributes](glossary.md#aria-attributes) - Enhance keyboard accessibility
- [Touch Targets](glossary.md#touch-targets) - Mobile equivalent consideration
- [Live Regions](glossary.md#live-regions) - Announce keyboard-triggered changes

### Key Takeaways

- Keyboard navigation is essential for accessibility
- Use semantic HTML for free keyboard support
- Always provide visible focus indicators
- Test by unplugging your mouse
- Consider keyboard users in every interaction design

## Lazy Loading (lazy-loading)

A performance optimization technique that delays loading of non-critical resources until they are needed

- **Related patterns:** patterns/navigation/infinite-scroll.md, patterns/navigation/load-more.md, patterns/data-display/table.md
- **Topics:** Performance, Optimization, Web Development

**Definition:** A design pattern that defers the initialization or loading of resources until they are actually needed, improving initial page load time and reducing bandwidth usage. (Performance,Optimization,Web Development)

Lazy loading is a performance optimization strategy that delays the loading of resources (images, videos, scripts, components) until they are actually needed. Instead of loading everything upfront, content is loaded on-demand as users interact with the page, significantly improving initial page load times and reducing bandwidth consumption.

### Why Use Lazy Loading?

### Performance Benefits
- **Faster initial page load** - Only critical content loads first
- **Reduced bandwidth usage** - Only requested resources download
- **Lower server load** - Fewer simultaneous requests
- **Improved Core Web Vitals** - Better LCP and INP scores
- **Better mobile experience** - Crucial for slower connections

### Types of Lazy Loading

### Image Lazy Loading
```html
<!-- Native lazy loading (modern browsers) -->
<img src="image.jpg" loading="lazy" alt="Description">

<!-- With placeholder -->
<img
  src="placeholder.jpg"
  data-src="full-image.jpg"
  loading="lazy"
  alt="Description"
>
```

### Intersection Observer API
```javascript
// Modern approach using Intersection Observer
const images = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
      observer.unobserve(img);
    }
  });
}, {
  rootMargin: '50px 0px', // Start loading 50px before visible
  threshold: 0.01
});

images.forEach(img => imageObserver.observe(img));
```

### Component Lazy Loading (React)
```jsx
import { lazy, Suspense } from 'react';

// Lazy load component
const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}

// Route-based lazy loading
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));
```

### JavaScript Module Loading
```javascript
// Dynamic import
button.addEventListener('click', async () => {
  const module = await import('./heavy-module.js');
  module.doSomething();
});

// Conditional loading
if (userNeedsFeature) {
  import('./feature.js').then(module => {
    module.initialize();
  });
}
```

### Implementation Strategies

### Progressive Image Loading
```html
<!-- Low quality placeholder to high quality -->
<div class="progressive-image">
  <img
    class="placeholder"
    src="tiny-blurred.jpg"
    alt="Description"
  >
  <img
    class="full"
    data-src="full-resolution.jpg"
    alt="Description"
  >
</div>

<style>
.progressive-image {
  position: relative;
}

.placeholder {
  filter: blur(5px);
  transition: opacity 0.3s;
}

.full {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  transition: opacity 0.3s;
}

.full.loaded {
  opacity: 1;
}
</style>
```

### Infinite Scroll with Lazy Loading
```javascript
const content = document.querySelector('.content');
const loader = document.querySelector('.loader');

const loadMoreContent = async () => {
  const response = await fetch(`/api/content?page=${nextPage}`);
  const newContent = await response.json();
  renderContent(newContent);
  nextPage++;
};

// Observe loader element
const observer = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    loadMoreContent();
  }
});

observer.observe(loader);
```

### Lazy Loading with Fallbacks
```javascript
// Query DOM for images that need lazy loading
const images = document.querySelectorAll('img[data-src]');

// Check for native lazy loading support
if ('loading' in HTMLImageElement.prototype && images.length > 0) {
  // Native lazy loading supported - convert NodeList to array for forEach
  Array.from(images).forEach(img => {
    img.loading = 'lazy';
  });
} else if (images.length > 0) {
  // Fallback to Intersection Observer or library
  const script = document.createElement('script');
  script.src = '/lazy-loading-polyfill.js';
  document.body.appendChild(script);
}
```

### Best Practices

### Do's ✅

1. **Set dimensions** to prevent layout shift
```html
<img
  src="placeholder.jpg"
  data-src="image.jpg"
  width="800"
  height="600"
  loading="lazy"
>
```

2. **Use appropriate loading thresholds**
```javascript
// Load images just before they enter viewport
rootMargin: '100px 0px'
```

3. **Provide meaningful placeholders**
- Blurred thumbnails
- Skeleton screens
- Solid colors
- SVG placeholders

4. **Prioritize above-the-fold content**
```html
<!-- Critical images load immediately -->
<img src="hero.jpg" loading="eager" fetchpriority="high">

<!-- Below-fold images lazy load -->
<img src="footer.jpg" loading="lazy">
```

### Don'ts ❌

1. **Don't lazy load critical content**
- Hero images
- Logo
- Above-the-fold content
- LCP elements

2. **Don't remove accessibility**
```html
<!-- Always include alt text -->
<img data-src="image.jpg" alt="Description" loading="lazy">
```

3. **Don't lazy load tiny resources**
- Small icons
- CSS files
- Critical JavaScript

### Performance Metrics

### Impact on Core Web Vitals

**Largest Contentful Paint (LCP)**
- Improves by reducing initial load
- Be careful not to lazy load LCP element

**Interaction to Next Paint (INP)**
- Better interactivity with less initial JavaScript
- Fewer resources competing for main thread

**Cumulative Layout Shift (CLS)**
- Can worsen if dimensions not specified
- Always reserve space for lazy loaded content

### Common Libraries

### Vanilla JavaScript
- **lazysizes** - High performance, no dependencies
- **vanilla-lazyload** - Lightweight, IntersectionObserver-based
- **lozad.js** - Simple, modern, lightweight

### React
- **react-lazyload** - Component lazy loading
- **react-intersection-observer** - Hook-based
- **react-lazy-load-image-component** - Image specific

### Vue
- **vue-lazyload** - Directive-based
- **v-lazy-image** - Simple image lazy loading

### Accessibility Considerations

```html
<!-- Provide context for screen readers -->
<img
  class="progressive"
  src="placeholder.jpg"
  data-src="full-image.jpg"
  alt="Product photo"
  loading="lazy"
  decoding="async"
/>

<script>
  const img = document.querySelector('img.progressive');
  const swapSrc = (el) => {
    const full = el.getAttribute('data-src');
    if (full) el.src = full;
  };
  if (img.complete) swapSrc(img);
  else img.addEventListener('load', () => swapSrc(img), { once: true });
</script>
```

### SEO Implications

### Considerations
- Search engines now execute JavaScript
- Google supports lazy loading
- Ensure content is discoverable
- Use native `loading="lazy"` when possible

### Implementation for SEO
```html
<!-- Structured data for lazy loaded images -->
<script type="application/ld+json">
{
  "@type": "ImageObject",
  "contentUrl": "https://example.com/image.jpg",
  "description": "Image description"
}
</script>
```

### Testing Lazy Loading

### Browser DevTools
1. Network tab - Check when resources load
2. Performance tab - Measure impact
3. Coverage tab - See unused JavaScript/CSS

### Tools
- Lighthouse - Performance audit
- WebPageTest - Waterfall analysis
- Chrome User Experience Report

### Related Concepts

- [Skeleton Screen](glossary.md#skeleton-screen) - Shows while lazy loading
- [Viewport](glossary.md#viewport) - Triggers lazy loading
- [DOM](glossary.md#dom) - Manipulated during lazy loading
- Progressive Enhancement - Core principle

### Key Takeaways

- Lazy loading significantly improves initial page load
- Use native browser APIs when available
- Always specify dimensions to prevent layout shift
- Don't lazy load critical above-the-fold content
- Provide meaningful placeholders during loading
- Test impact on Core Web Vitals

## Live Regions (live-regions)

ARIA attributes that announce dynamic content changes to screen reader users without requiring focus

- **Related patterns:** patterns/navigation/pagination.md, patterns/user-feedback/notification.md, patterns/forms/form-validation.md
- **Topics:** Accessibility, ARIA, Screen Readers

**Definition:** ARIA live regions are parts of a web page that announce content changes to screen reader users automatically, without requiring user interaction or focus changes. (Accessibility,ARIA,Screen Readers)

ARIA live regions enable screen readers to announce dynamic content changes as they occur, without requiring users to navigate to the updated area. This is crucial for providing real-time feedback about page updates, notifications, and status messages to users who rely on assistive technology.

### How Live Regions Work

When content within a live region changes, screen readers automatically announce the update based on the region's configuration. This allows users to stay informed about important changes while continuing their current task.

### ARIA Live Region Attributes

### aria-live

Defines the priority of announcements:

```html
<!-- Polite: Waits for screen reader to finish current task -->
<div aria-live="polite">Status update here</div>

<!-- Assertive: Interrupts current screen reader output -->
<div aria-live="assertive">Critical alert here</div>

<!-- Off: No announcements (default) -->
<div aria-live="off">Silent updates</div>
```

### aria-atomic

Controls whether the entire region or just changes are announced:

```html
<!-- Announce entire region on any change -->
<div aria-live="polite" aria-atomic="true">
  <p>Items in cart: <span>3</span></p>
</div>

<!-- Announce only the changed parts -->
<div aria-live="polite" aria-atomic="false">
  <p>Saving... <span>50%</span> complete</p>
</div>
```

### aria-relevant

Specifies which changes trigger announcements:

```html
<!-- Announce additions and removals -->
<ul aria-live="polite" aria-relevant="additions removals">
  <li>Item 1</li>
  <li>Item 2</li>
</ul>

<!-- Options: additions, removals, text, all -->
<div aria-live="polite" aria-relevant="all">
  Complete monitoring
</div>
```

### Common Live Region Roles

### Status
For non-critical status updates:
```html
<div role="status">
  Form saved successfully
</div>
<!-- Equivalent to aria-live="polite" aria-atomic="true" -->
```

### Alert
For important messages requiring user awareness:
```html
<div role="alert">
  Error: Invalid email address
</div>
<!-- Equivalent to aria-live="assertive" aria-atomic="true" -->
```

### Log
For sequential information like chat messages:
```html
<div role="log">
  <div>User1: Hello</div>
  <div>User2: Hi there</div>
</div>
<!-- Equivalent to aria-live="polite" -->
```

### Timer
For countdown or elapsed time:
```html
<div role="timer">
  Time remaining: 5:00
</div>
<!-- Equivalent to aria-live="off" -->
```

### Implementation Examples

### Form Validation
```html
<form>
  <label for="email">Email:</label>
  <input type="email" id="email" aria-describedby="email-error">

  <!-- Live region for error messages -->
  <div id="email-error" role="alert" aria-live="assertive">
    <!-- Error messages inserted here dynamically -->
  </div>
</form>
```

### Loading States
```html
<button onclick="loadData()">Load More</button>

<!-- Status region for loading feedback -->
<div role="status" aria-live="polite">
  <!-- "Loading..." inserted during fetch -->
  <!-- "10 more items loaded" after completion -->
</div>
```

### Notifications
```html
<!-- Toast notification container -->
<div class="toast-container"
     role="region"
     aria-label="Notifications"
     aria-live="polite">
  <!-- Notifications inserted here -->
</div>
```

### Best Practices

### Do's ✅

1. **Choose appropriate politeness levels**
   - Use `polite` for most updates
   - Reserve `assertive` for critical/time-sensitive information

2. **Keep messages concise**
   - Screen reader users hear everything
   - Avoid verbose or repetitive announcements

3. **Provide context**
   - Include enough information to understand the change
   - Example: "Filter applied: 5 results" not just "5"

4. **Test with actual screen readers**
   - NVDA (Windows)
   - JAWS (Windows)
   - VoiceOver (macOS/iOS)
   - TalkBack (Android)

### Don'ts ❌

1. **Don't overuse assertive**
   - Interrupting users is disruptive
   - Most updates can wait for polite announcement

2. **Don't announce every change**
   - Frequent updates become noise
   - Focus on meaningful state changes

3. **Don't rely solely on live regions**
   - Also update focus when appropriate
   - Provide visual feedback for all users

4. **Don't dynamically create live regions**
   - Define regions on page load
   - Update content within existing regions

### Common Pitfalls

### Race Conditions
Live regions must exist before content changes:
```javascript
// ❌ Wrong: Region doesn't exist yet
container.innerHTML = '<div aria-live="polite">Updated!</div>';

// ✅ Right: Region exists, then content changes
// HTML: <div id="status" aria-live="polite"></div>
document.getElementById('status').textContent = 'Updated!';
```

### Platform Differences
Screen readers behave differently:
- Some announce all changes immediately
- Others queue polite announcements
- Test across multiple screen readers

### Content Clearing
Empty regions may announce "blank" or nothing:
```javascript
// Better to hide than empty
statusRegion.setAttribute('aria-hidden', 'true');
// Or remove from DOM entirely
statusRegion.remove();
```

### Related Patterns

Live regions are essential for:
- [Pagination](patterns/navigation/pagination.md) - Page change announcements
- [Notifications](patterns/user-feedback/notification.md) - Alert messages
- [Form Validation](patterns/forms/form-validation.md) - Error/success feedback

### Testing Tips

1. Use screen reader browser extensions for quick testing
2. Enable screen reader announcement viewers
3. Test timing of announcements
4. Verify announcement order in complex updates
5. Check behavior across different screen readers

### Key Takeaways

- Live regions announce changes without focus movement
- Choose politeness level based on urgency
- Keep announcements concise and contextual
- Test with real screen readers
- Define regions on page load, update content dynamically

## Pagination (pagination)

A navigation pattern that divides content into separate pages to improve usability and performance

- **Also called:** Page navigation, Paging
- **Topics:** Pattern, Navigation

**Definition:** A navigation pattern that divides content into separate pages, allowing users to browse through large sets of data or content in manageable chunks. (Pattern,Navigation)

Pagination is a fundamental user interface pattern that divides large sets of content into smaller, more manageable chunks called "pages". This pattern helps users navigate through extensive collections of data, such as search results, product listings, or blog posts.

### Key Characteristics

- Breaks content into discrete pages
- Provides navigation controls (previous/next, page numbers)
- Maintains user orientation within large datasets
- Supports bookmarking and sharing specific pages

### Benefits

- Improves page load performance
- Reduces cognitive load on users
- Enables better content organization
- Supports efficient server-side data handling

### Related Patterns

- [Pagination Pattern](patterns/navigation/pagination.md)
- [Infinite Scroll](patterns/navigation/infinite-scroll.md)
- [Load More](patterns/navigation/load-more.md)

### Learn More

For detailed implementation guidelines and best practices, see the [Pagination Pattern](patterns/navigation/pagination.md) documentation.

## Progressive Loading (progressive-loading)

A technique that loads content gradually to improve initial page load times and user experience

Progressive Loading is a performance optimization technique that loads content and resources gradually rather than all at once. This approach improves initial page load times and provides a better user experience, especially for users with slower internet connections.

### Key Concepts

- Content is loaded in stages or chunks
- Initial load focuses on essential content
- Additional content loads as needed
- Can be triggered by user actions or automatically

### Common Applications

- Image loading (thumbnails before full resolution)
- Paginated content loading
- Infinite scroll implementations
- Large data table loading

### Benefits

- Faster initial page loads
- Reduced server load
- Better user experience
- Improved perceived performance

### Related Patterns

- [Pagination](patterns/navigation/pagination.md)
- [Infinite Scroll](patterns/navigation/infinite-scroll.md)
- [Load More](patterns/navigation/load-more.md)

## Screen Reader (screen-reader)

Assistive technology that converts digital text and interface elements into speech or braille output for users with visual impairments

- **Related patterns:** patterns/navigation/pagination.md, patterns/forms/button.md, patterns/content-management/modal.md
- **Topics:** Accessibility, Assistive Technology

**Definition:** Software that interprets and vocalizes text, images, and other on-screen elements, enabling users with visual impairments to navigate and interact with digital content. (Accessibility,Assistive Technology)

A screen reader is assistive technology software that interprets what's displayed on a computer screen and converts it to speech (text-to-speech) or braille output. Screen readers enable people who are blind, have low vision, or have reading difficulties to use computers and access digital content.

### How Screen Readers Work

Screen readers analyze the Document Object Model (DOM) and accessibility tree to understand page structure and content. They then:
1. Convert text to synthesized speech
2. Announce interactive elements and their states
3. Provide navigation shortcuts
4. Communicate visual information through audio cues

### Popular Screen Readers

### Desktop
- **NVDA** (Windows) - Free, open-source
- **JAWS** (Windows) - Commercial, widely used in enterprise
- **VoiceOver** (macOS/iOS) - Built into Apple devices
- **Narrator** (Windows) - Built into Windows

### Mobile
- **VoiceOver** (iOS) - Native iOS screen reader
- **TalkBack** (Android) - Native Android screen reader
- **Voice Assistant** (Samsung devices)

### Key Features

### Navigation Modes
- **Browse Mode**: Read content linearly
- **Focus Mode**: Interact with forms and controls
- **Table Mode**: Navigate data tables cell by cell
- **Scan Mode**: Quick navigation in Windows

### Shortcuts & Commands
Screen readers provide keyboard shortcuts for:
- Jumping between headings (H key)
- Moving between landmarks (D key)
- Listing all links (Insert + F7 in NVDA)
- Finding specific text
- Reading from current position

### Web Development Considerations

### Semantic HTML
Use proper HTML elements to convey meaning:
```html
<!-- Good -->
<button>Submit</button>
<nav>...</nav>
<h1>Page Title</h1>

<!-- Bad -->
<div onclick="submit()">Submit</div>
<div class="navigation">...</div>
<div class="big-text">Page Title</div>
```

### ARIA Labels and Descriptions
Provide context when visual cues aren't enough:
```html
<button aria-label="Close dialog">×</button>
<input aria-describedby="password-help">
<p id="password-help">Must be at least 8 characters</p>
```

### Alternative Text
Describe images meaningfully:
```html
<!-- Informative image -->
<img src="chart.png" alt="Sales increased 25% in Q4">

<!-- Decorative image -->
<img src="divider.png" alt="" role="presentation">
```

### Focus Management
Ensure logical tab order and visible focus indicators:
```css
:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

/* Show focus ring only when appropriate */
:focus-visible {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}
```

### Testing with Screen Readers

### Quick Testing
1. **Enable screen reader** (Cmd+F5 for VoiceOver on Mac)
2. **Navigate with keyboard only** - no mouse
3. **Listen to content** - does it make sense?
4. **Check announcements** - are states and changes announced?
5. **Test forms** - can you complete them?

### Common Issues to Check
- Missing labels on form fields
- Buttons without accessible names
- Images without alt text
- Dynamic content changes not announced
- Complex widgets lacking ARIA attributes
- Illogical heading hierarchy

### Screen Reader Usage Statistics

According to WebAIM's Screen Reader User Survey:
- **JAWS**: 53.7% (Windows)
- **NVDA**: 30.7% (Windows)
- **VoiceOver**: 6.5% (macOS)
- **VoiceOver iOS**: 6.1% (Mobile)

### Best Practices

### Do's ✅
- Test with real screen readers, not just automated tools
- Use semantic HTML before adding ARIA
- Provide skip links for repetitive content
- Ensure all interactive elements are keyboard accessible
- Announce dynamic content changes with live regions
- Write descriptive link text ("Read more about pricing" not "Click here")

### Don'ts ❌
- Don't rely solely on color to convey information
- Avoid using placeholder text as labels
- Don't auto-play media with sound
- Never trap keyboard focus (except in modals)
- Don't use ARIA to fix bad HTML

### Common Announcements

Understanding what screen readers announce helps design better interfaces:

| Element | Typical Announcement |
|---------|---------------------|
| `<button>` | "Submit, button" |
| `<a href>` | "Contact us, link" |
| `<h1>` | "Heading level 1, Welcome" |
| `<nav>` | "Navigation landmark" |
| `aria-expanded="false"` | "collapsed" |
| `aria-live="polite"` | Announces changes |
| `disabled` | "dimmed" or "disabled" |

### Related Concepts

- [Keyboard Navigation](glossary.md#keyboard-navigation) - Essential for screen reader users
- [ARIA Attributes](glossary.md#aria-attributes) - Enhance screen reader experience
- [Live Regions](glossary.md#live-regions) - Announce dynamic changes
- [Semantic HTML](glossary.md#semantic-html) - Foundation for screen reader compatibility

### Resources

- [WebAIM Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)
- [NVDA Download](https://www.nvaccess.org/)
- [VoiceOver Guide](https://support.apple.com/guide/voiceover/welcome/mac)
- [Screen Reader User Survey](https://webaim.org/projects/screenreadersurvey9/)

### Key Takeaways

- Screen readers are essential for many users to access web content
- Semantic HTML is the foundation of screen reader accessibility
- Test with actual screen readers, not just automated tools
- Consider screen reader users in every design decision
- Small improvements can make huge differences in user experience

## Semantic HTML (semantic-html)

HTML elements that carry meaning about their content structure and purpose

Semantic HTML refers to using HTML elements that clearly describe their meaning and purpose, rather than just their presentation. This practice improves accessibility, SEO, and code maintainability by providing clear structural information about the content.

### Key Elements

- `<nav>`: Navigation sections
- `<main>`: Main content area
- `<article>`: Self-contained content
- `<section>`: Thematic grouping
- `<header>`: Introductory content
- `<footer>`: Concluding content

### Benefits

- Improved accessibility
- Better SEO performance
- Clearer code structure
- Enhanced maintainability
- Consistent cross-browser support

### Example Usage

```html
<nav aria-label="Main">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
  </ul>
</nav>

<main>
  <article>
    <h1>Article Title</h1>
    <section>
      <h2>Section Heading</h2>
      <p>Content goes here...</p>
    </section>
  </article>
</main>
```

### Related Patterns

- [Pagination](patterns/navigation/pagination.md)
- [Navigation Patterns](index/navigation.md)

## Skeleton Screen (skeleton-screen)

A loading state UI pattern that displays placeholder content shapes while actual content is being fetched

- **Related patterns:** patterns/navigation/infinite-scroll.md, patterns/navigation/load-more.md
- **Topics:** UX Pattern, Performance, Loading States

**Definition:** A user interface loading pattern that shows a simplified, gray-box version of content layout before the actual content loads, providing users with a visual indication of incoming content structure. (UX Pattern,Performance,Loading States)

A skeleton screen (also called skeleton loader or ghost element) is a version of the UI that doesn't contain actual content but instead shows placeholder shapes that mimic the page's layout. These placeholders are displayed while the real content is loading, giving users a sense of progress and reducing perceived loading time.

### Why Use Skeleton Screens?

### Benefits Over Traditional Loading
- **Reduced perceived wait time** - Users feel the app is faster
- **Progressive content reveal** - Content appears gradually
- **Maintained layout stability** - Prevents content jumping
- **Better than spinners** - Shows what's coming, not just "loading"
- **Improved user experience** - Less jarring than blank screens

### Anatomy of a Skeleton Screen

```css
/* Basic skeleton component */
.skeleton {
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Respect user's motion preferences */
@media (prefers-reduced-motion: reduce) {
  .skeleton {
    animation: none;
    background-position: 0 0;
    transition: none;
  }
}

/* Shape variations */
.skeleton-text {
  height: 16px;
  border-radius: 4px;
  margin-bottom: 8px;
}

.skeleton-title {
  height: 24px;
  width: 60%;
}

.skeleton-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.skeleton-image {
  width: 100%;
  height: 200px;
  border-radius: 8px;
}
```

### Implementation Examples

### Card Skeleton
```html
<div class="card-skeleton">
  <div class="skeleton skeleton-image"></div>
  <div class="card-body">
    <div class="skeleton skeleton-title"></div>
    <div class="skeleton skeleton-text"></div>
    <div class="skeleton skeleton-text" style="width: 80%"></div>
  </div>
</div>
```

### List Item Skeleton
```html
<div class="list-item-skeleton">
  <div class="skeleton skeleton-avatar"></div>
  <div class="content">
    <div class="skeleton skeleton-text" style="width: 40%"></div>
    <div class="skeleton skeleton-text" style="width: 60%"></div>
  </div>
</div>
```

### React Component
```jsx
function SkeletonCard({ isLoading, children }) {
  if (isLoading) {
    return (
      <div className="card">
        <div className="skeleton skeleton-image" />
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-text" />
      </div>
    );
  }

  return children;
}

// Usage
<SkeletonCard isLoading={!data}>
  {data && <Card data={data} />}
</SkeletonCard>
```

### Design Principles

### Match Content Structure
The skeleton should closely resemble the actual content layout:
```html
<!-- Skeleton matches real content structure -->
<!-- Skeleton -->
<div class="skeleton-post">
  <div class="skeleton skeleton-avatar"></div>
  <div class="skeleton skeleton-text" style="width: 150px"></div>
  <div class="skeleton skeleton-image"></div>
  <div class="skeleton skeleton-text"></div>
</div>

<!-- Real Content -->
<div class="post">
  <img class="avatar" src="user.jpg" />
  <h3 class="username">John Doe</h3>
  <img class="post-image" src="photo.jpg" />
  <p class="caption">Beautiful sunset!</p>
</div>
```

### Animation Types

#### Shimmer Effect (Most Common)
```css
.skeleton-shimmer {
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  animation: shimmer 1.5s infinite;
}
```

#### Pulse Effect
```css
.skeleton-pulse {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.4; }
  100% { opacity: 1; }
}
```

#### Wave Effect
```css
.skeleton-wave {
  position: relative;
  overflow: hidden;
}

.skeleton-wave::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transform: translateX(-100%);
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: wave 1.5s infinite;
}

@keyframes wave {
  100% { transform: translateX(100%); }
}
```

### When to Use Skeleton Screens

### Good Use Cases ✅
- **Initial page load** - First meaningful paint
- **Lazy-loaded content** - Images, videos, embeds
- **Dynamic content updates** - Search results, filtered lists
- **Infinite scroll** - New items loading
- **Dashboard widgets** - Multiple data sources
- **Card-based layouts** - Consistent, repeatable structures

### Poor Use Cases ❌
- **Very fast loads** (< 300ms) - Can cause flashing
- **Unpredictable layouts** - When structure varies greatly
- **Error states** - Use error messages instead
- **Small UI elements** - Buttons, badges, icons
- **Critical actions** - Payment forms, urgent alerts

### Performance Considerations

### Prevent Layout Shift
```css
/* Define dimensions to prevent CLS */
.skeleton-container {
  min-height: 200px; /* Matches loaded content */
}

.skeleton-image {
  aspect-ratio: 16 / 9; /* Maintains ratio */
}
```

### Progressive Loading
```javascript
// Load critical content first
async function loadContent() {
  // Show skeleton
  showSkeleton();

  // Load in priority order
  const critical = await fetchCriticalData();
  renderCritical(critical);

  const secondary = await fetchSecondaryData();
  renderSecondary(secondary);

  // Hide skeleton
  hideSkeleton();
}
```

### Accessibility

### Screen Reader Considerations
```html
<!-- Announce loading state -->
<div role="status" aria-live="polite" aria-label="Loading content" aria-busy="true">
  <div class="skeleton-card">
    <!-- Skeleton elements -->
  </div>
</div>

<!-- Hide decorative skeletons -->
<div class="skeleton" aria-hidden="true"></div>
```

### Provide Loading Context
```html
<div class="loading-container">
  <span class="visually-hidden">Loading posts...</span>
  <div class="skeleton-list">
    <!-- Skeleton items -->
  </div>
</div>
```

### Common Libraries

### React
- **react-loading-skeleton** - Automatic skeleton generation
- **react-content-loader** - SVG-based skeletons
- **react-placeholders** - Ready-made placeholder components

### Vue
- **vue-loading-skeleton** - Vue skeleton components
- **vue-content-loader** - SVG placeholder loader

### CSS Frameworks
- **Bootstrap** - `.placeholder` classes
- **Tailwind CSS** - `animate-pulse` utility
- **Material-UI** - `<Skeleton>` component

### Best Practices

### Do's ✅
- Match the skeleton to actual content layout
- Use smooth, subtle animations
- Keep skeleton colors low contrast
- Define dimensions to prevent layout shift
- Remove skeletons once content loads
- Consider showing partial real content as it arrives

### Don'ts ❌
- Don't use skeletons for very fast loads
- Avoid overly complex skeleton layouts
- Don't animate too aggressively
- Never show skeletons indefinitely
- Don't use for error or empty states

### Alternative Loading Patterns

- **Spinners** - Simple, doesn't show structure
- **Progress bars** - Shows completion percentage
- **Lazy loading** - Load content as needed
- **Progressive image loading** - Blur to sharp
- **Optimistic UI** - Show expected result immediately

### Key Takeaways

- Skeleton screens reduce perceived loading time
- They should match the structure of actual content
- Use subtle animations like shimmer or pulse
- Prevent layout shift by defining dimensions
- Consider accessibility with proper ARIA labels
- Not suitable for all loading scenarios

## Throttle and Debounce (throttle-debounce)

Performance optimization techniques that limit how often a function can be executed in response to continuous events

- **Related patterns:** patterns/forms/autocomplete.md, patterns/navigation/infinite-scroll.md, patterns/forms/button.md
- **Topics:** Performance, JavaScript, Optimization

**Definition:** JavaScript techniques for controlling the frequency of function execution, particularly useful for optimizing performance when handling events that fire rapidly. (Performance,JavaScript,Optimization)

Throttle and debounce are two similar but distinct techniques used to control how many times a function is executed over time. They're essential for optimizing performance when dealing with events that can fire many times in quick succession, such as scrolling, resizing, typing, or mouse movement.

### The Problem They Solve

Without rate limiting, event handlers can fire hundreds of times per second:
```javascript
// BAD: Function runs on every scroll event (potentially 100+ times/second)
window.addEventListener('scroll', () => {
  expensiveCalculation(); // Performance killer!
});

// BAD: API call on every keystroke
searchInput.addEventListener('input', (e) => {
  searchAPI(e.target.value); // Too many requests!
});
```

### Debounce

Debounce ensures a function only executes after a specified period of inactivity. It delays execution until after events have stopped firing.

### How Debounce Works
1. When event fires, start a timer
2. If event fires again before timer ends, reset timer
3. Only execute function when timer completes

### Implementation
```javascript
function debounce(func, delay) {
  let timeoutId;

  return function(...args) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// Usage
const searchInput = document.getElementById('search');
const debouncedSearch = debounce((query) => {
  console.log('Searching for:', query);
  performSearch(query);
}, 300);

searchInput.addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});
```

### Visual Timeline
```
Events:  x--x--x--x----------------x--x-------
Debounce:                         F           F
         └─ Function executes 300ms after last event
```

### Common Use Cases
- **Search input** - Wait for user to stop typing
- **Form validation** - Validate after user finishes
- **Window resize** - Recalculate layout after resizing ends
- **Auto-save** - Save after user pauses editing

### Throttle

Throttle ensures a function executes at most once in a specified time period. It limits execution frequency but guarantees regular execution during continuous events.

### How Throttle Works
1. Execute function immediately on first call
2. Ignore subsequent calls until time period passes
3. Execute again after cooldown period

### Implementation
```javascript
function throttle(func, limit) {
  let inThrottle;
  let lastArgs;
  let lastThis;

  return function(...args) {
    lastArgs = args;
    lastThis = this;

    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;

      setTimeout(() => {
        inThrottle = false;
        // Execute with latest args/context if called during throttle
        if (lastArgs) {
          func.apply(lastThis, lastArgs);
          lastArgs = null;
          lastThis = null;
        }
      }, limit);
    }
  };
}

// Usage with trailing call option
function throttleWithTrailing(func, limit) {
  let inThrottle;
  let lastArgs;

  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;

      setTimeout(() => {
        inThrottle = false;
        if (lastArgs) func.apply(this, lastArgs);
        lastArgs = null;
      }, limit);
    } else {
      // Record only when calls occur during cooldown
      lastArgs = args;
    }
  };
}

// Usage
const handleScroll = throttle(() => {
  console.log('Scroll position:', window.scrollY);
  updateScrollIndicator();
}, 100);

window.addEventListener('scroll', handleScroll);
```

### Visual Timeline
```
Events:  x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x
Throttle: F-------F-------F-------F------
         └─ Function executes at regular intervals
```

### Common Use Cases
- **Scroll events** - Update UI during scrolling
- **Mouse move tracking** - Track position periodically
- **API rate limiting** - Prevent exceeding API limits
- **Game loop updates** - Fixed frame rate updates
- **Progress updates** - Regular status updates

### Key Differences

| Aspect | Debounce | Throttle |
|--------|----------|----------|
| **Execution** | After events stop | During events at intervals |
| **Frequency** | Once after delay | Multiple times at fixed rate |
| **First call** | Delayed | Immediate (usually) |
| **Use case** | Wait for completion | Regular updates |
| **Example** | Search as you type | Scroll position |

### Advanced Implementations

### Debounce with Immediate Option
```javascript
function debounce(func, wait, immediate) {
  let timeout;

  return function(...args) {
    const callNow = immediate && !timeout;

    clearTimeout(timeout);

    timeout = setTimeout(() => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    }, wait);

    if (callNow) func.apply(this, args);
  };
}

// Execute immediately on first call, then debounce
const saveDocument = debounce(save, 1000, true);
```

### Throttle with Leading and Trailing
```javascript
function throttle(func, wait, options = {}) {
  let timeout, context, args, result;
  let previous = 0;

  const later = function() {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  return function(..._args) {
    const now = Date.now();
    if (!previous && options.leading === false) previous = now;

    const remaining = wait - (now - previous);
    context = this;
    args = _args;

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;

    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }

    return result;
  };
}
```

### Cancel and Flush Methods
```javascript
function debounceWithControls(func, wait) {
  let timeout;

  function debounced(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  }

  debounced.cancel = function() {
    clearTimeout(timeout);
    timeout = null;
  };

  debounced.flush = function(...args) {
    clearTimeout(timeout);
    func.apply(this, args);
  };

  return debounced;
}

// Usage
const debouncedSave = debounceWithControls(save, 1000);
// Force immediate execution
debouncedSave.flush();
// Cancel pending execution
debouncedSave.cancel();
```

### Real-World Examples

### Search Autocomplete
```javascript
// Debounce to avoid too many API calls
const searchSuggestions = debounce(async (query) => {
  const results = await fetch(`/api/search?q=${query}`);
  displaySuggestions(await results.json());
}, 300);

searchInput.addEventListener('input', (e) => {
  searchSuggestions(e.target.value);
});
```

### Infinite Scroll
```javascript
// Throttle to check scroll position periodically
const checkScrollPosition = throttle(() => {
  const nearBottom = window.innerHeight + window.scrollY >=
                      document.body.offsetHeight - 100;

  if (nearBottom) {
    loadMoreContent();
  }
}, 200);

window.addEventListener('scroll', checkScrollPosition);
```

### Resize Handler
```javascript
// Debounce to recalculate after resizing stops
const handleResize = debounce(() => {
  recalculateLayout();
  updateCharts();
}, 250);

window.addEventListener('resize', handleResize);
```

### Libraries

### Lodash
```javascript
import { debounce, throttle } from 'lodash';

const debouncedFunc = debounce(func, 300);
const throttledFunc = throttle(func, 300);
```

### Underscore
```javascript
const debouncedFunc = _.debounce(func, 300);
const throttledFunc = _.throttle(func, 300);
```

### Performance Impact

### Without Rate Limiting
```javascript
// Can fire 100+ times per second
window.addEventListener('scroll', () => {
  // Each execution:
  getBoundingClientRect(); // Triggers reflow
  updateStyles();          // Triggers repaint
  sendAnalytics();        // Network request
});
```

### With Rate Limiting
```javascript
// Fires max 10 times per second
window.addEventListener('scroll', throttle(() => {
  // Reduced from 100+ to 10 executions/second
  // Can significantly reduce CPU usage
}, 100));
```

### Common Mistakes

### Using Wrong Technique
```javascript
// Wrong: Throttle for search (executes during typing)
searchInput.addEventListener('input',
  throttle(search, 300) // ❌ Searches while typing
);

// Right: Debounce for search (waits for pause)
searchInput.addEventListener('input',
  debounce(search, 300) // ✅ Searches after typing stops
);
```

### Forgetting to Clean Up
```javascript
// Memory leak risk
useEffect(() => {
  const handleScroll = throttle(updatePosition, 100);
  window.addEventListener('scroll', handleScroll);

  // Must remove the same reference
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}, []);
```

### Best Practices

### Do's ✅
- Choose appropriate delays (typically 100-300ms)
- Use debounce for input validation
- Use throttle for continuous events
- Clean up event listeners
- Consider using established libraries
- Test on slow devices

### Don'ts ❌
- Don't use delays that are too short (< 50ms)
- Don't use delays that are too long (> 1000ms for interactions)
- Don't forget the user experience
- Don't throttle critical safety functions
- Don't debounce time-sensitive operations

### Related Concepts

- [DOM](glossary.md#dom) - Events that need throttling/debouncing
- [Lazy Loading](glossary.md#lazy-loading) - Another performance technique
- RequestAnimationFrame - Alternative for animations
- Event Delegation - Reduces number of listeners

### Key Takeaways

- Debounce delays execution until after events stop
- Throttle limits execution to fixed intervals
- Both improve performance for high-frequency events
- Choose based on use case: completion vs. progress
- Critical for smooth user interfaces
- Small implementation, big performance impact

## Touch Targets (touch-targets)

Interactive UI elements sized and spaced appropriately for touch interaction on mobile devices

- **Related patterns:** patterns/navigation/pagination.md, patterns/navigation/tabs.md, patterns/forms/button.md
- **Topics:** Mobile, Accessibility, UX

**Definition:** The area of a user interface element that responds to touch input, which must be large enough for accurate finger interaction on touchscreen devices. (Mobile,Accessibility,UX)

Touch targets are the areas of a user interface that respond to touch input. They must be appropriately sized and spaced to accommodate human finger interaction, ensuring users can accurately and comfortably interact with touchscreen interfaces without frustration or errors.

### Recommended Sizes

### Platform Guidelines

**iOS Human Interface Guidelines:**
- Minimum: 44×44 pts (points)
- Comfortable: 48×48 pts or larger

**Material Design (Android):**
- Minimum: 48×48 dp (density-independent pixels)
- Recommended: 56×56 dp for primary actions

**WCAG 2.5.5 (Level AAA):**
- Minimum: 44×44 CSS pixels
- Exception for inline text links

**WCAG 2.2 (Level AA):**
- Minimum: 24×24 CSS pixels with adequate spacing (exceptions apply for controls in certain authoring contexts or when adequate spacing cannot be applied)

### Common Problems

### Fat Finger Problem
When touch targets are too small, users accidentally tap adjacent elements, leading to errors and frustration.

### Edge Positioning
Targets too close to screen edges are hard to reach, especially with one-handed use or protective cases.

### Overlapping Hit Areas
Invisible touch areas that overlap cause mispresses even when visual elements appear separated.

### Implementation Best Practices

### Minimum Spacing
```css
.touch-target {
  min-width: 44px;
  min-height: 44px;
  margin: 8px; /* Minimum spacing between targets */
}
```

### Expanding Hit Areas
Make touch areas larger than visual elements:
```css
.button {
  position: relative;
  padding: 12px 16px;
}

.button::before {
  content: '';
  position: absolute;
  top: -8px;
  right: -8px;
  bottom: -8px;
  left: -8px;
}

/* Note: Pseudo-elements don't expand the element's CSS box; they proxy events to the parent but can be brittle. Consider using padding or min-size for more robust hit areas. */
```

### Thumb-Friendly Zones
Place primary actions in easy-to-reach areas:
- **Bottom third of screen** for one-handed use
- **Center areas** for tablets
- **Avoid top corners** on large phones

### Accessibility Considerations

### Motor Impairments
Users with motor disabilities need larger targets:
- Tremors require extra spacing
- Limited dexterity needs bigger targets
- Consider alternative input methods

### Age Factors
- **Children:** Need larger targets due to developing motor skills
- **Elderly:** Benefit from increased size and spacing

### Assistive Technology
- Screen readers may require different interaction patterns
- Switch controls need clear target boundaries
- Voice control benefits from visible labels

### Testing Methods

### Device Testing
- Test on actual devices, not just simulators
- Use different hand positions and grips
- Test with and without cases

### Heat Map Analysis
- Track tap locations to identify problem areas
- Look for clusters indicating missed targets
- Measure error rates

### User Testing
- Observe real users interacting with your interface
- Note hesitation or multiple attempts
- Ask about difficulty hitting targets

### Common Patterns

### Button Groups
Space buttons adequately in toolbars and action sheets:
```css
.button-group > * + * {
  margin-left: 16px; /* Sufficient spacing */
}
```

### List Items
Make entire rows tappable:
```css
.list-item {
  display: block;
  padding: 16px;
  min-height: 56px;
}
```

### Icon Buttons
Ensure adequate hit areas for small icons:
```css
.icon-button {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon {
  width: 24px;
  height: 24px;
}
```

### Related Patterns

Touch target considerations apply to:
- [Pagination](patterns/navigation/pagination.md) - Page number buttons
- [Tabs](patterns/navigation/tabs.md) - Tab selection areas
- [Buttons](patterns/forms/button.md) - All interactive buttons

### Tools & Resources

- **Chrome DevTools:** Device mode for testing
- **Accessibility Inspector:** iOS/macOS testing tool
- **Touch Target Guidelines:** Platform-specific documentation
- **Figma/Sketch plugins:** Touch target validators

### Key Takeaways

1. **44×44px minimum** for comfortable interaction (Apple HIG; Material Design recommends 48×48dp)
2. **8px minimum spacing** between targets
3. **Expand hit areas** beyond visual boundaries
4. **Consider context** - one-handed use, device size
5. **Test on real devices** with real users
6. **Account for accessibility** needs

## Viewport (viewport)

The visible area of a web page within a browser window or mobile device screen

- **Related patterns:** patterns/navigation/pagination.md, patterns/navigation/infinite-scroll.md, patterns/navigation/load-more.md
- **Topics:** Browser, Responsive Design, Mobile

**Definition:** The visible area of a web page that users can see without scrolling, varying by device and browser window size. (Browser,Responsive Design,Mobile)

The viewport is the user's visible area of a web page. It varies with the device - it will be smaller on a mobile phone than on a computer screen. The viewport is fundamental to responsive web design and affects how content is displayed and interacted with across different devices.

### Types of Viewports

### Visual Viewport
The part of the page that's currently visible in the browser window. When users pinch-zoom, the visual viewport gets smaller while showing a zoomed-in portion of the layout viewport.

### Layout Viewport
The area where the browser renders the website. On mobile devices, this is typically wider than the visual viewport to accommodate desktop sites.

### Viewport Meta Tag

Control how your page displays on mobile devices:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

Common attributes:
- **width:** Sets viewport width (device-width or specific value)
- **initial-scale:** Sets initial zoom level
- **maximum-scale:** Maximum zoom level allowed
- **minimum-scale:** Minimum zoom level allowed
- **user-scalable:** Whether users can zoom (avoid disabling zoom for accessibility)

### Viewport Units

CSS units relative to viewport dimensions:
- **vw:** 1% of viewport width
- **vh:** 1% of viewport height
- **vmin:** 1% of viewport's smaller dimension
- **vmax:** 1% of viewport's larger dimension
- **dvh/dvw:** Dynamic viewport height/width (accounts for browser UI)
- **svh/svw:** Small viewport height/width (minimum size)
- **lvh/lvw:** Large viewport height/width (maximum size)

### Common Use Cases

### Responsive Design
Adapting layouts based on viewport size using media queries:
```css
@media (max-width: 768px) {
  /* Mobile styles */
}
```

### Full-Height Sections
Creating sections that fill the viewport:
```css
.hero {
  height: 100vh;
}

/* Note: On mobile, consider using dynamic viewport units (dvh/svh/lvh) to account for browser chrome that hides/shows on scroll */
```

### Viewport-Based Typography
Scaling text based on viewport size:
```css
h1 {
  font-size: clamp(2rem, 5vw, 4rem);
}
```

### Mobile Considerations

- **Safe Areas:** Account for device notches and rounded corners
- **Orientation Changes:** Handle landscape/portrait transitions
- **Browser Chrome:** Consider address bars that hide/show on scroll
- **Pinch-to-Zoom:** Ensure accessibility by not disabling zoom

### Testing Viewports

Tools for testing across viewports:
- Browser DevTools responsive mode
- BrowserStack or similar services
- Physical device testing
- Viewport resizer extensions

### Related Patterns

Viewport considerations are crucial for:
- [Pagination](patterns/navigation/pagination.md) - Ensuring controls are visible
- [Infinite Scroll](patterns/navigation/infinite-scroll.md) - Detecting when to load content
- [Load More](patterns/navigation/load-more.md) - Button positioning in viewport

### Best Practices

1. Always include the viewport meta tag
2. Test on real devices, not just browser tools
3. Consider both portrait and landscape orientations
4. Account for dynamic viewport changes (mobile browsers)
5. Ensure critical content is above the fold
6. Use viewport units carefully with fallbacks
