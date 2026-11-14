const { chromium } = require('playwright');
const D = __dirname + '/';
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, timezoneId: 'Europe/Paris' });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.clock.install({ time: new Date('2026-11-10T07:30:00+01:00') });
  await p.goto('file://' + D + 'test.html');
  await p.clock.runFor(1000);
  const win = async () => p.evaluate(() => {
    const J = window.__JDS; for (let k = 0; k < 5; k++) J.SAVE.stars['0-' + k] = 3;
    J.show('daily'); document.querySelector('[data-act=playdaily]').click();
    const S = J.S; S.tut = null; S.wave = S.totalWaves; S.waveActive = true; S.queue = []; S.enemies = [];
  });
  const state = async label => {
    await p.clock.runFor(3000);
    const r = await p.evaluate(() => { const J = window.__JDS; return { screen: J.screen, daily: JSON.stringify(J.SAVE.daily) }; });
    await p.evaluate(() => window.__JDS.show('daily'));
    const txt = await p.evaluate(() => document.querySelector('#ui').innerText.replace(/\s+/g, ' ').slice(0, 260));
    console.log(label, r.screen, r.daily, '\n   ', txt);
  };
  await win(); await state('J1 07:30 (compte pour la veille)');
  await p.clock.setSystemTime(new Date('2026-11-10T07:59:00+01:00')); await state('J1 07:59 :');
  await p.clock.setSystemTime(new Date('2026-11-10T08:01:00+01:00')); await state('J1 08:01 :');
  await win(); await state('J1 08:01 après victoire :');
  await p.clock.setSystemTime(new Date('2026-11-11T08:05:00+01:00')); await state('J2 08:05 :');
  await win(); await state('J2 après victoire :');
  await p.clock.setSystemTime(new Date('2026-11-13T09:00:00+01:00')); await state('J4 (jour sauté) :');
  console.log(errs);
  await b.close();
})();
