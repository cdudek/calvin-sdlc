# Tree View: demo code

**Sections (line range):** basic 7-43

Code of the live demos on https://uxpatterns.dev/patterns/data-display/tree-view. Plain HTML, CSS and JS.

## basic

```html
<div class="demo-shell card tree-card">
  <ul class="tree">
    <li><button type="button" class="tree-toggle" aria-expanded="true">Design system</button>
      <ul>
        <li>Tokens</li>
        <li>Components</li>
      </ul>
    </li>
    <li><button type="button" class="tree-toggle" aria-expanded="false">Documentation</button>
      <ul hidden>
        <li>Patterns</li>
        <li>Guides</li>
      </ul>
    </li>
  </ul>
</div>
```

```css
.tree-card { padding: 20px; }
.tree, .tree ul { list-style: none; margin: 0; padding-left: 18px; display: grid; gap: 10px; }
.tree-toggle { border: 0; background: none; font-weight: 700; padding: 0; text-align: left; cursor: pointer; }
```

```js
document.querySelectorAll('.tree-toggle').forEach((button) => {
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    button.nextElementSibling.hidden = expanded;
  });
});
```
