(()=>{
const X='2026-08-13';
const leafs=r=>[...r.querySelectorAll('*')].filter(e=>e.children.length===0);
function D(){try{return typeof DATA!=='undefined'?DATA:null}catch(e){return null}}
function find(text){const r=document.getElementById('infographic');return r&&leafs(r).find(e=>e.textContent.trim().toUpperCase().includes(text))}
function clickable(el,fn){if(!el)return;let b=el;while(b.parentElement&&b.parentElement.id!=='infographic'&&b.parentElement.children.length===1)b=b.parentElement;b.style.cursor='pointer';b.setAttribute('role','button');b.tabIndex=0;b.onclick=fn;b.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();fn(e)}};return b}
function page(name){try{showPage(name)}catch(e){const btn=[...document.querySelectorAll('button,a')].find(x=>x.textContent.trim().toLowerCase().includes(name));if(btn)btn.click()}}
function explorationDays(){const d=D();return (d?.days||[]).filter(x=>x.date!==X&&Number(x.distance_km||0)>0).sort((a,b)=>Number(b.distance_km||0)-Number(a.distance_km||0))}
function wire(){const root=document.getElementById('infographic');if(!root)return;
 const total=find('TOTAL HISTORY');clickable(total,()=>page('story'));
 const daily=find('DAILY EXPLORER');clickable(daily,()=>page('daily'));
 const analytics=find('ANALYTICS');clickable(analytics,()=>page('trends'));
 const exp=find('EXPLORATION DAYS');if(exp){const days=explorationDays();const host=exp.parentElement||exp;const badge=leafs(host).find(e=>/^\d+$/.test(e.textContent.trim()));if(badge)badge.textContent=String(days.length);clickable(exp,()=>{page('daily');setTimeout(()=>{const b=explorationDays()[0];if(!b)return;const s=document.querySelector('#daily select,#daySelect');if(s){s.value=b.date;s.dispatchEvent(new Event('change',{bubbles:true}))}},100)})}
 window.NARLIA_INFO_CONTROLS_BUILD='20260927-controls-1';}
function boot(){wire();[100,400,1000,2500].forEach(x=>setTimeout(wire,x))}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();