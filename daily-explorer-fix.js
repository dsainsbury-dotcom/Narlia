(()=>{
  const BUILD='20260830-dailyfix-1';
  const fmtLong=d=>new Date(d+'T12:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
  const fmtShort=d=>new Date(d+'T12:00:00').toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'});
  function root(){
    for(const id of ['daily','explorer','daily-explorer','dailyExplorer']){const el=document.getElementById(id);if(el)return el;}
    const h=[...document.querySelectorAll('h1,h2,h3,.section-title,.nav-title')].find(el=>/daily explorer/i.test(el.textContent||''));
    return h?.closest('section,.page,.view,.tab-pane,[role="tabpanel"],main,div')||document;
  }
  function apply(){
    if(typeof DATA==='undefined'||!Array.isArray(DATA.days)||!DATA.days.length)return;
    const latest=DATA.days[DATA.days.length-1],date=latest.date,long=fmtLong(date),short=fmtShort(date),r=root();
    try{if(typeof renderDays==='function')renderDays();}catch(e){}
    try{if(typeof updateDayControls==='function')updateDayControls();}catch(e){}
    let activated=false;
    for(const sel of r.querySelectorAll('select')){
      const opts=[...sel.options];
      const o=opts.find(x=>x.value===date||x.value===long||x.textContent.trim()===long||x.textContent.trim()===short||x.textContent.includes(long)||x.textContent.includes(short));
      if(o){sel.value=o.value;sel.dispatchEvent(new Event('change',{bubbles:true}));activated=true;}
    }
    if(!activated){
      const controls=[...r.querySelectorAll('button,[data-date],[data-day],[role="button"]')];
      const c=controls.find(el=>el.dataset?.date===date||el.dataset?.day===date||[date,long,short].some(v=>(el.textContent||'').trim()===v));
      if(c){c.click();activated=true;}
    }
    r.querySelectorAll('[data-live-daily-date]').forEach(el=>el.textContent=long);
    window.NARLIA_DAILY_EXPLORER_BUILD=BUILD;
    window.NARLIA_DAILY_EXPLORER_LATEST=date;
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(apply,0),{once:true});else setTimeout(apply,0);
  [150,500,1200,2500].forEach(ms=>setTimeout(apply,ms));
})();
