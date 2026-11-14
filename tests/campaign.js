// Robot de campagne : joue les 40 niveaux en Normal comme un joueur appliqué.
const { chromium } = require('playwright');
const D = __dirname + '/';
const DIFF = +(process.argv[2] || 1), MAXTRY = 3;
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message + ' ' + (e.stack || '').split('\n')[1]));
  await p.goto('file://' + D + 'test3.html'); await p.waitForTimeout(600);
  const START = process.argv[3]; if (START) { await p.evaluate(j => { localStorage.setItem('jds_save2', j); }, require('fs').readFileSync(D + 'camp_save_' + START + '.json', 'utf8')); await p.reload(); await p.waitForTimeout(600); }
  await p.evaluate(() => { const J = window.__JDS; J.SAVE.seen.tut2 = 1; J.SAVE.settings.vibe = false; });
  const rows = [];
  const [sw, si0] = START ? START.split('-').map(Number) : [1, 0];
  for (let w = 0; w < 4; w++) for (let i = 0; i < 10; i++) {
    if (w * 10 + i < (sw - 1) * 10 + si0) continue;
    let res = null, tries = 0;
    while (tries < MAXTRY) {
      tries++;
      await p.evaluate(([w, i, d]) => {
        const J = window.__JDS; J.SAVE.settings.diff = d; J.startLevel(w, i, d); const S = J.S; S.tip = null; S.tut = null;
        const G = S.G, P = G.paths[0];
        // emplacements triés par couverture du chemin
        const cover = G.slots.map(([x, y]) => { let c = 0; for (const Pp of G.paths) for (let dd = 0; dd < Pp.len; dd += 8) { const [a, bb] = G.at(dd, G.paths.indexOf(Pp)); if (Math.hypot(a - x, bb - y) < 100) c++; } return c; });
        window.__order = G.slots.map((_, k) => k).sort((a, b) => cover[b] - cover[a]);
        window.__k = 0;
        for (const h of (S.heroes || [])) { const [hx, hy] = G.at(P.len * (h.type === 'aya' ? 0.45 : 0.62), 0); h.x = h.tx = hx + 18; h.y = h.ty = hy + 22; }
      }, [w, i, DIFF]);
      res = null;
      for (let ch = 0; ch < 600 && !res; ch++) {
        res = await p.evaluate(() => {
          const J = window.__JDS, CF = J.CONFIG;
          for (let t = 0; t < 1500; t++) {
            const S = J.S;
            if (J.screen === 'skills') { const c = J.rollSkills(); if (c[0]) J.takeSkill(c[0].id); J.show('none'); }
            if (J.screen === 'win' || J.screen === 'lose') return [J.screen, S.lanterns, S.maxLanterns, S.wave, S.totalWaves];
            if (J.screen !== 'none' && J.screen !== 'skills') J.show('none');
            const open = ['bambou', 'bonsai', 'sakura', 'lotus', 'erable', 'glycine', 'hozuki'].filter(t => J.plantOpen(t));
            if (!S.waveActive || (S.queue.length === 0 && S.enemies.length < 3)) {
              // fusionner si plus de place
              const free = window.__order.filter(si => !S.plants.some(pl => pl.slot === si));
              if (!free.length) { for (const a of S.plants) { const q = S.plants.find(x => x !== a && x.type === a.type && x.lvl === a.lvl && a.lvl < 5); if (q) { q.lvl++; q.spent += a.spent; q.spec = q.spec || a.spec; S.plants = S.plants.filter(x => x !== a); break; } } }
              for (const si of window.__order) {
                if (S.plants.some(pl => pl.slot === si)) continue;
                const need = S.world === 3 && S.plants.filter(x => x.type === 'hozuki').length < 2 && open.includes('hozuki') ? 'hozuki' : open[window.__k % open.length];
                const c = CF.plants[need].cost; if (S.petals < c) break;
                const [x, y] = S.G.slots[si]; S.petals -= c; S.plants.push({ type: need, lvl: 1, slot: si, x, y, cd: 0, fireT: 0, spent: c }); window.__k++;
              }
              for (const pl of S.plants) if (pl.lvl >= 3 && !pl.spec) pl.spec = ['bambou', 'erable', 'hozuki'].includes(pl.type) ? 'a' : 'b';
              if (!S.waveActive && !S.over) J.startWave();
            }
            // pouvoirs
            for (const id of S.powers || []) {
              if (!(S.pwOpen && S.pwOpen[id]) || (S.pw[id] || 0) > 0 || S.over) continue;
              const far = S.enemies.filter(e => e.d > S.G.paths[e.pi].len * 0.72);
              if (id === 'petals' && far.length >= 2) J.usePower('petals');
              else if (id === 'katana' && far.length) { const e = far.sort((a, b) => b.hp - a.hp)[0], [x, y] = J.posOf(e); J.usePower('katana'); J.katanaAt(x, y); }
              else if (id === 'kami' && S.lanterns < S.maxLanterns - 3) J.usePower('kami');
              else if (id === 'dew' && S.enemies.length >= 8) J.usePower('dew');
              else if (id === 'wind' && far.length >= 2) J.usePower('wind');
              else if (id === 'raijin' && S.enemies.length >= 5) J.usePower('raijin');
            }
            J.update(1 / 60);
          }
          return null;
        });
        if (!res) await p.waitForTimeout(650);
      }
      // dépenser les graines : l'amélioration la moins chère d'abord
      await p.evaluate(() => {
        const J = window.__JDS, SV = J.SAVE;
        for (let n = 0; n < 60; n++) {
          const ok = J.CONFIG.upgrades.filter(u => J.templeOpen(u.t || 0) && (u.t !== 'm' || J.plantOpen(u.plant)) && (SV.up[u.id] || 0) < u.costs.length).map(u => [u, u.costs[SV.up[u.id] || 0]]).sort((a, b) => a[1] - b[1]);
          if (!ok.length || SV.seeds < ok[0][1]) break; SV.seeds -= ok[0][1]; SV.up[ok[0][0].id] = (SV.up[ok[0][0].id] || 0) + 1;
        }
        J.show('home');
      });
      if (res && res[0] === 'win') break;
    }
    const info = await p.evaluate(() => { const SV = window.__JDS.SAVE; return [SV.seeds, Object.values(SV.up).reduce((a, b) => a + b, 0)]; });
    require('fs').writeFileSync(D + 'camp_save_' + (w + 1) + '-' + (i + 1) + '.json', await p.evaluate(() => JSON.stringify(window.__JDS.SAVE)));
    rows.push(`${w + 1}-${i + 1} ${res ? res[0] : 'timeout'} lanternes ${res ? res[1] + '/' + res[2] : '-'} essais ${tries} · améliorations ${info[1]} · graines ${info[0]}`);
    console.log(rows[rows.length - 1]);
    if (!res || res[0] !== 'win') { console.log('BLOQUÉ'); break; }
  }
  console.log('ERR', errs.slice(0, 5)); await b.close();
})();
