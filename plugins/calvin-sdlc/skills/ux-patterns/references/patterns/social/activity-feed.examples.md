# Activity Feed: demo code

**Sections (line range):** basic 7-47

Code of the live demos on https://uxpatterns.dev/patterns/social/activity-feed. Plain HTML, CSS and JS.

## basic

```html
<div class="demo-shell">
  <div class="card list-card">
    <ul class="list">
      <li>
        <div>
          <strong>Alex commented on “Signup review”</strong>
          <p class="muted">Raised an accessibility concern about the final step labels.</p>
        </div>
        <span class="badge">5m ago</span>
      </li>
      <li>
        <div>
          <strong>Design library updated</strong>
          <p class="muted">The button tokens were refreshed for the new brand palette.</p>
        </div>
        <span class="badge">22m ago</span>
      </li>
      <li>
        <div>
          <strong>New pattern published</strong>
          <p class="muted">Image Upload is now available with a basic playground demo.</p>
        </div>
        <span class="badge">1h ago</span>
      </li>
    </ul>
  </div>
</div>
```

```css
.list-card { padding: 8px 0; }
.list { list-style: none; margin: 0; padding: 0; }
li { display: flex; gap: 16px; justify-content: space-between; align-items: start; padding: 18px 20px; border-bottom: 1px solid #e2e8f0; }
li:last-child { border-bottom: 0; }
p { margin: 6px 0 0; font-size: 14px; line-height: 1.5; }
.badge { padding: 6px 10px; border-radius: 999px; background: #e2e8f0; font-size: 12px; font-weight: 600; }
```
