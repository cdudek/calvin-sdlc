# Search Field: demo code

**Sections (line range):** basic 7-45

Code of the live demos on https://uxpatterns.dev/patterns/forms/search-field. Plain HTML, CSS and JS.

## basic

```html
<div class="demo-shell card search-demo">
  <label for="search-demo-input">Search patterns</label>
  <div class="search-row">
    <input id="search-demo-input" type="search" placeholder="Search forms, navigation, media..." />
    <button type="button" id="search-clear">Clear</button>
  </div>
  <ul id="search-list">
    <li>Autocomplete</li>
    <li>Pagination</li>
    <li>Empty States</li>
    <li>Image Upload</li>
  </ul>
</div>
```

```css
.search-demo { padding: 24px; display: grid; gap: 12px; }
label { font-weight: 600; }
.search-row { display: grid; gap: 10px; grid-template-columns: 1fr auto; }
input { border: 1px solid #cbd5e1; border-radius: 12px; padding: 12px 14px; }
button { border: 1px solid #cbd5e1; background: white; border-radius: 12px; padding: 12px 14px; }
ul { margin: 0; padding-left: 20px; display: grid; gap: 8px; }
```

```js
const input = document.getElementById('search-demo-input');
const clear = document.getElementById('search-clear');
const list = document.getElementById('search-list');
const items = [...list.querySelectorAll('li')];
input.addEventListener('input', () => {
  const query = input.value.toLowerCase();
  items.forEach((item) => { item.hidden = !item.textContent.toLowerCase().includes(query); });
});
clear.addEventListener('click', () => { input.value = ''; items.forEach((item) => item.hidden = false); input.focus(); });
```
