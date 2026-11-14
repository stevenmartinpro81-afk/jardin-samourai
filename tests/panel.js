const { chromium } = require('playwright');
const D = __dirname + '/';
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const errs = []; p.on('pageerror', e => errs.push(e.message + ' ' + (e.stack || '').split('\n')[1]));
  await p.goto('file://' + D + 'test2.html'); await p.waitForTimeout(600);
  await p.evaluate(() => { const J = window.__JDS; for (let k = 0; k < 12; k++) J.SAVE.stars[Math.floor(k / 10) + '-' + (k % 10)] = 3; J.startLevel(0, 1, 1); const S = J.S; S.tip = null; S.speed = 0.001;
    const sl = S.G.slots; const top = sl.reduce((a, c) => c[1] < a[1] ? c : a), bot = sl.reduce((a, c) => c[1] > a[1] ? c : a);
    S.plants.push({ type: 'bambou', lvl: 3, slot: sl.indexOf(top), x: top[0], y: top[1], cd: 0, fireT: 0, spent: 200 });
    S.plants.push({ type: 'bonsai', lvl: 2, slot: sl.indexOf(bot), x: bot[0], y: bot[1], cd: 0, fireT: 0, spent: 200 });
    S.menu = { kind: 'plant', plant: S.plants[0], x: top[0], y: top[1] }; });
  await p.waitForTimeout(300); await p.screenshot({ path: D + 'o_top.png' });
  // click spec b through real pointer
  const r = await p.evaluate(() => { const c = document.querySelector('canvas').getBoundingClientRect(); const bb = window.__JDS.menuButtons().find(x => x.k === 'b').rect; return [c.left + (bb.x + bb.w / 2) * c.width / 360, c.top + (bb.y + bb.h / 2) * c.height / 640]; });
  await p.mouse.click(r[0], r[1]); await p.waitForTimeout(200);
  console.log('spec now', await p.evaluate(() => window.__JDS.S.plants[0].spec));
  await p.evaluate(() => { const S = window.__JDS.S; S.menu = { kind: 'plant', plant: S.plants[1], x: S.plants[1].x, y: S.plants[1].y }; });
  await p.waitForTimeout(300); await p.screenshot({ path: D + 'o_bot.png' });
  // tap inside panel (not a button) keeps menu open
  await p.evaluate(() => {});
  console.log(errs); await b.close();
})();
