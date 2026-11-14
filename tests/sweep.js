const {chromium}=require('playwright');
const D='/tmp/claude-0/-home-user/4cf46959-55ae-5998-a425-c3e0d43f1d86/scratchpad/';
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,hasTouch:true,isMobile:true});const p=await c.newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/font|net::/i.test(m.text()))errs.push(m.text())});
await p.goto('file://'+D+'test.html');await p.waitForTimeout(800);
const shots=[['home'],['daily'],['collection'],['store'],['bestiary'],['achievements'],['map'],['shop'],['settings'],['level',{w:0,i:0}]];
for(const [n,a] of shots){await p.evaluate(([n,a])=>window.__JDS.show(n,a),[n,a]);await p.waitForTimeout(250);
 const ov=await p.evaluate(()=>{const out=[];document.querySelectorAll('#ui *').forEach(e=>{const cs=getComputedStyle(e);if(e.scrollHeight>e.clientHeight+2&&!/auto|scroll/.test(cs.overflowY)&&cs.overflowY!=='visible'&&e.clientHeight>0)out.push('clipY:'+e.className);if(e.scrollWidth>e.clientWidth+2&&e.clientWidth>0&&cs.overflowX!=='visible')out.push('clipX:'+e.className)});const ui=document.getElementById('ui').getBoundingClientRect();document.querySelectorAll('#ui button, #ui b, #ui p, #ui span').forEach(e=>{const r=e.getBoundingClientRect();if(r.width&&(r.right>ui.right+1||r.left<ui.left-1))out.push('out:'+e.tagName+':'+e.textContent.slice(0,20))});return [...new Set(out)].slice(0,8)});
 console.log(n,JSON.stringify(ov));await p.screenshot({path:D+'s_'+n+'.png'});}
// in-game
await p.evaluate(()=>window.__JDS.startLevel(0,0));await p.waitForTimeout(500);await p.screenshot({path:D+'s_game.png'});
await p.evaluate(()=>window.__JDS.startWave());await p.waitForTimeout(3000);await p.screenshot({path:D+'s_game2.png'});
await p.evaluate(()=>window.__JDS.show('pause'));await p.waitForTimeout(200);await p.screenshot({path:D+'s_pause.png'});
await p.evaluate(()=>window.__JDS.show('lose',{endless:false,cleared:3,ach:[{kanji:'庭',name:'Test',seeds:5}]}));await p.waitForTimeout(1500);await p.screenshot({path:D+'s_lose.png'});
await p.evaluate(()=>{window.__JDS.show('win',{chest:1,ach:[{kanji:'庭',name:'Maître du jardin',seeds:40},{kanji:'庭',name:'Autre',seeds:10}],diff:'Difficile',firstHard:1,stars:3,seeds:87,lost:0,unlocks:['erable'],endless:1,dailyNew:1,next:[1,0],boss:'Gashadokuro'})});await p.waitForTimeout(2500);await p.screenshot({path:D+'s_win.png'});
console.log('ERR',errs);await b.close();})();
