const {chromium}=require('playwright');const D='/tmp/claude-0/-home-user/4cf46959-55ae-5998-a425-c3e0d43f1d86/scratchpad/';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+D+'test.html');await p.waitForTimeout(600);
const tap=async(gx,gy)=>{const r=await p.evaluate(()=>{const c=document.querySelector('canvas').getBoundingClientRect();return [c.left,c.top,c.width/360,c.height/640]});await p.mouse.click(r[0]+gx*r[2],r[1]+gy*r[3]);await p.waitForTimeout(250);};
await p.evaluate(()=>window.__JDS.startLevel(0,0,1));await p.waitForTimeout(400);
let i=0;const snap=async()=>{await p.screenshot({path:D+'tut'+(i++)+'.png'})};
await snap();
for(let n=0;n<2;n++){const sl=await p.evaluate(()=>{const S=window.__JDS.S;/*find target via tutSlot not exposed: use pulse target*/return null});
 // tap target slot: compute same as game by brute force reading the ring - instead call via evaluate of S.tut.cover
 const xy=await p.evaluate(()=>{const S=window.__JDS.S;const c=S.tut.cover;let best=-1;S.G.slots.forEach((_,i)=>{if(!S.plants.some(p=>p.slot===i)&&(best<0||c[i]>c[best]))best=i});return S.G.slots[best]});
 await tap(xy[0],xy[1]);await snap();
 const bb=await p.evaluate(()=>{const b=window.__JDS.menuButtons().find(b=>b.type==='bambou');return [b.x,b.y]});await tap(bb[0],bb[1]);await snap();}
const w=await p.evaluate(()=>window.__JDS.BTN.wave);await tap(w.x+w.w/2,w.y+w.h/2);await p.waitForTimeout(1500);await snap();
await p.evaluate(()=>{const J=window.__JDS;J.S.speed=3});await p.waitForFunction(()=>!window.__JDS.S.waveActive,null,{timeout:90000});await p.waitForTimeout(1200);await snap();
const pl=await p.evaluate(()=>window.__JDS.S.plants.map(p=>[p.x,p.y]));
const r=await p.evaluate(()=>{const c=document.querySelector('canvas').getBoundingClientRect();return [c.left,c.top,c.width/360,c.height/640]});
const P=([x,y])=>[r[0]+x*r[2],r[1]+y*r[3]];
await p.mouse.move(...P(pl[0]));await p.mouse.down();for(let k=1;k<=10;k++){const a=P(pl[0]),bq=P(pl[1]);await p.mouse.move(a[0]+(bq[0]-a[0])*k/10,a[1]+(bq[1]-a[1])*k/10);await p.waitForTimeout(30);}await p.mouse.up();await p.waitForTimeout(500);await snap();
console.log(await p.evaluate(()=>[window.__JDS.S.plants.map(p=>p.lvl),!!window.__JDS.S.tut,window.__JDS.SAVE.seen.tut2,window.__JDS.screen]));
console.log(errs);await b.close();})();
