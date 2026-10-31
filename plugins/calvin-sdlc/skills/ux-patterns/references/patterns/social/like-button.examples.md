# Like Button: demo code

**Sections (line range):** basic 7-34

Code of the live demos on https://uxpatterns.dev/patterns/social/like-button. Plain HTML, CSS and JS.

## basic

```html
<div class="demo-shell card like-card">
  <button type="button" id="like-button" aria-pressed="false">♡ <span id="like-count">128</span></button>
  <p class="muted">Tap to like this pattern.</p>
</div>
```

```css
.like-card { padding: 24px; display: grid; gap: 12px; }
button { width: fit-content; border: 1px solid #cbd5e1; border-radius: 999px; padding: 10px 16px; background: white; font-size: 18px; }
button.active { background: #fee2e2; border-color: #fda4af; color: #be123c; }
p { margin: 0; }
```

```js
const button = document.getElementById('like-button');
const count = document.getElementById('like-count');
button.addEventListener('click', () => {
  const active = button.getAttribute('aria-pressed') === 'true';
  button.setAttribute('aria-pressed', String(!active));
  button.classList.toggle('active', !active);
  button.firstChild.textContent = !active ? '♥ ' : '♡ ';
  count.textContent = String(Number(count.textContent) + (!active ? 1 : -1));
});
```
