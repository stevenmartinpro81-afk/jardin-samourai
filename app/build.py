# Construit app/www/index.html à partir du jeu (../index.html) : ajoute l'en-tête d'une vraie appli.
import pathlib, re
here = pathlib.Path(__file__).parent
game = (here.parent / 'index.html').read_text(encoding='utf-8')
game = re.sub(r'<title>.*?</title>\s*', '', game, count=1)
head = '''<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no">
<meta name="theme-color" content="#24221f">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="description" content="Tower defense zen : plante, fusionne et défends le sanctuaire contre les yōkai.">
<title>Jardin de Samouraï</title>
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icons/icon-192.png">
<link rel="apple-touch-icon" href="icons/icon-192.png">
<style>html,body{margin:0;height:100%;overscroll-behavior:none;touch-action:manipulation}</style>
</head>
<body>
'''
tail = '''
<style>body{padding:env(safe-area-inset-top) 0 env(safe-area-inset-bottom) !important}#stage{border-radius:0 !important;box-shadow:none !important}</style>
<script>if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});</script>
</body>
</html>
'''
(here / 'www' / 'index.html').write_text(head + game + tail, encoding='utf-8')
print('www/index.html construit')
