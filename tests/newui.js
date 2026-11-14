const { chromium } = require('playwright');
const D = __dirname + '/';
(async () => {
  const b = await chromium.launch();
  const errs = [];
  for (const [w, h, tag] of [[390, 844, 'a'], [360, 640, 'b']]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    p.on('pageerror', e => errs.push(e.message + ' ' + (e.stack || '').split('\n')[1]));
    await p.goto('file://' + D + 'test2.html'); await p.waitForTimeout(600);
    await p.screenshot({ path: D + 'n_home0' + tag + '.png' });
    await p.evaluate(() => { const J = window.__JDS; for (let k = 0; k < 15; k++) J.SAVE.stars[Math.floor(k / 10) + '-' + (k % 10)] = 3; J.SAVE.stats.kills.kappa = 30; J.show('home'); });
    await p.waitForTimeout(700);
    await p.screenshot({ path: D + 'n_login' + tag + '.png' });
    console.log(tag, 'screen after home:', await p.evaluate(() => window.__JDS.screen));
    if (await p.$('[data-act=claimlogin]')) await p.click('[data-act=claimlogin]');
    await p.waitForTimeout(400);
    console.log(tag, 'home overflow', await p.evaluate(() => { const e = document.querySelector('.scr'); return [e.scrollHeight, e.clientHeight]; }));
    await p.screenshot({ path: D + 'n_home' + tag + '.png' });
    if (tag === 'a') {
      await p.click('[data-act=quests]'); await p.waitForTimeout(300); await p.screenshot({ path: D + 'n_quests.png' });
      await p.evaluate(() => { const J = window.__JDS; J.SAVE.stats.kills.kappa = 400; J.SAVE.stats.merges += 20; J.SAVE.stats.wins += 5; J.SAVE.stats.perfect += 2; J.SAVE.stats.pwUsed = 50; J.SAVE.stats.hero = 99; J.SAVE.stats.hardWins = 5; J.SAVE.stats.kills.oni = 99; J.SAVE.stats.kills.gasha = 3; J.show('quests'); });
      for (let i = 0; i < 3; i++) { const bt = await p.$('[data-act=claimq]'); if (bt) await bt.click(); await p.waitForTimeout(150); }
      await p.screenshot({ path: D + 'n_quests2.png' });
      await p.evaluate(() => window.__JDS.show('heroes')); await p.waitForTimeout(300); await p.screenshot({ path: D + 'n_heroes.png' });
      await p.click('[data-act=pickhero][data-t=aya]'); await p.waitForTimeout(200);
      await p.evaluate(() => { const J = window.__JDS; J.startLevel(1, 3, 1); J.S.tip = null; J.S.hero.x = J.S.hero.tx = 180; J.S.hero.y = J.S.hero.ty = 330; J.startWave(); J.S.speed = 2; });
      await p.waitForTimeout(250); await p.screenshot({ path: D + 'n_banner.png' });
      await p.waitForTimeout(9000); await p.screenshot({ path: D + 'n_aya.png' });
      console.log('aya', await p.evaluate(() => { const S = window.__JDS.S; return [S.hero.type, S.hero.kills, S.hero.lvl, Math.round(S.dmgBy.hero || 0)]; }));
    }
    await p.close();
  }
  console.log(errs); await b.close();
})();
