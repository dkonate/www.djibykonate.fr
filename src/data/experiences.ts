export interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
  tags: string[];
}

export const experiences: Experience[] = [
  {
    title: 'Développeur Backend Senior',
    company: 'Exemple Corp',
    period: '2024 – présent',
    description: 'Description de tes responsabilités et réalisations principales.',
    tags: ['Rust', 'PostgreSQL', 'Kubernetes'],
  },
  {
    title: 'Développeur Backend',
    company: 'Startup XYZ',
    period: '2022 – 2024',
    description: 'Description de tes responsabilités et réalisations principales.',
    tags: ['Python', 'FastAPI', 'Redis'],
  },
];
