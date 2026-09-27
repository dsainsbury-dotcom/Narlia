(()=>{
  const EXCLUDED=new Set(['2026-08-13']);
  const eligible=d=>d&&!EXCLUDED.has(d.date);
  const num=(d,k)=>Number(d?.[k]||0);
  function bestNormal(){const ds=(window.DATA?.days||[]).filter(eligible);return ds.length?ds.reduce((a,b)=>num(b,'distance_km')>num(a,'distance_km')?b:a,ds[0]):null;}
  function fix(){
    if(!window.DATA)return;
    const best=bestNormal();if(!best)return;
    DATA.behaviour_exclusions=[...EXCLUDED];
    if(DATA.most_distance?.date&&EXCLUDED.has(DATA.most_distance.date))DATA.most_distance=best;
    DATA.standout_dates=(DATA.standout_dates||[]).filter(d=>!EXCLUDED.has(d));
    if(!DATA.standout_dates.includes(best.date))DATA.standout_dates.unshift(best.date);
    const cards=[...document.querySelectorAll('#infographic .tele-card, #infographic .card')];
    cards.forEach(card=>{
      const title=card.querySelector('.tele-title,.kicker')?.textContent.trim().toUpperCase();
      if(title!=='STANDOUT DAY')return;
      const big=card.querySelector('.story-big,.value,h2,h3');if(big)big.textContent=best.label||best.date;
      card.querySelectorAll('.tele-row,.recordline').forEach(r=>{
        const label=r.querySelector('span')?.textContent.trim().toLowerCase();const val=r.querySelector('b');if(!val)return;
        if(label==='distance')val.textContent=`${num(best,'distance_km').toFixed(2)} km`;
        if(label==='max from home'||label==='max range')val.textContent=`${num(best,'max_range_m')||num(best,'max_core_m')} m`;
      });
      card.dataset.standoutDate=best.date;
      const btn=card.querySelector('button,a');if(btn){btn.onclick=e=>{e.preventDefault();try{showPage('daily')}catch(_){}setTimeout(()=>{const sel=document.querySelector('#daily select, #daySelect');if(sel){sel.value=best.date;sel.dispatchEvent(new Event('change',{bubbles:true}))}},50);};}
    });
    window.NARLIA_STANDOUT_GUARD_BUILD='20260927-1';
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fix);else fix();
  [50,150,400,900,1800,3500].forEach(ms=>setTimeout(fix,ms));
  new MutationObserver(()=>setTimeout(fix,0)).observe(document.documentElement,{childList:true,subtree:true});
})();