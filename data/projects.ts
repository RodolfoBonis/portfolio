// Locale-neutral fields for each Projects.vue card. Keyed by `id`
// so the component can merge with the localised title/description/
// highlights pulled from `tm('projects.items')`. Splitting this from
// the i18n bundle keeps the JSON files focused on translatable copy
// — image URLs, tags and GitHub links never change between
// languages, so duplicating them in every locale would just add
// drift risk.

export interface ProjectMeta {
  id: string
  image: string
  tags: string[]
  githubUrl: string
}

export const projectsMeta: ProjectMeta[] = [
  {
    id: 'hermes',
    image: '/api/cdn/portfolio/hermes.png',
    tags: ['Go', 'Flutter', 'Kafka', 'RabbitMQ', 'K3s', 'Vault'],
    githubUrl: 'https://github.com/RodolfoBonis/hermes',
  },
  {
    id: 'microdetect',
    image: '/api/cdn/portfolio/microdetect.png',
    tags: ['Python', 'YOLOv8', 'FastAPI', 'Flutter'],
    githubUrl: 'https://github.com/RodolfoBonis/microdetect',
  },
  {
    id: 'portfolio',
    image: '/api/cdn/portfolio/portfolio-pessoal.png',
    tags: ['Nuxt 3', 'Tailwind CSS', 'TypeScript', 'ArgoCD'],
    githubUrl: 'https://github.com/RodolfoBonis/portfolio',
  },
]
