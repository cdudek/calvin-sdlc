**Table** — simple data table; cell values can be any node (badges, avatars, links).

```jsx
<Table
  columns={[{key:'name',label:'Product'},{key:'rating',label:'Rating',align:'right'}]}
  rows={[{name:'Flowdesk CRM', rating:'4.6'}]}
  onRowClick={openProduct} />
```
