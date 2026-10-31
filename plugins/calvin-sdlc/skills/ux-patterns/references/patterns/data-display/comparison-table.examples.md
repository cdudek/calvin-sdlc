# Comparison Table: demo code

**Sections (line range):** basic 7-28

Code of the live demos on https://uxpatterns.dev/patterns/data-display/comparison-table. Plain HTML, CSS and JS.

## basic

```html
<div class="demo-shell card table-card">
  <table>
    <thead><tr><th>Feature</th><th>Starter</th><th>Team</th><th>Enterprise</th></tr></thead>
    <tbody>
      <tr><td>Shared components</td><td>✓</td><td>✓</td><td>✓</td></tr>
      <tr><td>Design review workflows</td><td>—</td><td>✓</td><td>✓</td></tr>
      <tr><td>Audit history</td><td>—</td><td>—</td><td>✓</td></tr>
    </tbody>
  </table>
</div>
```

```css
.table-card { padding: 18px; overflow: auto; }
table { width: 100%; border-collapse: collapse; background: white; }
th, td { padding: 12px 14px; border-bottom: 1px solid #e2e8f0; text-align: left; }
th { background: #f8fafc; }
```
