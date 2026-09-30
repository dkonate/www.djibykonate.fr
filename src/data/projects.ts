export interface Project {
  name: string;
  description: string;
  stack: string[];
  github: string | null;  
  demo: string | null;
}

export const projects: Project[] = [
  {
    name: 'SenDoctor',
    description: 'Plateforme de prise de rendez vous médical en ligne.',
    stack: ['Php','Symfony', 'MySQL', 'Docker', 'Claude Code'],
    github: null,
    demo: 'https://sendoctor.sn/',
  },
];
