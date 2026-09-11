(()=>{
  // 13 Aug 2026 was a deliberate collar test with Wi-Fi Zone power saving disabled.
  // Keep the raw day and Daily Explorer entry, but exclude it from normal behaviour statistics.
  const EXCLUDED=new Set(['2026-08-13']);
  const isExcluded=d=>EXCLUDED.has(d?.date);
  const normalDays=()=>Array.isArray(DATA?.days)?DATA.days.filter(d=>!isExcluded(d)):[];
  const val=(d,k)=>Number(d?.[k]||0);
  function bars(root,days,key,suffix){
    if(!root)return;
    const max=Math.max(...days.map(d=>val(d,key)),0.01);
    root.innerHTML=days.map(d=>{const v=val(d,key);const w=Math.max(1,Math.round(v/max*100));return `<div class="barrow"><div>${(d.label||d.date).replace(/^\w+\s/,'')}</div><div class="bartrack"><div class="barfill" style="width:${w}%"></div></div><div style="text-align:right"><b>${key==='distance_km'?v.toFixed(2):Math.round(v)}${suffix}</b></div></div>`}).join('');
  }
  function rebuildTrends(){
    if(typeof DATA==='undefined')return;
    const days=normalDays(); if(!days.length)return;
    bars(document.getElementById('trendBars'),days,'distance_km',' km');
    bars(document.getElementById('rangeBars'),days,'max_range_m',' m');
    const note=document.querySelector('#trends .section-title .note');
    if(note)note.textContent="How Narlia's activity is changing across normal tracked days. 13 Aug 2026 is retained as a tracker test day but excluded from behavioural trends.";
    const split=Math.ceil(days.length/2),first=days.slice(0,split),recent=days.slice(split);
    const avg=a=>a.length?a.reduce((s,d)=>s+val(d,'distance_km'),0)/a.length:0;
    const firstAvg=avg(first),recentAvg=avg(recent),change=firstAvg?((recentAvg-firstAvg)/firstAvg*100):0;
    const active=days.reduce((a,b)=>val(b,'distance_km')>val(a,'distance_km')?b:a,days[0]);
    const summary=document.getElementById('trendSummary');
    if(summary)summary.innerHTML=`<div class="card"><div class="kicker">RECENT DAILY AVERAGE</div><div class="value">${recentAvg.toFixed(2)} km</div></div><div class="card"><div class="kicker">EARLIER DAILY AVERAGE</div><div class="value">${firstAvg.toFixed(2)} km</div></div><div class="card"><div class="kicker">CHANGE</div><div class="value">${change>=0?'+':''}${change.toFixed(0)}%</div><div class="note">recent half vs earlier half</div></div><div class="card"><div class="kicker">MOST ACTIVE NORMAL DAY</div><div class="value">${active.label}</div><div class="note">${val(active,'distance_km').toFixed(2)} km</div></div>`;
    DATA.behaviour_exclusions=[...EXCLUDED]; DATA.behaviour_days=days;
  }
  function rebuildRecords(){
    if(typeof DATA==='undefined')return;
    const days=normalDays(); if(!days.length)return;
    const bestDist=days.reduce((a,b)=>val(b,'distance_km')>val(a,'distance_km')?b:a,days[0]);
    const bestRange=days.reduce((a,b)=>val(b,'max_range_m')>val(a,'max_range_m')?b:a,days[0]);
    const mostFixes=days.reduce((a,b)=>val(b,'fixes')>val(a,'fixes')?b:a,days[0]);
    const bestAdv=days.reduce((a,b)=>val(b,'adventure')>val(a,'adventure')?b:a,days[0]);
    const total=days.reduce((s,d)=>s+val(d,'distance_km'),0),fixes=days.reduce((s,d)=>s+val(d,'fixes'),0),avg=total/days.length;
    const cards=document.getElementById('recordCards');
    if(cards)cards.innerHTML=[['Total normal movement',total.toFixed(2)+' km'],['Biggest normal movement day',val(bestDist,'distance_km').toFixed(2)+' km'],['Furthest from home',val(bestRange,'max_range_m')+' m'],['Normal tracked days',days.length],['Normal GPS fixes',fixes.toLocaleString()],['Daily average',avg.toFixed(2)+' km']].map(x=>`<div class="card"><div class="kicker">${x[0]}</div><div class="value">${x[1]}</div></div>`).join('');
    const table=document.getElementById('recordTable');
    if(table)table.innerHTML=[['Biggest movement day',bestDist.label,val(bestDist,'distance_km').toFixed(2)+' km'],['Furthest-ranging day',bestRange.label,val(bestRange,'max_range_m')+' m'],['Most GPS fixes in a day',mostFixes.label,val(mostFixes,'fixes').toLocaleString()],['Highest adventure score',bestAdv.label,val(bestAdv,'adventure')+'/5']].map(r=>`<div class="recordline"><span><b>${r[0]}</b><br><span class="note">${r[1]}</span></span><b>${r[2]}</b></div>`).join('');
    const milestones=document.getElementById('milestones');
    if(milestones)milestones.innerHTML=[[total>=5,'First 5 km',total>=5?'Reached':total.toFixed(2)+' / 5 km'],[fixes>=1000,'1,000 normal GPS fixes',fixes>=1000?'Reached':fixes.toLocaleString()+' / 1,000'],[days.length>=10,'10 normal tracked days',days.length>=10?'Reached':days.length+' / 10'],[total>=10,'First 10 km',total>=10?'Reached':total.toFixed(2)+' / 10 km']].map(m=>`<div class="recordline"><span>${m[0]?'✓':'○'} ${m[1]}</span><b>${m[2]}</b></div>`).join('');
    const title=document.querySelector('#records .section-title');
    let n=document.querySelector('#records [data-test-day-note]');
    if(title&&!n){n=document.createElement('div');n.dataset.testDayNote='1';n.className='note';n.style.margin='0 0 12px';title.after(n)}
    if(n)n.textContent='13 Aug 2026 is retained in Daily Explorer but excluded from behavioural records because Wi-Fi Zone power saving was deliberately disabled for tracker testing.';
    DATA.behaviour_records={most_distance:bestDist,furthest_day:bestRange,most_fixes:mostFixes,total_km:total,fixes,tracked_days:days.length};
  }
  function run(){rebuildTrends();rebuildRecords();window.NARLIA_BEHAVIOUR_EXCLUSIONS_BUILD='20260911-testday-2'}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(run,0));else setTimeout(run,0);
  setTimeout(run,300);setTimeout(run,1000);setTimeout(run,2500);
})();
