# Jardin de Samouraï : sortir le jeu sur les stores

Ce dossier contient l'application prête à être construite pour Android et iPhone.
Tout le jeu est dans `www/index.html`. Le reste sert à en faire une vraie appli.

## Ce qui est déjà prêt

- `resources/icon.png` : l'icône du jeu (1024 × 1024).
- `resources/splash.png` : l'écran de démarrage.
- `android/` : le projet Android complet, avec les icônes dans toutes les tailles et le jeu bloqué en mode portrait.
- `www/` : le jeu en version installable. Il marche aussi sans connexion.
- `build.py` : recopie la dernière version du jeu (`../index.html`) dans `www/`.

## Ce dont tu as besoin (toi)

| Quoi | Prix | Pour quoi faire |
|---|---|---|
| Un ordinateur Windows, Mac ou Linux | – | Construire l'appli Android |
| Android Studio (gratuit) | 0 € | Ouvrir le projet et créer le fichier de l'appli |
| Compte Google Play Console | 25 $, une seule fois | Publier sur le Play Store |
| Un Mac + Xcode (gratuit) | – | Seulement pour l'iPhone |
| Compte Apple Developer | 99 $ par an | Publier sur l'App Store |

Conseil : commence par Android. C'est moins cher, plus simple et plus rapide à faire valider.

## Étapes pour Android

1. Installe **Node.js** (version LTS) et **Android Studio**.
2. Copie ce dossier `app` sur ton ordinateur.
3. Dans un terminal, ouvert dans le dossier `app`, lance :
   ```bash
   npm install
   ```
   puis
   ```bash
   npm run android
   ```
   Android Studio s'ouvre avec le projet.
4. Pour tester : branche ton téléphone en USB (avec le « mode développeur » activé) et clique sur le bouton ▶.
5. Pour publier : dans Android Studio, ouvre **Build → Generate Signed App Bundle**, choisis **Android App Bundle**, puis crée une **clé de signature**.
   ⚠️ **Garde précieusement cette clé et son mot de passe.** Sans elle, tu ne pourras plus jamais mettre le jeu à jour.
6. Sur la [Google Play Console](https://play.google.com/console), crée l'appli et envoie le fichier `.aab`.
7. Remplis la fiche : description, captures d'écran, classification du contenu (questionnaire), et la politique de confidentialité (voir plus bas).
   Google demande souvent un **test fermé avec 12 testeurs pendant 14 jours** avant la mise en ligne publique : prévois des amis ou de la famille.

## Étapes pour iPhone (plus tard)

Sur un Mac, dans le dossier `app` :
```bash
npx cap add ios
```
puis
```bash
npm run ios
```
Xcode s'ouvre. Tu choisis ton équipe Apple Developer et tu envoies le jeu sur App Store Connect.

## Mettre à jour le jeu

Chaque fois que le jeu change :
1. Remplace `../index.html` par la nouvelle version (celle de l'artifact).
2. Lance `npm run android`. Ça reconstruit et recopie tout.
3. Dans `android/app/build.gradle`, augmente `versionCode` de 1 et change `versionName` (par exemple 1.1).

## Avant la sortie, à décider ensemble

- **Nom définitif et identifiant** : l'appli s'appelle `fr.jardinsamourai.jeu` dans `capacitor.config.json`. L'identifiant ne pourra plus changer après la première publication.
- **Politique de confidentialité** : obligatoire. Le jeu n'envoie rien sur internet et garde la progression sur le téléphone. Une page simple suffit.
- **Achats in-app** (jade, Voie dorée) : il faudra brancher le paiement du store (Google Play Billing). Les boutons « bientôt » sont déjà prévus dans le jeu.
- **Polices** : le jeu utilise les polices Google en ligne. Sans connexion, il prend des polices de secours très proches. On pourra les intégrer à l'appli pour une version 100 % hors ligne.
- **Sauvegarde** : la progression reste dans le téléphone. Une sauvegarde en ligne (compte Google) pourra venir ensuite.
