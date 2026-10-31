**Product composites** — higher-level cards that compose the primitives, for OMR's real product surfaces (Reviews, Festival, editorial).

```jsx
<ProductCard name="Flowdesk CRM" rating={4.6} reviewCount={1284} category="CRM software" onClick={open} />
<PricingPlanCard name="Growth" price="79 €" period="/mo" badge="Most popular" highlight
  features={['15 seats','25,000 contacts','Priority support']} cta={<Button fullWidth>Start trial</Button>} />
<ArticleCard category="Marketing" title="The post-cookie growth playbook" author="Nadia Ferreira" date="6 May" />
<SpeakerCard name="Julian Bex" role="Founder · Loop" topic="Building brand in the AI era" />
<EventCard day="6" month="May" tag="Keynote" title="Opening keynote" location="Blue Stage" time="10:00" />
```

- **ProductCard** — Reviews listing card; letter-mark logo unless `logoUrl` given.
- **PricingPlanCard** — one pricing tier; `highlight` for the featured plan.
- **ArticleCard** — editorial preview.
- **SpeakerCard** / **EventCard** — Festival speaker + session tiles.
