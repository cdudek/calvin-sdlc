# Tag Input: demo code

**Sections (line range):** basic 7-44

Code of the live demos on https://uxpatterns.dev/patterns/forms/tag-input. Plain HTML, CSS and JS.

## basic

```html
<div class="demo-shell card tag-card">
  <label for="tag-input">Topics</label>
  <div class="tag-list" id="tag-list">
    <span class="tag">Accessibility <button type="button" aria-label="Remove Accessibility">×</button></span>
  </div>
  <input id="tag-input" type="text" placeholder="Type a tag and press Enter" />
</div>
```

```css
.tag-card { padding: 24px; display: grid; gap: 12px; }
label { font-weight: 600; }
.tag-list { display: flex; flex-wrap: wrap; gap: 8px; }
.tag { display: inline-flex; gap: 8px; align-items: center; padding: 8px 12px; border-radius: 999px; background: #e2e8f0; }
.tag button { border: 0; background: none; cursor: pointer; }
input { border: 1px solid #cbd5e1; border-radius: 12px; padding: 12px 14px; }
```

```js
const input = document.getElementById('tag-input');
const list = document.getElementById('tag-list');
function wireRemoval(button) { button.addEventListener('click', () => button.parentElement.remove()); }
list.querySelectorAll('button').forEach(wireRemoval);
input.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' || !input.value.trim()) return;
  event.preventDefault();
  const tag = document.createElement('span');
  tag.className = 'tag';
  tag.innerHTML = input.value.trim() + ' <button type="button" aria-label="Remove tag">×</button>';
  list.appendChild(tag);
  wireRemoval(tag.querySelector('button'));
  input.value = '';
});
```
