export interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
  tags: string[];
}

export const experiences: Experience[] = [
  {
    title: 'Développeur back-end php | Symfony | Apiplatform | React | Javascript',
    company: 'Alltricks',
    period: 'Août 2022 - Novembre 2025',
    description: '- Projet Sales Preview : Réduction de 95% du temps de mise en solde et suppression des périodes d\'astreinte nécessaires à travers le développement d\'un mode “preview” permettant de tester les périodes de soldes et de promos en avance.',
    tags: ['PHP', 'Symfony', 'Apiplatform', 'RabbitMQ', 'Clean Archi', 'TDD'],
  },
  {
    title: 'Développeur back-end Php | Symfony | Javascript',
    company: 'Eexpand',
    period: 'Avril 2020 - Juillet 2022',
    description: '- Projet Trade Club : Réduction de la dette technique via le passage du projet Trade Club en Php 7.1 et Symfony4, la mise en place de tests unitaires et fonctionnels.',
    tags: ['PHP', 'Symfony','Apiplatform', 'PHPUnit', 'Javascript'],
  },
  {
    title: 'Développeur back-end Php | Symfony',
    company: 'Rue Du Commerce',
    period: 'Juin 2018 - Mars 2020',
    description: '- Projet Marketplace : Amélioration et augmentation du volume d\'affaires du client à travers la création d\'une marketplace découpée 6 micro-services',
    tags: ['PHP', 'Symfony','Apiplatform', 'PHPUnit', 'Javascript'],
  },
  {
    title: 'Développeur back-end Php | Symfony',
    company: 'FNAC Darty',
    period: 'Juin 2017 - Mai 2018',
    description: '- Projet refonte du compte vendeur : Amélioration et évolution technique du compte vendeur avec le développement de nouvelles fonctionnalités et apis.',
    tags: ['PHP', 'Symfony', 'PHPUnit', 'Mirakl'],
  }, 
  {
    title: 'Développeur back-end Php | Symfony',
    company: 'LEtudiant',
    period: 'Décembre 2016 - Mai 2017',
    description: '- Migration du site de letudiant.fr en Symfony2',
    tags: ['PHP', 'Symfony', 'Silex', 'PHPUnit', 'RabbitMQ', 'Redis'],
  },  
];
