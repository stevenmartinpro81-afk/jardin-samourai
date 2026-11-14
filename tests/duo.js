const { chromium } = require('playwright');
const D = __dirname + '/';
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const errs = []; p.on('pageerror', e => errs.push(e.message + ' ' + (e.stack || '').split('\n')[1]));
  await p.goto('file://' + D + 'test2.html'); await p.waitForTimeout(600);
  await p.evaluate(() => { const J = window.__JDS; for (let k = 0; k < 31; k++) J.SAVE.stars[Math.floor(k / 10) + '-' + (k % 10)] = 3; J.SAVE.seen.hero = 1; J.SAVE.seen.aya = 1; J.show('level', { w: 3, i: 0 }); });
  await p.waitForTimeout(300); await p.screenshot({ path: D + 'k_level.png' });
  await p.evaluate(() => { const J = window.__JDS; J.startLevel(3, 0, 1); J.S.tip = null; });
  console.log('heroes', await p.evaluate(() => window.__JDS.S.heroes.map(h => h.type)));
  const r = await p.evaluate(() => { const c = document.querySelector('canvas').getBoundingClientRect(); return [c.left, c.top, c.width / 360, c.height / 640]; });
  const P = (x, y) => [r[0] + x * r[2], r[1] + y * r[3]];
  // drag the second hero (Aya at 210,512) to (250, 300)
  const h2 = await p.evaluate(() => { const h = window.__JDS.S.heroes[1]; return [h.x, h.y - 14]; });
  await p.mouse.move(...P(...h2)); await p.mouse.down(); await p.mouse.move(...P(230, 400), { steps: 5 }); await p.mouse.move(...P(250, 300), { steps: 5 }); await p.mouse.up();
  await p.waitForTimeout(200);
  // tap the first hero then tap destination
  const h1 = await p.evaluate(() => { const h = window.__JDS.S.heroes[0]; return [h.x, h.y - 14]; });
  await p.mouse.click(...P(...h1)); await p.waitForTimeout(100); await p.mouse.click(...P(100, 250));
  await p.evaluate(() => { const J = window.__JDS; J.startWave(); J.S.speed = 2; });
  await p.waitForTimeout(5000);
  await p.screenshot({ path: D + 'k_game.png' });
  console.log(await p.evaluate(() => window.__JDS.S.heroes.map(h => [h.type, Math.round(h.tx), Math.round(h.ty), h.kills])));
  await p.evaluate(() => { const S = window.__JDS.S; S.wave = S.totalWaves; S.queue = []; S.enemies = []; });
  await p.waitForTimeout(2500); await p.screenshot({ path: D + 'k_win.png' });
  console.log(errs); await b.close();
})();
