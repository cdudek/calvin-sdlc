**ToggleSwitch** — on/off switch; track fills with the active colour. Use for instant-apply settings (not form submit choices — use Checkbox there).

```jsx
<ToggleSwitch checked={on} onChange={setOn} label="Email notifications" />
<ToggleSwitch checked size="s" color="success" />
```

`size`: `s`/`m`. `color`: `primary` (default) / `success` / `error`.
