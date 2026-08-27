(()=>{
  function findCardByKicker(root,label){
    return [...root.querySelectorAll('.card')].find(c=>c.querySelector('.kicker')?.textContent.trim()===label);
  }
  function patch(){
    if(typeof DATA==='undefined') return;
    const story=document.getElementById('story');
    if(story){
      const period=findCardByKicker(story,'Tracked period');
      if(period){const v=period.querySelector('.value');if(v)v.innerHTML=`${DATA.start}<br>to ${DATA.end}`;}
      const days=findCardByKicker(story,'Tracked days');
      if(days){const v=days.querySelector('.value');if(v)v.textContent=String(DATA.tracked_days||0);const n=days.querySelector('.note');if(n)n.textContent=`${DATA.points_count||DATA.points||0} clean GPS fixes`;}
      const movement=findCardByKicker(story,'Recorded movement');
      if(movement){const v=movement.querySelector('.value');if(v)v.textContent=`${Number(DATA.total_km||0).toFixed(2)} km`;}
      const range=findCardByKicker(story,'Max range');
      if(range){const v=range.querySelector('.value');if(v)v.textContent=`${Number(DATA.furthest_m||0)} m`;}
      const pill=story.querySelector('.maphead .pill');
      if(pill)pill.textContent=`${DATA.start} → ${DATA.end}`;
    }
    document.querySelectorAll('.tele-row').forEach(row=>{
      const s=row.querySelector('span'); const b=row.querySelector('b');
      if(!s||!b)return;
      const label=s.textContent.trim();
      if(label==='Latest data') b.textContent=DATA.end;
      if(label==='History started' && row.closest('#infographic') && DATA.infographic_week) b.textContent=DATA.infographic_week.start;
    });
    document.querySelectorAll('[data-live-end]').forEach(el=>el.textContent=DATA.end);
    window.NARLIA_BINDINGS_BUILD='20260827-bind1';
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(patch,0)); else setTimeout(patch,0);
  setTimeout(patch,150);
  setTimeout(patch,500);
})();
