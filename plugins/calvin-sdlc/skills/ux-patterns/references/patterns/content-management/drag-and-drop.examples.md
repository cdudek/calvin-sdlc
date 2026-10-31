# Drag and Drop: demo code

**Sections (line range):** basic 7-41

Code of the live demos on https://uxpatterns.dev/patterns/content-management/drag-and-drop. Plain HTML, CSS and JS.

## basic

```html
<div class="demo-shell card dnd-card">
  <p><strong>Reorder the launch checklist</strong></p>
  <ul id="dnd-list">
    <li draggable="true">Draft release notes</li>
    <li draggable="true">QA the signup flow</li>
    <li draggable="true">Prepare launch email</li>
  </ul>
</div>
```

```css
.dnd-card { padding: 20px; display: grid; gap: 12px; }
ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
li { padding: 12px 14px; border-radius: 12px; border: 1px solid #cbd5e1; background: white; cursor: grab; }
li.dragging { opacity: 0.5; }
p { margin: 0; }
```

```js
const list = document.getElementById('dnd-list');
let dragged = null;
list.querySelectorAll('li').forEach((item) => {
  item.addEventListener('dragstart', () => { dragged = item; item.classList.add('dragging'); });
  item.addEventListener('dragend', () => item.classList.remove('dragging'));
  item.addEventListener('dragover', (event) => event.preventDefault());
  item.addEventListener('drop', (event) => {
    event.preventDefault();
    if (dragged && dragged !== item) list.insertBefore(dragged, item);
  });
});
```
