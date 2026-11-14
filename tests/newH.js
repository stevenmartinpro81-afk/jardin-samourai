const { chromium } = require('playwright');
const D = __dirname + '/';
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message + ' ' + (e.stack || '').split('\n')[1]));
  await p.goto('file://' + D + 'test2.html'); await p.waitForTimeout(600);
  const sh = async n => { await p.waitForTimeout(300); await p.screenshot({ path: D + 'h_' + n + '.png' }); };
  await p.evaluate(() => { const J = window.__JDS; for (let k = 0; k < 22; k++) J.SAVE.stars[Math.floor(k / 10) + '-' + (k % 10)] = 3; J.SAVE.login = { last: 'x', day: 2 }; J.SAVE.best = 14; J.show('home'); });
  await p.waitForTimeout(600); if (await p.$('[data-act=claimlogin]')) await p.click('[data-act=claimlogin]');
  await sh('home');
  await p.click('[data-act=infini]'); await sh('infini');
  await p.click('[data-act=tour]'); await p.waitForTimeout(300);
  const t = await p.evaluate(() => { const S = window.__JDS.S; return [S.mode, S.world, S.mod, S.tour]; }); console.log('tour state', t);
  // finish tour run quickly : 12 waves cleared
  await p.evaluate(() => { const S = window.__JDS.S; S.cleared = 12; S.lanterns = 0; });
  await p.waitForTimeout(1500); console.log('after defeat', await p.evaluate(() => [window.__JDS.screen, JSON.stringify(window.__JDS.SAVE.tour)]));
  await sh('tourlose');
  await p.evaluate(() => window.__JDS.show('infini')); await p.waitForTimeout(200);
  if (await p.$('[data-act=claimtour]')) await p.click('[data-act=claimtour]');
  await sh('infini2');
  // export / import
  await p.evaluate(() => window.__JDS.show('settings')); await sh('settings');
  await p.click('[data-act=export]'); await p.waitForTimeout(200);
  const code = await p.$eval('#savebox', e => e.value); console.log('code length', code.length);
  await sh('export');
  await p.evaluate(() => { const J = window.__JDS; J.show('settings'); }); await p.click('[data-act=import]');
  await p.fill('#savebox', 'nimportequoi'); await p.click('[data-act=loadsave]'); await p.waitForTimeout(100);
  console.log('bad code msg:', await p.$eval('#savemsg', e => e.textContent));
  await p.fill('#savebox', code); await p.click('[data-act=loadsave]'); await p.waitForTimeout(100);
  console.log('good code msg:', await p.$eval('#savemsg', e => e.textContent));
  await sh('import');
  // level challenge
  await p.evaluate(() => window.__JDS.show('level', { w: 1, i: 1 })); await sh('level');
  await p.evaluate(() => { const J = window.__JDS; J.startLevel(1, 1, 1); const S = J.S; S.tip = null; console.log('chal', S.chal && S.chal.id); S.wave = S.totalWaves; S.waveActive = true; S.queue = []; S.enemies = []; });
  await p.waitForTimeout(2500); await sh('chalwin');
  console.log('chal save', await p.evaluate(() => JSON.stringify(window.__JDS.SAVE.chal)));
  console.log(errs); await b.close();
})();
