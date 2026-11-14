const { chromium } = require('playwright');
const D = __dirname + '/';
(async () => {
  const b = await chromium.launch();
  const errs = new Map();
  for (const seed of [1, 2, 3]) {
    const p = await b.newPage({ viewport: { width: 390, height: 844 } });
    p.on('pageerror', e => { const k = e.message + ' | ' + (e.stack || '').split('\n')[1]; errs.set(k, (errs.get(k) || 0) + 1); });
    await p.goto('file://' + D + 'test.html');
    await p.waitForTimeout(500);
    if (seed > 1) await p.evaluate(sd => {
      const J = window.__JDS; const n = sd === 2 ? 14 : 40;
      for (let k = 0; k < n; k++) J.SAVE.stars[Math.floor(k / 10) + '-' + (k % 10)] = 3;
      Object.assign(J.SAVE, { seeds: 5000, jade: 5000, frags: 5000, chests: 20, chestsImp: 5 }); J.SAVE.pass.xp = 900; J.show('home');
    }, seed);
    let r = seed * 9973; const rnd = () => { r = (r * 16807) % 2147483647; return r / 2147483647; };
    const box = await p.evaluate(() => { const c = document.getElementById('stage').getBoundingClientRect(); return [c.left, c.top, c.width, c.height]; });
    for (let i = 0; i < 2500; i++) {
      const st = await p.evaluate(() => { const J = window.__JDS; return [J.screen, J.S.mode]; }).catch(() => ['x']);
      if (st[0] === 'none' && st[1] !== 'idle' && rnd() < 0.02) await p.evaluate(() => { window.__JDS.S.speed = 3; });
      const btns = await p.$$('#ui:not([hidden]) button:not([disabled])');
      if (btns.length && rnd() < 0.6) { const bt = btns[Math.floor(rnd() * btns.length)]; try { await bt.click({ timeout: 300, force: true }); } catch (e) {} }
      else {
        const x = box[0] + rnd() * box[2], y = box[1] + rnd() * box[3];
        if (rnd() < 0.25) { await p.mouse.move(x, y); await p.mouse.down(); await p.mouse.move(x + (rnd() - 0.5) * 120, y + (rnd() - 0.5) * 120, { steps: 4 }); await p.mouse.up(); }
        else await p.mouse.click(x, y);
      }
      if (i % 300 === 0) await p.waitForTimeout(200);
    }
    console.log('seed', seed, 'screens ok');
    await p.close();
  }
  console.log('ERRORS', errs.size);
  for (const [k, v] of errs) console.log(v, k);
  await b.close();
})();
