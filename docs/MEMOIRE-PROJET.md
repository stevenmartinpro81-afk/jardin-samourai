---
name: "jardin-samourai"
description: "Reprendre et faire évoluer le jeu mobile tower defense Jardin de Samouraï de Steven (plantes japonaises contre yōkai) : code, équilibrage, tests, publication."
---

# Jardin de Samouraï — mémoire du projet

Steven (francophone, débutant en code, très impliqué) crée avec Claude un tower defense mobile vertical. Il donne carte blanche pour améliorer et ajouter des idées inspirées des grands jeux (Kingdom Rush, Bloons TD, Clash Royale, Plants vs Zombies). Toujours lui répondre en français simple, sans jargon.

## Où est le jeu
- Artifact publié : https://claude.ai/artifact/9dvxht6dgFiZGqBv7zxZ59 (un seul fichier HTML).
- Au début d'une nouvelle conversation : `Artifact action=read url=<lien>` pour récupérer la dernière version, l'enregistrer en local (ex. `jardin-samourai/index.html`), travailler dessus, puis republier avec `url=<lien>` pour garder le même lien. Ne jamais créer un nouvel artifact pour le jeu.
- Faire une copie de sauvegarde avant chaque série de modifications.

## Architecture (fichier unique)
- Canvas logique 360×640 portrait (W, H, TOP=48, BOTTOM=586) + calque DOM `#ui` pour les menus (variable CSS `--u` pour l'échelle). Polices Google : Shippori Mincho B1 (titres), Zen Maru Gothic.
- Sauvegarde localStorage `jds_save2` (objet SAVE, fonction `persist()`). Toute nouvelle donnée de sauvegarde doit avoir une valeur par défaut et une migration douce (`SAVE.seen.xxx`).
- `CONFIG` : plantes (bambou, sakura, bonsai, lotus, erable, glycine), yōkai (kappa, tanuki, oni, kitsune, tengu) + boss (gasha, kyubi, daitengu), fusion (niveau max 5, forme ultime), difficultés Facile/Normal/Difficile + paliers Infernal, compétences toutes les 3 vagues, améliorations du Sanctuaire, synergies, pouvoirs (Pluie de pétales 嵐, Frappe du katana 斬, débloqués en partie : 15 kappa / 3 grands yōkai ou 40 kappa), défis du jour, raretés C/R/E/L/M avec pitié (épique 10, légendaire 50), coffres (bambou, impérial, saison).
- Cartes par niveau : `MAPS` + `LEVEL_MAPS[monde][niveau] = [carte, miroir, nbEmplacements]`, `geoFor()` ; certaines cartes ont 2 chemins.
- Événements calendaires (`EVENTS`, `currentEvent()`) : Shōgatsu, Hiver (neige), Hanami (pétales), Matsuri (lucioles), Momiji (érables), avec coffre et 4 skins exclusifs chacun.
- Audio WebAudio 100 % synthétisé : effets par plante, musique générative (menu pentatonique majeur calme ; combat miyako-bushi). Volume musique par défaut 25 %.
- Écran de jeu : variable globale `S` (état de partie), `M` (modificateurs). Hook de test : `window.__JDS`.

## Règles de design voulues par Steven (ne pas casser)
- Les plantes ne se déplacent PAS sur un emplacement vide : seulement échanger ou fusionner (2 plantes identiques de même niveau).
- La musique de combat lui plaît : ne pas la changer sans demande. La musique du menu doit rester douce.
- Bestiaire : yōkai non rencontrés en silhouette grise totale avec « ? ».
- Sons doux, jamais agressifs pour les oreilles ; chaque plante a un son distinct.
- Chaque niveau doit être différent (tracé, emplacements), difficulté progressive.
- Pas d'achat en argent réel actif (packs de jade affichés « bientôt »). Les doublons donnent des fragments (10/25/60/150/500).
- Menus lisibles au doigt : boutons bien séparés, infobulles par appui long sur mobile / survol à la souris.

## Méthode de travail (ce qui marche)
1. Lire la demande, lister les points, poser une seule question seulement si c'est vraiment bloquant.
2. Modifier par petits correctifs Python (remplacement de texte qui vérifie que le motif existe exactement une fois) plutôt que réécrire le fichier.
3. Tester avec Playwright (Chromium déjà installé) : copier le fichier en `test.html`, ajouter `<meta charset="utf-8">` en tête, exposer dans `window.__JDS` les fonctions utiles (show, freshState, startWave, openChests…). Les coordonnées souris doivent être converties via `canvas.getBoundingClientRect()`. Ignorer les erreurs réseau des polices.
4. Toujours regarder les captures d'écran (accueil, boutique, Sanctuaire, en partie, cas limites près des bords) et vérifier qu'il n'y a aucune erreur JS.
5. Pour l'équilibrage : bot de campagne qui place les plantes selon la couverture du chemin ; viser qu'un bon joueur finisse Normal, que Difficile bloque vers le monde 3, et que l'Infernal 5 soit un mur.
6. Surveiller les performances (cache de sprites, limites de particules, option effets réduits).
7. Publier sur le même lien, avec un `label` court (ex. « V7.2 : pouvoirs à débloquer »).
8. Répondre en français : ce qui a changé, pourquoi, et 2 à 4 idées pour la suite. Pas de récapitulatif technique.

## État au 10/11/2026 (V11)
- 4 mondes × 10 niveaux (Château d'Edo : shinobi toujours invisibles, plante hōzuki qui révèle, boss Shuten-dōji). 7 plantes, chacune avec 2 spécialisations au niveau 3 (`CONFIG.specs`, choix définitif gardé en fusion).
- Héros (`CONFIG.heroes`) : Kenji (corps à corps) et Aya (distance, marque). Niveaux en partie par ses propres victoires, rangs permanents `SAVE.hrank`, choix `SAVE.heroSel`, apparences dans `CONFIG.skins.kenji/aya`. Au monde 4, deux héros ensemble (`S.heroes`, `withHero()`).
- Pouvoirs à équiper (2 à 4 emplacements selon le monde) : pétales, katana, kami, rosée, vent, Raijin (défis de déblocage).
- Élites (blindé, rapide, guérisseur, géant) à partir du 2-6 ; boss qui enragent à mi-vie.
- Sanctuaire = 4 temples (un par monde) + Maîtrise des plantes. Passe mensuelle « Voie du samouraï ». Quêtes du jour + cadeau quotidien 7 jours (reset à 8 h, `dailyKey()`), défi du jour, défis de niveau (+25 jade, sceau 挑), tournoi de la semaine (mode infini, monde + règle tournants).
- Accueil avec barre de navigation en bas ; Guide du jardin (paramètres / pause) ; export/import de sauvegarde ; écran « Quoi de neuf ? » (`SAVE.seen.news11`).
- Projet d'appli : `jardin-samourai/app` (Capacitor 6, Android généré, `build.py` recopie le jeu, `GUIDE-SORTIE.md`). Icône/splash générés depuis les dessins du jeu.
- Tests utiles : monkey test (7 500 touches au hasard), robot de campagne (dépense les graines, spécialise, utilise les pouvoirs).

## Pistes pour la suite
Traduction anglaise (marché mondial), achats Google Play Billing pour jade et Voie dorée, sauvegarde en ligne, 3e héros, monde 5, PVP (nécessite un serveur).
