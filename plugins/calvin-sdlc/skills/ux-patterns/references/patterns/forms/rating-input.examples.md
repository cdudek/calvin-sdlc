# Rating Input: demo code

**Sections (line range):** basic 7-36

Code of the live demos on https://uxpatterns.dev/patterns/forms/rating-input. Plain HTML, CSS and JS.

## basic

```html
<div class="demo-shell card rating-card">
  <p><strong>How helpful was this guide?</strong></p>
  <div class="stars" role="radiogroup" aria-label="Rating">
    <button type="button" class="star" data-value="1" aria-label="Rate 1 out of 5">☆</button><button type="button" class="star" data-value="2" aria-label="Rate 2 out of 5">☆</button><button type="button" class="star" data-value="3" aria-label="Rate 3 out of 5">☆</button><button type="button" class="star" data-value="4" aria-label="Rate 4 out of 5">☆</button><button type="button" class="star" data-value="5" aria-label="Rate 5 out of 5">☆</button>
  </div>
  <p id="rating-status" class="muted">Choose a rating.</p>
</div>
```

```css
.rating-card { padding: 24px; display: grid; gap: 14px; }
.stars { display: flex; gap: 8px; }
.star { border: 0; background: none; font-size: 34px; cursor: pointer; color: #f59e0b; }
.star.active { color: #d97706; }
p { margin: 0; }
```

```js
const stars = [...document.querySelectorAll('.star')];
const status = document.getElementById('rating-status');
stars.forEach((star) => star.addEventListener('click', () => {
  const value = Number(star.dataset.value);
  stars.forEach((item, index) => { item.classList.toggle('active', index < value); item.textContent = index < value ? '★' : '☆'; });
  status.textContent = 'Selected rating: ' + value + ' out of 5';
}));
```
