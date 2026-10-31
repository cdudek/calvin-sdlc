# Timeline: demo code

**Sections (line range):** basic 7-26

Code of the live demos on https://uxpatterns.dev/patterns/data-display/timeline. Plain HTML, CSS and JS.

## basic

```html
<div class="demo-shell card timeline-card">
  <ol>
    <li><strong>Kickoff approved</strong><p class="muted">Design and engineering aligned on the scope.</p></li>
    <li><strong>Prototype tested</strong><p class="muted">Five users completed the revised flow successfully.</p></li>
    <li><strong>Launch scheduled</strong><p class="muted">Rollout is planned for next Thursday.</p></li>
  </ol>
</div>
```

```css
.timeline-card { padding: 20px; }
ol { list-style: none; margin: 0; padding: 0 0 0 20px; border-left: 2px solid #cbd5e1; display: grid; gap: 18px; }
li { position: relative; }
li::before { content: ''; width: 12px; height: 12px; border-radius: 999px; background: #0f172a; position: absolute; left: -27px; top: 6px; }
p { margin: 6px 0 0; line-height: 1.5; }
```
