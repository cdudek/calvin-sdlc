**Modal** — blocking dialog for content that needs a decision before continuing. Blurred backdrop, centred `rounded-lg` surface, Escape / overlay-click / close-button all fire `onClose`.

```jsx
<Modal isOpen={open} title="Confirm delete" onClose={close}
  footer={<>
    <Button variant="secondary" intent="neutral" onClick={close}>Cancel</Button>
    <Button intent="destructive" onClick={remove}>Delete</Button>
  </>}>
  <p className="txt-body-m-regular text-subtle">This can't be undone.</p>
</Modal>
```

Don't stack modals; use one at a time. For non-blocking messages use a banner/toast instead.
