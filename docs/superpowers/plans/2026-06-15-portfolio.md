# Portfolio djibykonate.fr — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construire le portfolio personnel djibykonate.fr avec sections Accueil, Expériences, Projets, Blog (Markdown) et Contact, déployé sur Vercel.

**Architecture:** Site statique généré par Astro 4. Les articles de blog sont des fichiers Markdown dans `src/content/blog/`, validés par Astro Content Collections. Toutes les pages sont rendues au build — zéro runtime, zéro base de données.

**Tech Stack:** Astro 4, Tailwind CSS 3, @tailwindcss/typography, TypeScript, Vitest, Vercel, Formspree

---

## File Map

| Fichier | Responsabilité |
|---|---|
| `package.json` | Dépendances et scripts |
| `astro.config.mjs` | Configuration Astro (intégrations) |
| `tailwind.config.mjs` | Palette, dark mode, plugin typography |
| `vitest.config.ts` | Configuration Vitest |
| `tsconfig.json` | Configuration TypeScript strict |
| `src/styles/global.css` | Directives Tailwind + classes utilitaires |
| `src/content/config.ts` | Schéma Content Collections |
| `src/content/blog/*.md` | Articles de blog en Markdown |
| `src/data/experiences.ts` | Données statiques des expériences |
| `src/data/projects.ts` | Données statiques des projets |
| `src/utils/readingTime.ts` | Calcul du temps de lecture |
| `src/layouts/BaseLayout.astro` | Layout HTML commun (head, nav, footer) |
| `src/components/Nav.astro` | Navigation sticky responsive |
| `src/components/Footer.astro` | Pied de page |
| `src/components/BlogCard.astro` | Carte article réutilisable |
| `src/components/ProjectCard.astro` | Carte projet réutilisable |
| `src/pages/index.astro` | Page d'accueil (hero + bio + liens) |
| `src/pages/experience.astro` | Timeline d'expériences |
| `src/pages/projects.astro` | Grille de projets |
| `src/pages/blog/index.astro` | Liste d'articles + filtre par tag |
| `src/pages/blog/[slug].astro` | Page article (TOC + reading time) |
| `src/pages/contact.astro` | Formulaire de contact Formspree |
| `tests/readingTime.test.ts` | Tests unitaires utilitaire |
| `public/favicon.svg` | Favicon SVG |
| `vercel.json` | Configuration déploiement Vercel |

---

### Task 1: Initialisation du projet Astro

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tailwind.config.mjs`
- Create: `vitest.config.ts`
- Create: `tsconfig.json`
- Create: `src/styles/global.css`

- [ ] **Step 1: Créer `package.json`**

```json
{
  "name": "www-djibykonate-fr",
  "type": "module",
  "version": "0.0.1",
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "test": "vitest run"
  },
  "dependencies": {
    "@astrojs/check": "^0.9.0",
    "@astrojs/tailwind": "^5.1.0",
    "@tailwindcss/typography": "^0.5.0",
    "astro": "^4.16.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.6.0"
  },
  "devDependencies": {
    "vitest": "^2.1.0"
  }
}
```

- [ ] **Step 2: Créer `astro.config.mjs`**

```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  site: 'https://djibykonate.fr',
});
```

- [ ] **Step 3: Créer `tailwind.config.mjs`**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: {
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
```

- [ ] **Step 4: Créer `vitest.config.ts`**

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
  },
});
```

- [ ] **Step 5: Créer `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

- [ ] **Step 6: Créer `src/styles/global.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    @apply bg-gray-950 text-gray-100 scroll-smooth;
    font-family: Inter, system-ui, sans-serif;
  }

  h1, h2, h3, h4 {
    @apply font-bold tracking-tight;
  }

  a {
    @apply transition-colors duration-200;
  }
}

@layer utilities {
  .section-container {
    @apply max-w-4xl mx-auto px-4 sm:px-6 py-16;
  }
}
```

- [ ] **Step 7: Installer les dépendances**

```bash
npm install
```

Expected: Installation réussie sans erreurs.

- [ ] **Step 8: Vérifier que le projet démarre**

```bash
npx astro dev --port 4321
```

Expected: `🚀 astro v4.x.x started.` sur http://localhost:4321 (404 est normal à ce stade).

- [ ] **Step 9: Commit**

