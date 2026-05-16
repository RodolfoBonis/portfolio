// Locale-neutral fields for the Experience.vue timeline. Period
// strings are reassembled in the component from the localised
// `periodStart`, optional `periodEnd`, and the `periodCurrent` label
// (e.g. "Atual" vs "Present") — only the data here is the `current`
// boolean used to draw the highlighted timeline dot + tags chips
// which are technology names and stay neutral.

export interface ExperienceMeta {
  id: string
  current?: boolean
  tags?: string[]
}

export const experienceMeta: ExperienceMeta[] = [
  {
    id: 'freelance',
    current: true,
    tags: ['K3s', 'Vault', 'Home Assistant', 'MQTT'],
  },
  {
    id: 'loft',
    current: true,
    tags: ['Flutter', 'GraphQL', 'Search', 'AI', 'DevOps'],
  },
  {
    id: 'innovate',
    tags: ['Node.js', 'Angular', 'Flutter', 'MongoDB'],
  },
  {
    id: 'nobully',
    tags: ['JWT', 'WebSockets', 'OneSignal'],
  },
  {
    id: 'uninassau',
    tags: ['ADS', 'TCC'],
  },
]
