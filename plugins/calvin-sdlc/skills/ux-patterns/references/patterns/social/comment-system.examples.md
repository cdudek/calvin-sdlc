# Comment System: demo code

**Sections (line range):** basic 7-29

Code of the live demos on https://uxpatterns.dev/patterns/social/comment-system. Plain HTML, CSS and JS.

## basic

```html
<div class="demo-shell card comment-card">
  <label for="comment-box">Add a comment</label>
  <textarea id="comment-box" rows="4" placeholder="Share context or ask a follow-up question."></textarea>
  <button type="button">Post comment</button>
  <article class="thread-item">
    <strong>Jordan</strong>
    <p class="muted">We should show the error summary only after submit, not on every keypress.</p>
  </article>
</div>
```

```css
.comment-card { padding: 20px; display: grid; gap: 12px; }
label { font-weight: 600; }
textarea { border: 1px solid #cbd5e1; border-radius: 12px; padding: 12px 14px; resize: vertical; }
button { width: fit-content; border: 0; border-radius: 12px; padding: 10px 14px; background: #0f172a; color: white; }
.thread-item { padding-top: 12px; border-top: 1px solid #e2e8f0; }
p { margin: 6px 0 0; }
```
