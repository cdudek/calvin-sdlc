# Rich Text Editor: demo code

**Sections (line range):** basic 7-34

Code of the live demos on https://uxpatterns.dev/patterns/forms/rich-text-editor. Plain HTML, CSS and JS.

## basic

```html
<div class="demo-shell card rte">
  <div class="toolbar">
    <button type="button" data-command="bold"><strong>B</strong></button>
    <button type="button" data-command="italic"><em>I</em></button>
    <button type="button" data-command="insertUnorderedList">• List</button>
  </div>
  <div class="editor" contenteditable="true">Start typing meeting notes here.</div>
  <p class="muted">Formatting is intentionally lightweight in this demo.</p>
</div>
```

```css
.rte { padding: 18px; display: grid; gap: 12px; }
.toolbar { display: flex; gap: 8px; flex-wrap: wrap; }
.toolbar button { border: 1px solid #cbd5e1; background: white; border-radius: 10px; padding: 8px 12px; }
.editor { min-height: 180px; border: 1px solid #cbd5e1; border-radius: 12px; padding: 14px; background: white; line-height: 1.6; }
p { margin: 0; font-size: 14px; }
```

```js
document.querySelectorAll('[data-command]').forEach((button) => {
  button.addEventListener('click', () => { document.execCommand(button.dataset.command, false); });
});
```
