**Radio / RadioCard** — single-choice controls. `Radio` is the classic dot; `RadioCard` wraps it in a selectable card that tints brand-purple when chosen.

```jsx
<Radio name="plan" value="m" checked={v==='m'} onChange={()=>setV('m')} label="Monthly" />
<RadioCard name="plan" value="y" checked={v==='y'} onChange={()=>setV('y')} title="Yearly" description="Save 20%" />
```
