(()=>{
if(typeof DATA==='undefined'||!window.pako)return;
const B='20260830-gpx11-1';
const s='H4sIAPN5lGoC/5XQQQ6DMAxE0buwTpA9thPH5+iqiPtfo6kKKohKDfun0beXxXiGc1NNmWeqzU3TBELJfYQ7R04r1LPoOXvmLJ51bwKoUUYT8PWmjWIciyChD8YVvboHfJskwNzsmc3znWw0p7TWtjguxpbWKRjppdGwmxaKbXKFma7E7f2Fj9R8XnUexmZkkn3w/K27cH3VjT+Qf2NC0HOD96W1XLu+9m9meuVfydp/jTlwmNl/m1O4lcK2yv1SrX6p/p2Ng1a9v3m7y3t0ikTHzRK0uTdNHyoSKpeAmOl2EJAe6Ke1ftRGHBhg98iwPNiYzBq2TpwwSZm2xuCpjl+r3J/cSO4BQAA';
const bin=Uint8Array.from(atob(s),c=>c.charCodeAt(0));
const rows=JSON.parse(new TextDecoder().decode(pako.ungzip(bin)));
const incoming=rows.map(r=>({lat:r[0],lon:r[1],t:r[2]})).sort((a,b)=>a.t.localeCompare(b.t));
const before=new Map((DATA.full_timestamped_points||[]).map(p=>[p.t,p]));
let overlap=0;incoming.forEach(p=>{if(before.has(p.t))overlap++;else before.set(p.t,p)});
DATA.full_timestamped_points=[...before.values()].sort((a,b)=>a.t.localeCompare(b.t));
const H=DATA.home||[51.281944,-1.079859],rad=x=>x*Math.PI/180;
const dist=(a,b)=>{const R=6371000,p1=rad(a[0]),p2=rad(b[0]),dp=rad(b[0]-a[0]),dl=rad(b[1]-a[1]),q=Math.sin(dp/2)**2+Math.cos(p1)*Math.cos(p2)*Math.sin(dl/2)**2;return 2*R*Math.asin(Math.sqrt(q))};
const fmtDate=d=>new Date(d+'T12:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
const fmtLabel=d=>new Date(d+'T12:00:00').toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'});
const z=s=>new Date(s).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',hour12:false});
const mkDay=(date,rs)=>{rs=[...rs].sort((a,b)=>a.t.localeCompare(b.t));let km=0,segs=[],seg=[];for(let i=0;i<rs.length;i++){const p=rs[i],gap=i?new Date(p.t)-new Date(rs[i-1].t):0;if(i===0||gap<=1800000){seg.push([p.lat,p.lon]);if(i&&gap<=1800000)km+=dist([rs[i-1].lat,rs[i-1].lon],[p.lat,p.lon])}else{if(seg.length>1)segs.push(seg);seg=[[p.lat,p.lon]]}}if(seg.length>1)segs.push(seg);const mr=Math.round(Math.max(...rs.map(p=>dist(H,[p.lat,p.lon]))));return{date,label:fmtLabel(date),distance_km:+(km/1000).toFixed(2),max_core_m:mr,max_range_m:mr,start:z(rs[0].t),end:z(rs[rs.length-1].t),start_time:z(rs[0].t),end_time:z(rs[rs.length-1].t),fixes:rs.length,points:rs.map(p=>[p.lat,p.lon]),segments:segs,adventure:(km/1000>=.4||mr>=60)?3:(km/1000>=.1||mr>=30)?2:1}};
const affected=[...new Set(incoming.map(p=>p.t.slice(0,10)))];
const grouped={};DATA.full_timestamped_points.forEach(p=>{const d=p.t.slice(0,10);if(affected.includes(d))(grouped[d]??=[]).push(p)});
const nd=Object.entries(grouped).map(([d,r])=>mkDay(d,r));const dates=new Set(nd.map(d=>d.date));
DATA.days=(DATA.days||[]).filter(d=>!dates.has(d.date)).concat(nd).sort((a,b)=>a.date.localeCompare(b.date));
DATA.start=DATA.start||fmtDate(DATA.days[0]?.date||affected[0]);
const latestDate=DATA.full_timestamped_points[DATA.full_timestamped_points.length-1]?.t?.slice(0,10)||affected[affected.length-1];
DATA.end=fmtDate(latestDate);
DATA.total_km=+DATA.days.reduce((s,d)=>s+Number(d.distance_km||0),0).toFixed(2);
DATA.furthest_m=Math.max(...DATA.days.map(d=>Number(d.max_range_m||d.max_core_m||0)),0);
DATA.points_count=DATA.points=DATA.full_timestamped_points.length;DATA.tracked_days=DATA.days.length;
DATA.latest_upload={file:'export (11).gpx',points_in_file:incoming.length,overlap_timestamps:overlap,new_timestamps_added:incoming.length-overlap,clean_new_fixes:incoming.length-overlap,impossible_removed:0,jitter_smoothed:0,latest_timestamp:incoming[incoming.length-1]?.t||null};
DATA.all_points=DATA.full_timestamped_points.map(p=>[p.lat,p.lon]);let all=[],sg=[],pr=null;DATA.full_timestamped_points.forEach(p=>{const t=new Date(p.t);if(pr&&t-pr<=1800000)sg.push([p.lat,p.lon]);else{if(sg.length>1)all.push(sg);sg=[[p.lat,p.lon]]}pr=t});if(sg.length>1)all.push(sg);DATA.all_segments=all;
const endDt=new Date(latestDate+'T12:00:00'),weekDates=[];for(let i=6;i>=0;i--){const d=new Date(endDt);d.setDate(d.getDate()-i);weekDates.push(d.toISOString().slice(0,10))}
const db=Object.fromEntries(DATA.days.map(d=>[d.date,d])),wd=weekDates.map(x=>db[x]).filter(Boolean);const wkTotal=+wd.reduce((s,d)=>s+Number(d.distance_km||0),0).toFixed(2),wkMax=Math.max(...wd.map(d=>Number(d.max_range_m||d.max_core_m||0)),0),wkFix=wd.reduce((s,d)=>s+Number(d.fixes||0),0);const bestDistance=wd.length?wd.reduce((a,b)=>Number(b.distance_km||0)>Number(a.distance_km||0)?b:a,wd[0]):null,bestRange=wd.length?wd.reduce((a,b)=>Number(b.max_range_m||b.max_core_m||0)>Number(a.max_range_m||a.max_core_m||0)?b:a,wd[0]):null;
DATA.infographic_week={start:fmtDate(weekDates[0]),end:fmtDate(weekDates[6]),days:wd,all_points:wd.flatMap(d=>d.points||[]),tracked_days:wd.length,total_km:wkTotal,max_range_m:wkMax,fixes:wkFix,avg_daily_km:+(wkTotal/7).toFixed(2),best_distance:bestDistance,best_range:bestRange,latest_day:db[latestDate]||wd[wd.length-1]};
if(DATA.days.length){DATA.most_distance=DATA.days.reduce((a,b)=>Number(b.distance_km||0)>Number(a.distance_km||0)?b:a,DATA.days[0]);DATA.furthest_day=DATA.days.reduce((a,b)=>Number(b.max_range_m||b.max_core_m||0)>Number(a.max_range_m||a.max_core_m||0)?b:a,DATA.days[0])}
const r=document.getElementById('infographic');if(r){const c=r.querySelector('.tele-left .tele-card');if(c)c.innerHTML=`<div class="tele-title">LAST 7 DAYS</div><div class="tele-row"><span>Tracked days</span><b>${wd.length}</b></div><div class="tele-row"><span>Total distance</span><b>${wkTotal.toFixed(2)} km</b></div><div class="tele-row"><span>Max distance from home</span><b>${wkMax} m</b></div><div class="tele-row"><span>Avg. daily distance</span><b>${(wkTotal/7).toFixed(2)} km</b></div><div class="tele-row"><span>Clean GPS fixes</span><b>${wkFix}</b></div>`;const p=r.querySelector('.date-pill');if(p)p.textContent=`${DATA.infographic_week.start} → ${DATA.infographic_week.end}`;const m=r.querySelector('.tele-map-head b');if(m)m.textContent=`LAST 7 DAYS MAP (${DATA.infographic_week.start.toUpperCase()} – ${DATA.infographic_week.end.toUpperCase()})`}
try{renderDays()}catch(e){}try{renderRecords()}catch(e){}try{renderTrends()}catch(e){}try{renderInfoBars()}catch(e){}try{updateDayControls()}catch(e){}try{if(maps.infographic){maps.infographic.remove();maps.infographic=null;setTimeout(()=>initInfographic(),0)}}catch(e){}
window.NARLIA_GPX_BUILD=B;
})();