```bash
git add package.json astro.config.mjs tailwind.config.mjs vitest.config.ts tsconfig.json src/styles/global.css
git commit -m "feat: init Astro + Tailwind project"
```

---

### Task 2: Content Collections + article exemple

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/blog/premier-article.md`

- [ ] **Step 1: Créer `src/content/config.ts`**

```typescript
import { z, defineCollection } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()),
    description: z.string(),
  }),
});

export const collections = { blog };
```

- [ ] **Step 2: Créer `src/content/blog/premier-article.md`**

```markdown
---
title: "Mon premier article"
date: 2026-06-15
tags: ["backend", "astro"]
description: "Un premier article pour valider le système de blog."
---

## Introduction

Bienvenue sur mon blog ! Cet article est un exemple pour valider le rendu Markdown.

## Pourquoi ce blog ?

J'écris pour partager mes apprentissages en développement backend.

## Ce que j'utilise

- **Astro** pour générer le site statiquement
- **Markdown** pour rédiger les articles
- **Vercel** pour l'hébergement automatisé

Chaque `git push` sur `main` redéploie le site en 30 secondes.
```

- [ ] **Step 3: Vérifier la validation du schéma**

```bash
npx astro check
```

Expected: `Found 0 errors.`

- [ ] **Step 4: Commit**

```bash
git add src/content/
git commit -m "feat: add Content Collections schema and sample post"
```

---

### Task 3: Utilitaire readingTime (TDD)

**Files:**
- Create: `src/utils/readingTime.ts`
- Create: `tests/readingTime.test.ts`

- [ ] **Step 1: Écrire le test en premier**

Créer `tests/readingTime.test.ts` :

```typescript
import { describe, it, expect } from 'vitest';
import { readingTime } from '../src/utils/readingTime';

