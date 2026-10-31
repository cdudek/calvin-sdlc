# Video Player: demo code

**Sections (line range):** basic 7-35

Code of the live demos on https://uxpatterns.dev/patterns/media/video-player. Plain HTML, CSS and JS.

## basic

```html
<div class="demo-shell card video-card">
  <div class="video-stage">Product walkthrough</div>
  <div class="controls">
    <button type="button" id="video-play">Play</button>
    <div class="progress-track"><div id="video-fill"></div></div>
    <button type="button">CC</button>
  </div>
</div>
```

```css
.video-card { padding: 20px; display: grid; gap: 12px; }
.video-stage { min-height: 220px; border-radius: 18px; background: linear-gradient(135deg, #0f172a, #334155); color: white; display: grid; place-items: center; font-size: 22px; font-weight: 700; }
.controls { display: grid; grid-template-columns: auto 1fr auto; gap: 12px; align-items: center; }
button { border: 0; border-radius: 10px; padding: 10px 12px; background: #0f172a; color: white; }
.progress-track { height: 10px; border-radius: 999px; overflow: hidden; background: #e2e8f0; }
#video-fill { width: 25%; height: 100%; background: #0ea5e9; }
```

```js
const play = document.getElementById('video-play');
const fill = document.getElementById('video-fill');
let progress = 25;
play.addEventListener('click', () => { progress = progress >= 100 ? 0 : progress + 25; fill.style.width = progress + '%'; play.textContent = progress > 0 && progress < 100 ? 'Pause' : progress >= 100 ? 'Replay' : 'Play'; });
```
