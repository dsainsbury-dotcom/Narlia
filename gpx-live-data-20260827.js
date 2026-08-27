(()=>{
if(typeof DATA==='undefined'||!window.pako)return;
const B='20260827-gpx8-1';
const s='H4sIAMiGkGoC/5WZUZLkOAhE7z6L7x0FIQkg4eFJZf9rm9j2pL23vfMkB6u5XQ7fU1cNQYwvZ79qPqL07XsQ2f/ct7GXxLeR44nH4pAK19KfUZ7ePvtN+AYVU+03Yn6iP4guDkQ7Sjja4wIXzGaAGGH6r2s+mE3dNRyTPFIeP8kotRegfCjKRL+IJTE6ERH1/YgmlVGQK16s0V0IYQ1JDSJzoiOWdUkDIg4SkUiNjEmYUisWrWgMVC59lVd8vvarlVobYzY6NbGCKnXKrQFI2yjwp0RqHs13IoQoLVrU5mwEK1ft8+Ybt3oNmVJKeo2WYQzhxCn6/KtBSOI0zOGF+Yp4nRbpXLB8zeY0331z40SqLxnViGMQOWxlPtwQhCvr/71MhiAwmNZvVeWFLH6aEmwpIjVR2ZVWVZo9ZjZLx2NEOj1kMhSUQKUhz51sAai2SNb3tnvQXeMbF+wSqHVRzqks0Kh04ck4ZToeP8loTCpTghkD0sZjRIgfPjm/H38IbFKa70xAm/+5zjE+Xn+BcZYpjJjOkQwRoYQBjgCdZtU2wnHVeEkyMqTBPrwJFD46p8OlpSi7uf9F5RA4c/7L1htyR5mef+NyggU7r4Vbig8njrQVfO3AjtrWUNBcdc7CQeiZnVNCAFen0TGkGCEYla5643BiEAid71gBPH6GLm5UQJ7HpmVsuoSs+eZbbUzgvR8jXWhytvmlEtnMYjb01diTIdujrkIcwlxe+qoTAYxe4bAS/YEUHdfrqqCKgS9Pol1AsswRvjlPJw3AQHYWF82LMTqwsa6r0fjoEldj/VJOAHYVK8LaJURvgmBa9Uk2uV0m6tPsFIRp9vKCpfcE4ire+AEmHBi9DYyKSaDGP3xyDyFs/6Z3Hpe10a2wy0hNKstMZ9ONz4T1D5XQzJApcqD8K/LwiTY03cfgy5vO0LpmrQjrLGs8jNBGZ0Qt/oxiXufhmpcbD2XhLTD/JB+jxjkKq+6DpS8TCv/WebOSj4/SRk5GF6epp/EVP7fTvwkOnl1bAmZqxW+U2ydWn+ZoYuwei/GnRP1QczzcYc4h9VtwubY/Xo+RC0ehAUAjWxWVda40tGB0DmxgMi7wF5eKknAvjcH9SJevlEuQjCrx4N5EqqM0A1hTIcEElkqG4RooFwkY3hlhCMhGYPVSkG5lLYnFImM4ZQgytc1SEtl2PIxMgQrlZGWa4ZAI9r87cYkzgDScdn0bxJ4QZW41m3E6s8bzTpLqpKGp4rOYqDV/yKcyUCrnwv0ilEZERsbsqSY09Mhg4UgTq+rts4ALdcmdGmMwIZH7hfKKkWM7qu27kw4cbot33o3RqDTW+romJUzpz9LNYwRqLzkv4WKMgIfszkOuxAArV76Et5bZcTNy8nZp7pron28GpP4/Qereh6idRsAAA==';
const bin=Uint8Array.from(atob(s),c=>c.charCodeAt(0));
const rows=JSON.parse(new TextDecoder().decode(pako.ungzip(bin)));
const incoming=rows.map(r=>({lat:r[0],lon:r[1],t:r[2]}));
const before=new Map((DATA.full_timestamped_points||[]).map(p=>[p.t,p]));
let overlap=0; incoming.forEach(p=>{if(before.has(p.t))overlap++; else before.set(p.t,p)});
DATA.full_timestamped_points=[...before.values()].sort((a,b)=>a.t.localeCompare(b.t));
const H=DATA.home||[51.281944,-1.079859],rad=x=>x*Math.PI/180;
const dist=(a,b)=>{const R=6371000,p1=rad(a[0]),p2=rad(b[0]),dp=rad(b[0]-a[0]),dl=rad(b[1]-a[1]),q=Math.sin(dp/2)**2+Math.cos(p1)*Math.cos(p2)*Math.sin(dl/2)**2;return 2*R*Math.asin(Math.sqrt(q))};
const fmtDate=d=>new Date(d+'T12:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
const fmtLabel=d=>new Date(d+'T12:00:00').toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'});
const z=s=>new Date(s).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',hour12:false});
const mkDay=(date,rs)=>{
 rs=[...rs].sort((a,b)=>a.t.localeCompare(b.t));
 let km=0,segs=[],seg=[];
 for(let i=0;i<rs.length;i++){
  const p=rs[i], gap=i?new Date(p.t)-new Date(rs[i-1].t):0;
  if(i===0||gap<=1800000){seg.push([p.lat,p.lon]);if(i&&gap<=1800000)km+=dist([rs[i-1].lat,rs[i-1].lon],[p.lat,p.lon])}
  else{if(seg.length>1)segs.push(seg);seg=[[p.lat,p.lon]]}
 }
 if(seg.length>1)segs.push(seg);
 const mr=Math.round(Math.max(...rs.map(p=>dist(H,[p.lat,p.lon]))));
 return {date,label:fmtLabel(date),distance_km:+(km/1000).toFixed(2),max_core_m:mr,max_range_m:mr,start:z(rs[0].t),end:z(rs[rs.length-1].t),start_time:z(rs[0].t),end_time:z(rs[rs.length-1].t),fixes:rs.length,points:rs.map(p=>[p.lat,p.lon]),segments:segs,adventure:(km/1000>=.4||mr>=60)?3:(km/1000>=.1||mr>=30)?2:1};
};
const affected=[...new Set(incoming.map(p=>p.t.slice(0,10)))];
const grouped={}; DATA.full_timestamped_points.forEach(p=>{const d=p.t.slice(0,10);if(affected.includes(d))(grouped[d]??=[]).push(p)});
const nd=Object.entries(grouped).map(([d,r])=>mkDay(d,r));
const dates=new Set(nd.map(d=>d.date));
DATA.days=(DATA.days||[]).filter(d=>!dates.has(d.date)).concat(nd).sort((a,b)=>a.date.localeCompare(b.date));
DATA.start=DATA.start||fmtDate(DATA.days[0]?.date||affected[0]);
const latestDate=DATA.days[DATA.days.length-1]?.date||affected[affected.length-1];
DATA.end=fmtDate(latestDate);
DATA.total_km=+DATA.days.reduce((s,d)=>s+Number(d.distance_km||0),0).toFixed(2);
DATA.furthest_m=Math.max(...DATA.days.map(d=>Number(d.max_range_m||d.max_core_m||0)),0);
DATA.points_count=DATA.points=DATA.full_timestamped_points.length;
DATA.tracked_days=DATA.days.length;
DATA.noise_removed=Number(DATA.noise_removed||0);
DATA.latest_upload={file:'export (8).gpx',points_in_file:incoming.length,overlap_timestamps:overlap,new_timestamps_added:incoming.length-overlap,clean_new_fixes:incoming.length-overlap};
DATA.all_points=DATA.full_timestamped_points.map(p=>[p.lat,p.lon]);
let all=[],sg=[],pr=null;DATA.full_timestamped_points.forEach(p=>{const t=new Date(p.t);if(pr&&t-pr<=1800000)sg.push([p.lat,p.lon]);else{if(sg.length>1)all.push(sg);sg=[[p.lat,p.lon]]}pr=t});if(sg.length>1)all.push(sg);DATA.all_segments=all;
const endDt=new Date(latestDate+'T12:00:00'), weekDates=[];
for(let i=6;i>=0;i--){const d=new Date(endDt);d.setDate(d.getDate()-i);weekDates.push(d.toISOString().slice(0,10))}
const db=Object.fromEntries(DATA.days.map(d=>[d.date,d])),wd=weekDates.map(x=>db[x]).filter(Boolean);
const wkTotal=+wd.reduce((s,d)=>s+Number(d.distance_km||0),0).toFixed(2);
const wkMax=Math.max(...wd.map(d=>Number(d.max_range_m||d.max_core_m||0)),0);
const wkFix=wd.reduce((s,d)=>s+Number(d.fixes||0),0);
const bestDistance=wd.length?wd.reduce((a,b)=>Number(b.distance_km||0)>Number(a.distance_km||0)?b:a,wd[0]):null;
const bestRange=wd.length?wd.reduce((a,b)=>Number(b.max_range_m||b.max_core_m||0)>Number(a.max_range_m||a.max_core_m||0)?b:a,wd[0]):null;
DATA.infographic_week={start:fmtDate(weekDates[0]),end:fmtDate(weekDates[6]),days:wd,all_points:wd.flatMap(d=>d.points||[]),tracked_days:wd.length,total_km:wkTotal,max_range_m:wkMax,fixes:wkFix,avg_daily_km:+(wkTotal/7).toFixed(2),best_distance:bestDistance,best_range:bestRange,latest_day:db[latestDate]||wd[wd.length-1]};
if(DATA.days.length){DATA.most_distance=DATA.days.reduce((a,b)=>Number(b.distance_km||0)>Number(a.distance_km||0)?b:a,DATA.days[0]);DATA.furthest_day=DATA.days.reduce((a,b)=>Number(b.max_range_m||b.max_core_m||0)>Number(a.max_range_m||a.max_core_m||0)?b:a,DATA.days[0])}
const r=document.getElementById('infographic');if(r){
 const c=r.querySelector('.tele-left .tele-card');if(c)c.innerHTML=`<div class="tele-title">LAST 7 DAYS</div><div class="tele-row"><span>Tracked days</span><b>${wd.length}</b></div><div class="tele-row"><span>Total distance</span><b>${wkTotal.toFixed(2)} km</b></div><div class="tele-row"><span>Max distance from home</span><b>${wkMax} m</b></div><div class="tele-row"><span>Avg. daily distance</span><b>${(wkTotal/7).toFixed(2)} km</b></div><div class="tele-row"><span>Clean GPS fixes</span><b>${wkFix}</b></div>`;
 const p=r.querySelector('.date-pill');if(p)p.textContent=`${DATA.infographic_week.start} → ${DATA.infographic_week.end}`;
 const m=r.querySelector('.tele-map-head b');if(m)m.textContent=`LAST 7 DAYS MAP (${DATA.infographic_week.start.toUpperCase()} – ${DATA.infographic_week.end.toUpperCase()})`;
}
try{renderDays()}catch(e){}try{renderRecords()}catch(e){}try{renderTrends()}catch(e){}try{renderInfoBars()}catch(e){}try{updateDayControls()}catch(e){}
try{if(maps.infographic){maps.infographic.remove();maps.infographic=null;setTimeout(()=>initInfographic(),0)}}catch(e){}
window.NARLIA_GPX_BUILD=B;
})();