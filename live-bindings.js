(()=>{
  function findCardByKicker(root,label){
    return [...root.querySelectorAll('.card')].find(c=>c.querySelector('.kicker')?.textContent.trim()===label);
  }
  function teleCard(title){
    return [...document.querySelectorAll('#infographic .tele-card')].find(c=>c.querySelector('.tele-title')?.textContent.trim()===title);
  }
  function stars(n){n=Math.max(1,Math.min(5,Number(n)||1));return '★'.repeat(n)+'☆'.repeat(5-n);}
  function updateNarrative(){
    if(typeof DATA==='undefined')return;
    const week=DATA.infographic_week||{};
    const wd=Array.isArray(week.days)?week.days:[];
    const latest=week.latest_day||DATA.days?.[DATA.days.length-1];
    const bestDistance=week.best_distance||(wd.length?wd.reduce((a,b)=>Number(b.distance_km||0)>Number(a.distance_km||0)?b:a,wd[0]):null);
    const bestRange=week.best_range||(wd.length?wd.reduce((a,b)=>Number(b.max_range_m||b.max_core_m||0)>Number(a.max_range_m||a.max_core_m||0)?b:a,wd[0]):null);

    const insights=teleCard('INSIGHTS');
    if(insights){
      const list=insights.querySelector('.insight-list');
      if(list){
        const avg=Number(week.avg_daily_km ?? (Number(week.total_km||0)/7));
        list.innerHTML=[
          `Latest 7-day period: ${week.start||DATA.start} to ${week.end||DATA.end}.`,
          bestDistance?`Busiest day this week: ${bestDistance.label} at ${Number(bestDistance.distance_km||0).toFixed(2)} km.`:'No movement record is available yet for this week.',
          bestRange?`Furthest-ranging day this week: ${bestRange.label} at ${Number(bestRange.max_range_m||bestRange.max_core_m||0)} m.`:'No range record is available yet for this week.',
          `Average movement across the 7-day window: ${avg.toFixed(2)} km/day.`
        ].map(x=>`<div class="insight-item">• ${x}</div>`).join('');
      }
    }

    const current=teleCard('CURRENT STORY');
    if(current&&latest){
      const big=current.querySelector('.story-big');if(big)big.textContent=latest.label||latest.date;
      current.querySelectorAll('.tele-row').forEach(r=>{
        const k=r.querySelector('span')?.textContent.trim(),b=r.querySelector('b');if(!b)return;
        if(k==='Distance')b.textContent=`${Number(latest.distance_km||0).toFixed(2)} km`;
        if(k==='Max range')b.textContent=`${Number(latest.max_range_m||latest.max_core_m||0)} m`;
        if(k==='Adventure')b.textContent=stars(latest.adventure);
      });
    }

    const last30=document.getElementById('last30');
    if(last30){
      const title=[...last30.querySelectorAll('.section-title h2')].find(h=>h.textContent.trim()==='Last 30 Days');
      const note=title?.parentElement?.querySelector('.note');
      if(note)note.textContent=`This merged history contains ${DATA.tracked_days||DATA.days?.length||0} tracked days through ${DATA.end}.`;
      const standoutTitle=[...last30.querySelectorAll('.section-title h2')].find(h=>h.textContent.trim()==='Standout exploration days');
      const standoutNote=standoutTitle?.parentElement?.querySelector('.note');
      if(standoutNote)standoutNote.textContent='Automatically refreshed from the current lifetime distance and range leaders.';
    }

    if(Array.isArray(DATA.days)&&DATA.days.length){
      const dist=DATA.most_distance||DATA.days.reduce((a,b)=>Number(b.distance_km||0)>Number(a.distance_km||0)?b:a,DATA.days[0]);
      const range=DATA.furthest_day||DATA.days.reduce((a,b)=>Number(b.max_range_m||b.max_core_m||0)>Number(a.max_range_m||a.max_core_m||0)?b:a,DATA.days[0]);
      DATA.standout_dates=[...new Set([dist?.date,range?.date].filter(Boolean))];
    }
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
    updateNarrative();
    window.NARLIA_BINDINGS_BUILD='20260829-bind2';
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(patch,0)); else setTimeout(patch,0);
  setTimeout(patch,150);
  setTimeout(patch,500);
  setTimeout(patch,1200);
})();
