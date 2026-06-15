# Thème Ambre & Dark/Light Mode — Design Spec

**Date :** 2026-06-16
**Scope :** Refonte du thème visuel (couleurs + fonts) + ajout d'un toggle dark/light mode

---

## Contexte

Le thème actuel utilise un accent violet (Tailwind `violet`), la font Inter pour le corps et JetBrains Mono pour le code, avec un dark mode hardcodé (`class="dark"` fixe sur `<html>`).

Cette spec remplace ce thème par une palette ambre/brun chaude et ajoute un toggle dark/light respectant la préférence système.

---

## Palette

### Accent (remplace violet)

| Token | Valeur | Usage |
|---|---|---|
| `accent-300` | `#fcd34d` | Textes clairs, chips tags |
| `accent-400` | `#fbbf24` | Liens hover, icônes |
| `accent-500` | `#f59e0b` | Couleur principale |
| `accent-600` | `#d97706` | Boutons CTA, bordures actives |

### Dark mode (classe `dark` sur `<html>`)

| Usage | Valeur Tailwind / CSS |
|---|---|
| Background | `bg-[#1c1409]` |
| Surface (cartes) | `bg-[#2a1d0f]` |
| Bordures | `border-[#3d2b16]` |
| Texte principal | `text-[#fef3c7]` |
| Texte secondaire | `text-[#d4a96a]` |

### Light mode (absence de classe `dark`)

| Usage | Valeur Tailwind / CSS |
|---|---|
| Background | `bg-[#fffbeb]` |
| Surface (cartes) | `bg-[#fef9ee]` |
| Bordures | `border-[#e8d5a3]` |
| Texte principal | `text-[#1c1409]` |
| Texte secondaire | `text-[#78543a]` |

---

## Typographie

| Rôle | Font | Graisse | Remplacement |
|---|---|---|---|
| Titres (`h1`–`h4`) | Playfair Display | 600, 700 | Inter (titres) |
| Corps | DM Sans | 400, 500 | Inter (corps) |
| Mono | Fira Code | 400, 700 | JetBrains Mono |

**Chargement Google Fonts** (dans `BaseLayout.astro`) :
```
https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500&family=Fira+Code:wght@400;700&display=swap
```

**CSS dans `global.css` :**
- `html` : `font-family: 'DM Sans', system-ui, sans-serif`
- `h1, h2, h3, h4` : `font-family: 'Playfair Display', serif`

---

## Dark/Light Mode Toggle

### Logique de thème

1. **Premier chargement** : lire `localStorage.getItem('theme')`.
   - Si présent → appliquer directement (`dark` ou `light`).
   - Si absent → lire `window.matchMedia('(prefers-color-scheme: dark)')`.
2. **Toggle utilisateur** : basculer la classe `dark` sur `<html>`, sauvegarder dans `localStorage`.
3. **Persistance** : `localStorage` prend toujours le dessus sur la préférence système après le premier choix explicite.

### Anti-FOUC

Script inline bloquant injecté dans `<head>` de `BaseLayout.astro` **avant** tout lien CSS :

```html
<script>
  (function () {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (stored === 'dark' || (!stored && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
  })();
</script>
```

Ce script s'exécute de façon synchrone avant le premier paint — zéro flash de mauvais thème.

### Toggle button (dans `Nav.astro`)

- Élément : `<button id="theme-toggle">`
- Icône : soleil SVG en dark mode, lune SVG en light mode (swap via JS)
- `aria-label` dynamique : `"Passer en mode clair"` / `"Passer en mode sombre"`
- Position desktop : à droite des liens nav, avant le burger mobile
- Position mobile : visible dans la nav, à gauche du burger

### Script toggle (inline dans `Nav.astro`)

```javascript
const btn = document.getElementById('theme-toggle');
const html = document.documentElement;

function applyTheme(theme) {
  html.classList.toggle('dark', theme === 'dark');
  localStorage.setItem('theme', theme);
  // met à jour l'icône et l'aria-label
}

btn.addEventListener('click', () => {
  const isDark = html.classList.contains('dark');
  applyTheme(isDark ? 'light' : 'dark');
});
```

### Transition CSS

Sur `html` dans `global.css` :
```css
html {
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

---

## Stratégie d'implémentation des couleurs

Les couleurs dark/light sont définies via **CSS custom properties** dans `global.css` :

```css
:root {
  --color-bg: #fffbeb;
  --color-surface: #fef9ee;
  --color-border: #e8d5a3;
  --color-text: #1c1409;
  --color-text-muted: #78543a;
}

.dark {
  --color-bg: #1c1409;
  --color-surface: #2a1d0f;
  --color-border: #3d2b16;
  --color-text: #fef3c7;
  --color-text-muted: #d4a96a;
}

html {
  background-color: var(--color-bg);
  color: var(--color-text);
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

Ces variables sont ensuite enregistrées dans `tailwind.config.mjs` comme tokens personnalisés :

```javascript
colors: {
  accent: { 300: '#fcd34d', 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706' },
  surface: 'var(--color-surface)',
  border-warm: 'var(--color-border)',
  text-muted: 'var(--color-text-muted)',
}
```

Les composants existants (`bg-gray-950`, `text-gray-400`, etc.) sont mis à jour pour utiliser `bg-[var(--color-bg)]`, `bg-surface`, `text-[var(--color-text-muted)]`, etc. Les classes `dark:` de Tailwind ne sont **pas** nécessaires sur chaque élément — le basculement des variables CSS via la classe `dark` sur `<html>` suffit.

---

## Fichiers modifiés

| Fichier | Nature du changement |
|---|---|
| `tailwind.config.mjs` | Palette accent ambre (300–600), tokens CSS-var (`surface`, `text-muted`), font families |
| `src/styles/global.css` | CSS variables light/dark, transition `html`, `h1-h4` en Playfair Display, `html` en DM Sans |
| `src/layouts/BaseLayout.astro` | Script anti-FOUC dans `<head>`, URL Google Fonts (Playfair Display + DM Sans + Fira Code) |
| `src/components/Nav.astro` | Bouton toggle (icônes SVG soleil/lune, aria-label) + script JS, remplacement `gray-*` → variables chaudes |
| `src/components/Footer.astro` | `text-gray-500` → `text-[var(--color-text-muted)]`, `hover:text-accent-400` reste |

---

## Hors périmètre

- Changement du contenu des pages (seules les couleurs/fonts changent)
- Animation d'icône du toggle (simple swap suffit)
- Sync du thème entre onglets (pas demandé)
