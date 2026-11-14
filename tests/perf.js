const { chromium } = require('playwright');
const D = __dirname + '/';
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + D + 'test2.html'); await p.waitForTimeout(600);
  const r = await p.evaluate(async () => {
    const J = window.__JDS; for (let k = 0; k < 40; k++) J.SAVE.stars[Math.floor(k / 10) + '-' + (k % 10)] = 3;
    J.startLevel(3, 9, 2); const S = J.S; S.tip = null;
    const types = ['bambou', 'bonsai', 'lotus', 'erable', 'glycine', 'hozuki', 'sakura'];
    S.G.slots.forEach(([x, y], i) => S.plants.push({ type: types[i % 7], lvl: 1 + (i % 5), slot: i, x, y, cd: 0, fireT: 0, spent: 100, spec: i % 2 ? 'a' : 'b' }));
    const E = J.CONFIG.enemies, list = ['kappa', 'oni', 'tengu', 'shinobi', 'tanuki', 'kitsune'];
    for (let i = 0; i < 90; i++) { const t = list[i % 6]; S.enemies.push({ id: 1000 + i, type: t, def: E[t], hp: E[t].hp * 40, max: E[t].hp * 40, elite: i % 4 ? null : 'regen', lastHit: -9, stunT: 0, d: i * 12, pi: 0, slowT: 0, slowK: 0, hitT: 0, burnT: 0, burnDps: 0, burnTick: 0, invT: 0, ph: i }); }
    S.waveActive = true; S.queue = [{ time: 1e9, type: 'kappa' }]; S.freezeT = 1e9; for (const e of S.enemies) { e.hp = e.max = 1e9; }
    let t0 = performance.now(); for (let i = 0; i < 600; i++) J.update(1 / 60); const upd = (performance.now() - t0) / 600;
    // frames rendus réels
    const frames = []; let last = performance.now();
    await new Promise(res => { let n = 0; const f = now => { frames.push(now - last); last = now; if (++n < 180) requestAnimationFrame(f); else res(); }; requestAnimationFrame(f); });
    frames.sort((a, b) => a - b);
    return { updateMs: upd.toFixed(2), enemies: S.enemies.length, projs: S.projs.length, parts: S.parts.length, frameMedian: frames[90].toFixed(1), frameP95: frames[171].toFixed(1) };
  });
  console.log(r, errs); await b.close();
})();
