# Slider: demo code

**Sections (line range):** basic 7-29

Code of the live demos on https://uxpatterns.dev/patterns/forms/slider. Plain HTML, CSS and JS.

## basic

```html
<div class="demo-shell card slider-card">
  <label for="slider-input">Budget preference</label>
  <input id="slider-input" type="range" min="0" max="100" value="40" />
  <p id="slider-value" class="muted">Current value: 40</p>
</div>
```

```css
.slider-card { padding: 24px; display: grid; gap: 14px; }
label { font-weight: 600; }
input { width: 100%; }
p { margin: 0; }
```

```js
const slider = document.getElementById('slider-input');
const output = document.getElementById('slider-value');
slider.addEventListener('input', () => { output.textContent = 'Current value: ' + slider.value; });
```
