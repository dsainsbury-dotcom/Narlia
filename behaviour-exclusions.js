(()=>{
  const EXCLUDED=new Set(['2026-09-13']);
  const isExcluded=d=>EXCLUDED.has(d?.date);
  const normalDays=()=>Array.isArray(DATA?.days)?DATA.days.filter(d=>!isExcluded(d)):[];
  function bars(root,days,key,suffix){
    if(!root)return;
    const max=Math.max(...days.map(d=>Number(d[key]||0)),0.01);
    root.innerHTML=days.map(d=>{const v=Number(d[key]||0);const w=Math.max(1,Math.round(v/max*100));return `<div class="barrow"><span>${d.label||d.date}</span><div class="bartrack"><div class="barfill" style="width:${w}%"></div></div><b>${key==='distance_km'?v.toFixed(2):Math.round(v)}${suffix}</b></div>`}).join('');
  }
  function rebuildTrends(){
    if(typeof DATA==='undefined')return;
    const days=normalDays();
    bars(document.getElementById('trendBars'),days,'distance_km',' km');
    bars(document.getElementById('rangeBars'),days,'max_range_m',' m');
    const page=document.getElementById('trends');
    const note=page?.querySelector('.section-title .note');
    if(note)note.textContent="How Narlia's activity is changing across normal tracked days. 13 Sep 2026 is retained as a tracker test day but excluded from behavioural trends.";
    const summary=document.getElementById('trendSummary');
    if(summary&&days.length){
      const avg=days.reduce((s,d)=>s+Number(d.distance_km||0),0)/days.length;
      const avgRange=days.reduce((s,d)=>s+Number(d.max_range_m||d.max_core_m||0),0)/days.length;
      const best=days.reduce((a,b)=>Number(b.distance_km||0)>Number(a.distance_km||0)?b:a,days[0]);
      summary.innerHTML=`<div class="card"><div class="kicker">NORMAL DAYS</div><div class="value">${days.length}</div><div class="note">13 Sep test day excluded</div></div><div class="card"><div class="kicker">AVG DAILY DISTANCE</div><div class="value">${avg.toFixed(2)} km</div><div class="note">Normal tracked days only</div></div><div class="card"><div class="kicker">AVG RANGE</div><div class="value">${Math.round(avgRange)} m</div><div class="note">Normal tracked days only</div></div><div class="card"><div class="kicker">BUSIEST NORMAL DAY</div><div class="value">${Number(best.distance_km||0).toFixed(2)} km</div><div class="note">${best.label||best.date}</div></div>`;
    }
    DATA.behaviour_exclusions=[...EXCLUDED];
    DATA.behaviour_days=days;
  }
  function patchRecordDisplay(){
    if(typeof DATA==='undefined')return;
    const days=normalDays();if(!days.length)return;
    const bestDist=days.reduce((a,b)=>Number(b.distance_km||0)>Number(a.distance_km||0)?b:a,days[0]);
    const bestRange=days.reduce((a,b)=>Number(b.max_range_m||b.max_core_m||0)>Number(a.max_range_m||a.max_core_m||0)?b:a,days[0]);
    DATA.behaviour_records={most_distance:bestDist,furthest_day:bestRange};
    const records=document.getElementById('records');
    if(records&&!records.querySelector('[data-test-day-note]')){
      const title=records.querySelector('.section-title');
      if(title){const n=document.createElement('div');n.dataset.testDayNote='1';n.className='note';n.style.margin='0 0 12px';n.textContent='Behavioural records ignore 13 Sep 2026 because Wi-Fi Zone power saving was deliberately disabled for tracker testing.';title.after(n)}
    }
  }
  function run(){rebuildTrends();patchRecordDisplay();window.NARLIA_BEHAVIOUR_EXCLUSIONS_BUILD='20260911-testday-1'}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(run,0));else setTimeout(run,0);
  setTimeout(run,300);setTimeout(run,1000);
})();
