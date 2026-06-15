export interface Project {
  name: string;
  description: string;
  stack: string[];
  github: string | null;
  demo: string | null;
}

export const projects: Project[] = [
  {
    name: 'Projet Alpha',
    description: 'Description courte du projet et de sa valeur.',
    stack: ['Rust', 'PostgreSQL', 'Docker'],
    github: 'https://github.com/djibykonate/projet-alpha',
    demo: null,
  },
  {
    name: 'Projet Beta',
    description: 'Description courte du projet et de sa valeur.',
    stack: ['Python', 'FastAPI', 'Redis'],
    github: 'https://github.com/djibykonate/projet-beta',
    demo: 'https://beta.djibykonate.fr',
  },
];