describe('readingTime', () => {
  it('retourne 1 pour un texte court (< 200 mots)', () => {
    const text = 'mot '.repeat(100);
    expect(readingTime(text)).toBe(1);
  });

  it('retourne 2 pour un texte de 350 mots', () => {
    const text = 'mot '.repeat(350);
    expect(readingTime(text)).toBe(2);
  });

  it('retourne 1 pour un texte vide', () => {
    expect(readingTime('')).toBe(1);
  });

  it('ignore les espaces multiples', () => {
    const text = 'mot  '.repeat(100);
    expect(readingTime(text)).toBe(1);
  });
});
```

- [ ] **Step 2: Vérifier que les tests échouent**

```bash
npm test
```

Expected: FAIL — `Cannot find module '../src/utils/readingTime'`

- [ ] **Step 3: Implémenter `src/utils/readingTime.ts`**

```typescript
export function readingTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
```

- [ ] **Step 4: Vérifier que les tests passent**

```bash
npm test
```

Expected: `4 passed`

- [ ] **Step 5: Commit**

```bash
git add src/utils/readingTime.ts tests/readingTime.test.ts
git commit -m "feat: add readingTime utility with tests"
```

---

### Task 4: Données statiques (expériences et projets)

**Files:**
- Create: `src/data/experiences.ts`
- Create: `src/data/projects.ts`

- [ ] **Step 1: Créer `src/data/experiences.ts`**

Remplace les valeurs d'exemple par tes vraies expériences.

```typescript
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
```

- [ ] **Step 2: Créer `src/data/projects.ts`**

Remplace les valeurs d'exemple par tes vrais projets.

```typescript
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
```

- [ ] **Step 3: Commit**

```bash
git add src/data/
git commit -m "feat: add static data files for experiences and projects"
```

---

### Task 5: BaseLayout + Nav + Footer + Favicon

**Files:**
- Create: `src/components/Nav.astro`
- Create: `src/components/Footer.astro`
- Create: `src/layouts/BaseLayout.astro`
- Create: `public/favicon.svg`

- [ ] **Step 1: Créer `src/components/Nav.astro`**

```astro
---
const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/experience', label: 'Expériences' },
  { href: '/projects', label: 'Projets' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

const currentPath = Astro.url.pathname;
---

<nav class="sticky top-0 z-50 bg-gray-950/90 backdrop-blur border-b border-gray-800">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
    <a href="/" class="font-mono text-accent-400 font-bold text-lg hover:text-accent-300">
      djiby.dev
    </a>
    <ul class="hidden md:flex items-center gap-6">
      {navLinks.map(({ href, label }) => (
        <li>
          <a
            href={href}
            class:list={[
              'text-sm font-medium transition-colors',
              currentPath === href
                ? 'text-accent-400'
                : 'text-gray-400 hover:text-gray-100',
            ]}
          >
            {label}
          </a>
        </li>
      ))}
    </ul>
    <button id="menu-toggle" class="md:hidden text-gray-400 hover:text-gray-100" aria-label="Menu">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  </div>
  <div id="mobile-menu" class="hidden md:hidden bg-gray-950 border-t border-gray-800 px-4 py-4">
    <ul class="flex flex-col gap-4">
      {navLinks.map(({ href, label }) => (
        <li>
          <a
            href={href}
            class:list={[
              'text-sm font-medium',
              currentPath === href ? 'text-accent-400' : 'text-gray-300',
            ]}
          >
            {label}
          </a>
        </li>
      ))}
    </ul>
  </div>
</nav>

<script>
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  toggle?.addEventListener('click', () => menu?.classList.toggle('hidden'));
</script>
```

- [ ] **Step 2: Créer `src/components/Footer.astro`**

```astro
---
const year = new Date().getFullYear();
const socials = [
  { href: 'https://github.com/djibykonate', label: 'GitHub' },
  { href: 'https://linkedin.com/in/djibykonate', label: 'LinkedIn' },
];
---

<footer class="border-t border-gray-800 py-8 mt-16">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
    <p class="text-sm text-gray-500">© {year} Djiby Konate</p>
    <div class="flex gap-4">
      {socials.map(({ href, label }) => (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          class="text-sm text-gray-500 hover:text-accent-400 transition-colors"
        >
          {label}
        </a>
      ))}
    </div>
  </div>
</footer>
```

- [ ] **Step 3: Créer `src/layouts/BaseLayout.astro`**

```astro
---
import Nav from '@/components/Nav.astro';
import Footer from '@/components/Footer.astro';
import '@/styles/global.css';

interface Props {
  title: string;
  description?: string;
}

const { title, description = 'Portfolio de Djiby Konate — Développeur Backend' } = Astro.props;
---

<!doctype html>
<html lang="fr" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>{title} | Djiby Konate</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />
  </head>
  <body class="min-h-screen flex flex-col">
    <Nav />
    <main class="flex-1">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 4: Créer `public/favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#7c3aed"/>
  <text x="16" y="22" font-family="monospace" font-size="18" font-weight="bold" fill="white" text-anchor="middle">D</text>
</svg>
```

- [ ] **Step 5: Vérifier le build**

```bash
npx astro build
```

Expected: `✓ Completed in Xs.` sans erreur.

- [ ] **Step 6: Commit**

```bash
git add src/layouts/ src/components/Nav.astro src/components/Footer.astro public/favicon.svg
git commit -m "feat: add BaseLayout, Nav, Footer and favicon"
```

---

### Task 6: Page d'accueil

**Files:**
- Create: `src/pages/index.astro`

- [ ] **Step 1: Créer `src/pages/index.astro`**

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
---

<BaseLayout title="Accueil" description="Djiby Konate — Développeur Backend">
  <section class="section-container flex flex-col justify-center min-h-[calc(100vh-4rem)]">
    <p class="font-mono text-accent-400 text-sm mb-4 tracking-widest uppercase">Bonjour, je suis</p>
    <h1 class="text-5xl sm:text-7xl font-bold text-white mb-4 leading-tight">
      Djiby<br /><span class="text-accent-400">Konate</span>
    </h1>
    <p class="text-xl sm:text-2xl text-gray-400 mb-6 max-w-xl">
      Développeur Backend — je construis des systèmes robustes, rapides et maintenables.
    </p>
    <p class="text-gray-500 max-w-2xl mb-10 leading-relaxed">
      Passionné par les architectures distribuées, les APIs performantes et les outils CLI.
      J'écris aussi sur mon blog pour partager ce que j'apprends.
    </p>
    <div class="flex flex-wrap gap-4">
      <a
        href="/projects"
        class="px-6 py-3 bg-accent-600 hover:bg-accent-500 text-white font-medium rounded-lg transition-colors"
      >
        Voir mes projets
      </a>
      <a
        href="/blog"
        class="px-6 py-3 border border-gray-700 hover:border-accent-400 text-gray-300 hover:text-accent-400 font-medium rounded-lg transition-colors"
      >
        Lire le blog
      </a>
    </div>
    <div class="flex gap-4 mt-12">
      <a
        href="https://github.com/djibykonate"
        target="_blank"
        rel="noopener noreferrer"
        class="text-gray-500 hover:text-accent-400 transition-colors text-sm font-mono"
      >
        GitHub ↗
      </a>
      <a
        href="https://linkedin.com/in/djibykonate"
        target="_blank"
        rel="noopener noreferrer"
        class="text-gray-500 hover:text-accent-400 transition-colors text-sm font-mono"
      >
        LinkedIn ↗
      </a>
      <a href="/contact" class="text-gray-500 hover:text-accent-400 transition-colors text-sm font-mono">
        Contact ↗
      </a>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 2: Vérifier dans le navigateur**

```bash
npx astro dev --port 4321
```

Ouvre http://localhost:4321 — tu dois voir le hero avec ton nom, les deux boutons, et les liens.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: add home page with hero section"
```

---

### Task 7: Page expériences (timeline)

**Files:**
- Create: `src/pages/experience.astro`

- [ ] **Step 1: Créer `src/pages/experience.astro`**

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import { experiences } from '@/data/experiences';
---

<BaseLayout title="Expériences" description="Mon parcours professionnel">
  <section class="section-container">
    <h1 class="text-4xl font-bold text-white mb-2">Expériences</h1>
    <p class="text-gray-400 mb-12">Mon parcours professionnel.</p>

    <div class="relative">
      <div class="absolute left-3 top-0 bottom-0 w-px bg-gray-800 hidden sm:block"></div>

      <div class="flex flex-col gap-10">
        {experiences.map((exp) => (
          <div class="sm:pl-10 relative">
            <div class="absolute left-0 top-1.5 w-7 h-7 rounded-full bg-gray-950 border-2 border-accent-500 hidden sm:flex items-center justify-center">
              <div class="w-2 h-2 rounded-full bg-accent-400"></div>
            </div>
            <div class="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-accent-500/30 transition-colors">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <h2 class="text-lg font-semibold text-white">{exp.title}</h2>
                  <p class="text-accent-400 font-mono text-sm">{exp.company}</p>
                </div>
                <span class="text-xs text-gray-500 font-mono bg-gray-800 px-3 py-1 rounded-full shrink-0">
                  {exp.period}
                </span>
              </div>
              <p class="text-gray-400 text-sm leading-relaxed mb-4">{exp.description}</p>
              <div class="flex flex-wrap gap-2">
                {exp.tags.map((tag) => (
                  <span class="text-xs font-mono bg-accent-600/20 text-accent-300 px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 2: Vérifier dans le navigateur**

Ouvre http://localhost:4321/experience — tu dois voir la timeline avec tes expériences.

- [ ] **Step 3: Commit**

```bash
git add src/pages/experience.astro
git commit -m "feat: add experience page with vertical timeline"
```

---

### Task 8: Page projets + composant ProjectCard

**Files:**
- Create: `src/components/ProjectCard.astro`
- Create: `src/pages/projects.astro`

- [ ] **Step 1: Créer `src/components/ProjectCard.astro`**

```astro
---
import type { Project } from '@/data/projects';

interface Props {
  project: Project;
}

const { project } = Astro.props;
---

<article class="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col gap-4 hover:border-accent-500/40 transition-colors group">
  <div class="flex items-start justify-between gap-4">
    <h2 class="text-lg font-semibold text-white group-hover:text-accent-400 transition-colors">
      {project.name}
    </h2>
    <div class="flex gap-3 shrink-0">
      {project.github && (
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          class="text-gray-500 hover:text-accent-400 transition-colors text-xs font-mono"
          aria-label={`Code source de ${project.name}`}
        >
          GitHub ↗
        </a>
      )}
      {project.demo && (
        <a
          href={project.demo}
          target="_blank"
          rel="noopener noreferrer"
          class="text-gray-500 hover:text-accent-400 transition-colors text-xs font-mono"
          aria-label={`Démo de ${project.name}`}
        >
          Démo ↗
        </a>
      )}
    </div>
  </div>
  <p class="text-gray-400 text-sm leading-relaxed flex-1">{project.description}</p>
  <div class="flex flex-wrap gap-2">
    {project.stack.map((tech) => (
      <span class="text-xs font-mono bg-gray-800 text-gray-400 px-2 py-0.5 rounded">
        {tech}
      </span>
    ))}
  </div>
</article>
```

- [ ] **Step 2: Créer `src/pages/projects.astro`**

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import ProjectCard from '@/components/ProjectCard.astro';
import { projects } from '@/data/projects';
---

<BaseLayout title="Projets" description="Mes projets open-source et personnels">
  <section class="section-container">
    <h1 class="text-4xl font-bold text-white mb-2">Projets</h1>
    <p class="text-gray-400 mb-12">Ce que j'ai construit.</p>

    <div class="grid sm:grid-cols-2 gap-6">
      {projects.map((project) => (
        <ProjectCard project={project} />
      ))}
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 3: Vérifier dans le navigateur**

Ouvre http://localhost:4321/projects — tu dois voir la grille de cartes projets.

- [ ] **Step 4: Commit**

```bash
git add src/components/ProjectCard.astro src/pages/projects.astro
git commit -m "feat: add projects page with ProjectCard component"
```

---

### Task 9: Composant BlogCard + liste d'articles

**Files:**
- Create: `src/components/BlogCard.astro`
- Create: `src/pages/blog/index.astro`

- [ ] **Step 1: Créer `src/components/BlogCard.astro`**

```astro
---
interface Props {
  title: string;
  description: string;
  date: Date;
  tags: string[];
  slug: string;
}

const { title, description, date, tags, slug } = Astro.props;

const formattedDate = date.toLocaleDateString('fr-FR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
---

<article class="border-b border-gray-800 py-6 group">
  <div class="flex flex-col gap-2">
    <div class="flex items-center gap-3 text-xs text-gray-500 font-mono">
      <time datetime={date.toISOString()}>{formattedDate}</time>
      <span>·</span>
      <div class="flex gap-2 flex-wrap">
        {tags.map((tag) => (
          <span class="bg-accent-600/20 text-accent-300 px-2 py-0.5 rounded">{tag}</span>
        ))}
      </div>
    </div>
    <a href={`/blog/${slug}`}>
      <h2 class="text-xl font-semibold text-white group-hover:text-accent-400 transition-colors">
        {title}
      </h2>
    </a>
    <p class="text-gray-400 text-sm leading-relaxed">{description}</p>
    <a
      href={`/blog/${slug}`}
      class="text-accent-400 hover:text-accent-300 text-sm font-mono transition-colors self-start mt-1"
    >
      Lire la suite →
    </a>
  </div>
</article>
```

- [ ] **Step 2: Créer `src/pages/blog/index.astro`**

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import BlogCard from '@/components/BlogCard.astro';
import { getCollection } from 'astro:content';

const allPosts = await getCollection('blog');
const posts = allPosts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

const allTags = [...new Set(posts.flatMap((p) => p.data.tags))].sort();

const selectedTag = Astro.url.searchParams.get('tag');
const filtered = selectedTag ? posts.filter((p) => p.data.tags.includes(selectedTag)) : posts;
---

<BaseLayout title="Blog" description="Articles sur le développement backend">
  <section class="section-container">
    <h1 class="text-4xl font-bold text-white mb-2">Blog</h1>
    <p class="text-gray-400 mb-8">Notes et articles sur le développement backend.</p>

    <div class="flex flex-wrap gap-2 mb-10">
      <a
        href="/blog"
        class:list={[
          'text-xs font-mono px-3 py-1 rounded-full border transition-colors',
          !selectedTag
            ? 'border-accent-500 text-accent-400 bg-accent-600/10'
            : 'border-gray-700 text-gray-400 hover:border-accent-500/50',
        ]}
      >
        Tous
      </a>
      {allTags.map((tag) => (
        <a
          href={`/blog?tag=${tag}`}
          class:list={[
            'text-xs font-mono px-3 py-1 rounded-full border transition-colors',
            selectedTag === tag
              ? 'border-accent-500 text-accent-400 bg-accent-600/10'
              : 'border-gray-700 text-gray-400 hover:border-accent-500/50',
          ]}
        >
          {tag}
        </a>
      ))}
    </div>

    <div>
      {filtered.map((post) => (
        <BlogCard
          title={post.data.title}
          description={post.data.description}
          date={post.data.date}
          tags={post.data.tags}
          slug={post.slug}
        />
      ))}
      {filtered.length === 0 && (
        <p class="text-gray-500 text-sm">Aucun article pour ce tag.</p>
      )}
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 3: Vérifier dans le navigateur**

Ouvre http://localhost:4321/blog — tu dois voir l'article exemple, les boutons de filtre par tag, et le lien "Lire la suite".

- [ ] **Step 4: Commit**

```bash
git add src/components/BlogCard.astro src/pages/blog/index.astro
git commit -m "feat: add blog list page with tag filtering"
```

---

### Task 10: Page article individuel

**Files:**
- Create: `src/pages/blog/[slug].astro`

- [ ] **Step 1: Créer `src/pages/blog/[slug].astro`**

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';
import { readingTime } from '@/utils/readingTime';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content, headings } = await post.render();

const minutes = readingTime(post.body);
const formattedDate = post.data.date.toLocaleDateString('fr-FR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
---

<BaseLayout title={post.data.title} description={post.data.description}>
  <article class="section-container">
    <header class="mb-10">
      <div class="flex flex-wrap gap-2 mb-4">
        {post.data.tags.map((tag) => (
          <a
            href={`/blog?tag=${tag}`}
            class="text-xs font-mono bg-accent-600/20 text-accent-300 px-2 py-0.5 rounded hover:bg-accent-600/40 transition-colors"
          >
            {tag}
          </a>
        ))}
      </div>
      <h1 class="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
        {post.data.title}
      </h1>
      <div class="flex items-center gap-4 text-sm text-gray-500 font-mono">
        <time datetime={post.data.date.toISOString()}>{formattedDate}</time>
        <span>·</span>
        <span>{minutes} min de lecture</span>
      </div>
    </header>

    {headings.length > 0 && (
      <aside class="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-10">
        <p class="text-xs font-mono text-gray-500 uppercase tracking-widest mb-3">Table des matières</p>
        <ul class="flex flex-col gap-2">
          {headings.map((h) => (
            <li style={`padding-left: ${(h.depth - 2) * 12}px`}>
              <a href={`#${h.slug}`} class="text-sm text-gray-400 hover:text-accent-400 transition-colors">
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </aside>
    )}

    <div class="prose prose-invert prose-violet max-w-none
      prose-headings:font-bold prose-headings:text-white
      prose-p:text-gray-300 prose-p:leading-relaxed
      prose-a:text-accent-400 prose-a:no-underline hover:prose-a:underline
      prose-code:text-accent-300 prose-code:bg-gray-900 prose-code:px-1 prose-code:rounded
      prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800
      prose-strong:text-white
      prose-li:text-gray-300">
      <Content />
    </div>

    <div class="mt-12 pt-8 border-t border-gray-800">
      <a href="/blog" class="text-accent-400 hover:text-accent-300 font-mono text-sm transition-colors">
        ← Retour au blog
      </a>
    </div>
  </article>
