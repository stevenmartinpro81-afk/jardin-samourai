# Jardin de Samouraï

Tower defense mobile (format portrait) : des plantes japonaises défendent un sanctuaire contre les yōkai.

- **Jouer** : ouvrir `index.html` dans un navigateur (tout le jeu tient dans ce seul fichier).
- **Version en ligne** : artifact claude.ai `9dvxht6dgFiZGqBv7zxZ59`.

## Contenu du dépôt

| Dossier / fichier | Rôle |
|---|---|
| `index.html` | Le jeu complet (JavaScript pur, canvas 360×640, menus HTML, sons générés). |
| `app/` | Projet d'application Android / iPhone (Capacitor 6). `build.py` recopie `index.html` dans `app/www/`. |
| `app/GUIDE-SORTIE.md` | Étapes pour publier sur Google Play et l'App Store. |
| `app/resources/` | Icône (1024×1024) et écran de démarrage. |
| `tests/` | Scripts Playwright : test au hasard (`monkey.js`), robot de campagne (`campaign.js`), captures d'écrans, performances. |
| `docs/MEMOIRE-PROJET.md` | Mémoire du projet : architecture, règles de design, état, pistes. |

## Construire l'appli Android

```bash
cd app
npm install
npm run android
```

Android Studio s'ouvre ; voir `app/GUIDE-SORTIE.md`.

## Tests

Les scripts de `tests/` chargent une copie du jeu nommée `test.html` (ou `test2.html` / `test3.html`) placée dans le même dossier,
avec `<meta charset="utf-8">` en tête et les fonctions internes exposées dans `window.__JDS`
(par exemple en remplaçant `window.__JDS = { ` par `window.__JDS = { show, startLevel, startWave, update, … `).
