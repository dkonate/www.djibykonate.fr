# Portfolio djibykonate.fr — Design Spec

**Date :** 2026-06-15
**Auteur :** Djiby Konate
**Stack :** Astro + Tailwind CSS + Markdown + Vercel

---

## Contexte

Site portfolio personnel avec section blog. Le développeur a un profil backend et veut une solution simple à maintenir sans expertise frontend avancée. Zéro CMS externe, zéro base de données — tout est versionné dans git.

---

## Stack technique

| Outil | Rôle |
|---|---|
| [Astro](https://astro.build) | Framework SSG (génération statique) |
| Tailwind CSS | Styles utilitaires |
| Astro Content Collections | Gestion des articles Markdown |
| Formspree | Formulaire de contact (service gratuit) |
| Vercel | Hébergement + déploiement continu |

---

## Architecture des fichiers

```
www.djibykonate.fr/
├── src/
│   ├── pages/
│   │   ├── index.astro
│   │   ├── experience.astro
│   │   ├── projects.astro
│   │   ├── blog/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   └── contact.astro
│   ├── content/
│   │   └── blog/              # Articles .md
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── Footer.astro
│   │   ├── BlogCard.astro
│   │   └── ProjectCard.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   └── styles/
│       └── global.css
├── public/                    # Assets statiques (images, CV PDF)
└── astro.config.mjs
```

---

## Pages

### `index.astro` — Accueil
- Hero : nom, titre professionnel, bio courte
- Liens réseaux sociaux : GitHub, LinkedIn

### `experience.astro` — Expériences
- Timeline verticale : poste, entreprise, dates, description

### `projects.astro` — Projets
- Grille de cartes : nom, stack, description, liens GitHub/démo

### `blog/index.astro` — Liste des articles
- Cartes avec titre, date, tags, extrait
- Filtrage par tag

### `blog/[slug].astro` — Article
- Contenu Markdown rendu
- Table des matières générée depuis les titres `##`
- Temps de lecture estimé
- Syntax highlighting natif

### `contact.astro` — Contact
- Formulaire (nom, email, message) soumis via Formspree

---

## Système de blog

**Format d'un article (`src/content/blog/<slug>.md`) :**

```markdown
---
title: "Titre de l'article"
date: 2026-06-15
tags: ["backend", "rust"]
description: "Résumé affiché dans la liste."
---

Contenu en Markdown...
```

**Astro Content Collections** assure :
- Validation du frontmatter au build (champs requis : title, date, description)
- Génération automatique des routes `/blog/<slug>`
- Tri par date décroissante sur la page liste

**Workflow d'un nouvel article :**
1. Créer `src/content/blog/mon-article.md`
2. Écrire en Markdown
3. `git push` → Vercel redéploie en ~30 secondes

---

## Style

- **Mode :** Dark mode par défaut
- **Palette :** Accent coloré (à définir : violet, vert néon, ou bleu électrique)
- **Animations :** Légères entrées en fade/slide sur les sections
- **Responsive :** Mobile-first via Tailwind

---

## Déploiement

1. Repo GitHub connecté à Vercel
2. Chaque `git push` sur `main` déclenche un build Astro
3. Le site est servi depuis le CDN Vercel (~30s de déploiement)
4. Domaine custom `djibykonate.fr` configuré dans le dashboard Vercel

---

## Hors périmètre (v1)

- Commentaires sur les articles (peut être ajouté via Giscus)
- Internationalisation (FR/EN)
- Système de recherche full-text
- Analytics (peut être ajouté via Plausible ou Vercel Analytics)
