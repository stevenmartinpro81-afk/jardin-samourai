const {chromium}=require('playwright');const D='/tmp/claude-0/-home-user/4cf46959-55ae-5998-a425-c3e0d43f1d86/scratchpad/';
const UPG=process.argv[2]||'half', DIFF=+(process.argv[3]||1), LV=JSON.parse(process.argv[4]||'[[3,0],[3,4],[3,9]]');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await p.goto('file://'+D+'test.html');await p.waitForTimeout(600);
await p.evaluate(([U])=>{const J=window.__JDS;for(let w=0;w<3;w++)for(let i=0;i<10;i++)J.SAVE.stars[w+'-'+i]=3;for(const u of J.CONFIG.upgrades)J.SAVE.up[u.id]=U==='max'?u.costs.length:U==='half'?Math.ceil(u.costs.length/2):U==='mid'?(!u.t?u.costs.length:u.t===1?Math.ceil(u.costs.length/2):u.t==='m'?1:0):0;},[UPG]);
for(const [w,i] of LV){
await p.evaluate(([w,i,d])=>{const J=window.__JDS;J.SAVE.settings.diff=d;J.startLevel(w,i);window.__k=0;window.__shot=0;},[w,i,DIFF]);let r;
for(let ch=0;ch<500&&!r;ch++){r=await p.evaluate(()=>{const J=window.__JDS;let S=J.S;
 const types=['bambou','bonsai','lotus','hozuki','erable','glycine'];let k=window.__k;
 for(let t=0;t<1800;t++){S=J.S;
  if(J.screen==='skills'){const c=J.rollSkills();if(c[0])J.takeSkill(c[0].id||c[0]);J.show('none');}
  if(J.screen==='win'||J.screen==='lose')return [J.screen,S.wave,S.totalWaves,S.lanterns,S.plants.length,S.hero&&S.hero.lvl,JSON.stringify(Object.fromEntries(Object.entries(S.dmgBy).map(([a,b])=>[a,Math.round(b)])))];
  if(J.screen!=='none'&&J.screen!=='skills'){return ['screen:'+J.screen,S.wave];}
  if(!S.waveActive){
   // fusion simple : deux plantes identiques de même niveau
   for(const a of S.plants){const bb=S.plants.find(q=>q!==a&&q.type===a.type&&q.lvl===a.lvl&&a.lvl<5);if(bb&&S.plants.length>=S.G.slots.length){bb.lvl++;bb.spent+=a.spent;S.plants=S.plants.filter(x=>x!==a);break;}}
   for(let si=0;si<S.G.slots.length;si++){const [x,y]=S.G.slots[si];if(S.plants.some(p=>p.slot===si))continue;const ty=types[k%types.length];const c=J.CONFIG.plants[ty].cost;if(S.petals<c)break;S.petals-=c;S.plants.push({type:ty,lvl:1,slot:si,x,y,cd:0,fireT:0,spent:c});k++;}
   if(S.hero){const sl=S.G.slots;S.hero.tx=S.G.path[S.G.path.length-3][0];S.hero.ty=S.G.path[S.G.path.length-3][1];}
   J.startWave();}
  J.update(1/60);}
 window.__k=k;return null;});if(!r){if(ch===6)await p.screenshot({path:D+'w4_'+w+'_'+i+'.png'});await p.waitForTimeout(700);}}
console.log(w+1,i+1,JSON.stringify(r));}
console.log('ERR',errs);await b.close();})();