</BaseLayout>
```

- [ ] **Step 2: Vérifier la page article**

Ouvre http://localhost:4321/blog/premier-article — tu dois voir le titre, les méta (date + temps de lecture), la table des matières et le contenu Markdown rendu avec syntax highlighting.

- [ ] **Step 3: Commit**

```bash
git add "src/pages/blog/[slug].astro"
git commit -m "feat: add blog post page with TOC and reading time"
```

---

### Task 11: Page contact

**Files:**
- Create: `src/pages/contact.astro`

- [ ] **Step 1: Créer un compte Formspree**

1. Va sur https://formspree.io et crée un compte gratuit avec `konate.djiby.dev@gmail.com`
2. Crée un nouveau formulaire nommé "contact portfolio"
3. Copie l'ID du formulaire (format `xpwzxxxx`)

- [ ] **Step 2: Créer `src/pages/contact.astro`**

Remplace `YOUR_FORMSPREE_ID` par ton ID Formspree réel avant de commit.

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
---

<BaseLayout title="Contact" description="Me contacter">
  <section class="section-container max-w-2xl">
    <h1 class="text-4xl font-bold text-white mb-2">Contact</h1>
    <p class="text-gray-400 mb-10">Une question, une opportunité ? Écris-moi.</p>

    <form
      action="https://formspree.io/f/YOUR_FORMSPREE_ID"
      method="POST"
      class="flex flex-col gap-6"
    >
      <div class="flex flex-col gap-2">
        <label for="name" class="text-sm font-medium text-gray-300">Nom</label>
        <input
          type="text"
          id="name"
          name="name"
          required
          class="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 text-sm
            focus:outline-none focus:border-accent-500 transition-colors placeholder:text-gray-600"
          placeholder="Ton prénom"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="email" class="text-sm font-medium text-gray-300">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          class="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 text-sm
            focus:outline-none focus:border-accent-500 transition-colors placeholder:text-gray-600"
          placeholder="ton@email.com"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="message" class="text-sm font-medium text-gray-300">Message</label>
        <textarea
          id="message"
          name="message"
          required
          rows="6"
          class="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 text-sm
            focus:outline-none focus:border-accent-500 transition-colors resize-none placeholder:text-gray-600"
          placeholder="Ton message..."
        ></textarea>
      </div>

      <button
        type="submit"
        class="self-start px-8 py-3 bg-accent-600 hover:bg-accent-500 text-white font-medium rounded-lg transition-colors"
      >
        Envoyer →
      </button>
    </form>

    <div class="mt-12 pt-8 border-t border-gray-800">
      <p class="text-gray-500 text-sm">
        Tu peux aussi me trouver sur
        <a href="https://github.com/djibykonate" target="_blank" rel="noopener noreferrer"
          class="text-accent-400 hover:text-accent-300 transition-colors"> GitHub</a>
        ou
        <a href="https://linkedin.com/in/djibykonate" target="_blank" rel="noopener noreferrer"
          class="text-accent-400 hover:text-accent-300 transition-colors"> LinkedIn</a>.
      </p>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 3: Vérifier dans le navigateur**

Ouvre http://localhost:4321/contact — tu dois voir le formulaire avec les trois champs et le bouton d'envoi.

- [ ] **Step 4: Commit**

```bash
git add src/pages/contact.astro
git commit -m "feat: add contact page with Formspree form"
```

---

### Task 12: Build final + déploiement Vercel

**Files:**
- Create: `vercel.json`

- [ ] **Step 1: Créer `vercel.json`**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "astro"
}
```

