export const heroConfig = {
  // Eyebrow — plain statement of what he is and where, no buzzwords.
  eyebrow: 'Backend & systems engineer — Germany',

  // The thesis lives in Hero.astro markup (it needs the accent mark on "millions").
  // The part that makes it human: leads teams, started young, still in production.
  lead: "I'm Jerome — a systems engineer and CTO. For five years I've designed distributed backends, shipped mobile and marketplace products, and built the platforms other developers rely on. I started young and I've been in production ever since.",

  // Spec block — the "big number" done as a drafted data table, not a gradient stat card.
  spec: [
    { key: 'Role', value: 'Systems engineer / CTO' },
    { key: 'Based', value: 'Rügen, Germany' },
    { key: 'Coord', value: '54.42°N · 13.43°E' },
    { key: 'Building since', value: '2020' },
    { key: 'Users served', value: '4.4M+' },
  ],

  cta: { label: 'See the work', href: '#work' },
} as const;