- [ ] **Step 2: Build de production complet**

```bash
npm run build
```

Expected: `✓ Completed in Xs.` sans erreur TypeScript ni warning.

- [ ] **Step 3: Prévisualiser le build de production**

```bash
npm run preview
```

Navigue sur toutes les pages : `/`, `/experience`, `/projects`, `/blog`, `/blog/premier-article`, `/contact`. Vérifie que la nav, le footer, et tous les contenus s'affichent correctement.

- [ ] **Step 4: Commit final**

```bash
git add vercel.json
git commit -m "feat: add Vercel config and validate production build"
```

- [ ] **Step 5: Pousser sur GitHub et connecter Vercel**

```bash
# Crée le repo GitHub djibykonate/www.djibykonate.fr (sans initialiser de README)
git remote add origin https://github.com/djibykonate/www.djibykonate.fr.git
git branch -M main
git push -u origin main
```

Ensuite sur https://vercel.com :
1. "Add New Project" → importe `djibykonate/www.djibykonate.fr`
2. Vercel détecte Astro automatiquement — clique "Deploy"
3. Paramètres du projet → "Domains" → ajoute `djibykonate.fr`

Expected: Site live sur https://djibykonate.fr en ~2 minutes après le push.

---

## Résumé

| # | Tâche | Commits |
|---|---|---|
| 1 | Init Astro + Tailwind | 1 |
| 2 | Content Collections + article | 1 |
| 3 | readingTime (TDD) | 1 |
| 4 | Données statiques | 1 |
| 5 | BaseLayout + Nav + Footer | 1 |
| 6 | Page Accueil | 1 |
| 7 | Page Expériences | 1 |
| 8 | Page Projets + ProjectCard | 1 |
| 9 | BlogCard + liste articles | 1 |
| 10 | Page article individuel | 1 |
| 11 | Page contact | 1 |
| 12 | Build + déploiement Vercel | 1 |

**12 tâches, 12 commits.** Le site est fonctionnel à chaque commit.

**Ordre de priorité si le temps manque :**
1. Tasks 1–5 : Foundation (layout visible)
2. Tasks 6–9 : Pages principales
3. Tasks 10–12 : Article + Contact + Déploiement
