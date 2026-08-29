(()=>{
  const BUILD='20260829-dailytabs-overlap-profilefix-1';
  function ready(){return typeof DATA!=='undefined'&&document.getElementById('infographic')}
  function fmtDate(s){return s||''}
  function latestDays(){return [...(DATA.days||[])].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,3)}
  function selectedDay(mode){if(!String(mode).startsWith('day:'))return null;const d=String(mode).slice(4);return (DATA.days||[]).find(x=>x.date===d)||null}
  function getSummaryCard(){return [...document.querySelectorAll('#infographic .tele-card')].find(c=>c.querySelector('.tele-title')?.textContent.trim()==='LAST 7 DAYS'||c.dataset.infographicSummary==='1')}
  function setSummary(mode){
    const card=getSummaryCard();if(!card)return;card.dataset.infographicSummary='1';
    const day=selectedDay(mode),week=DATA.infographic_week,lifetime=mode==='all';
    const title=card.querySelector('.tele-title');if(title)title.textContent=day?String(day.label||day.date).toUpperCase():lifetime?'ALL TIME':'LAST 7 DAYS';
    const vals=day?{
      'Tracked days':'1','Total distance':`${Number(day.distance_km||0).toFixed(2)} km`,'Max distance from home':`${Number(day.max_range_m||day.max_core_m||0)} m`,'Avg. daily distance':`${Number(day.distance_km||0).toFixed(2)} km`,'Clean GPS fixes':String(day.fixes||0),'GPS noise removed':String(DATA.noise_removed||0),'History started':fmtDate(day.label||day.date),'Latest data':fmtDate(day.label||day.date)
    }:lifetime?{
      'Tracked days':String(DATA.tracked_days),'Total distance':`${Number(DATA.total_km).toFixed(2)} km`,'Max distance from home':`${DATA.furthest_m} m`,'Avg. daily distance':`${(Number(DATA.total_km)/Math.max(1,DATA.tracked_days)).toFixed(2)} km`,'Clean GPS fixes':String(DATA.points_count||DATA.points||0),'GPS noise removed':String(DATA.noise_removed||0),'History started':fmtDate(DATA.start),'Latest data':fmtDate(DATA.end)
    }:{
      'Tracked days':String(week.tracked_days),'Total distance':`${Number(week.total_km).toFixed(2)} km`,'Max distance from home':`${week.max_range_m} m`,'Avg. daily distance':`${Number(week.avg_daily_km).toFixed(2)} km`,'Clean GPS fixes':String(week.fixes),'GPS noise removed':String(DATA.noise_removed||0),'History started':fmtDate(week.start),'Latest data':fmtDate(week.end)
    };
    card.querySelectorAll('.tele-row').forEach(r=>{const k=r.querySelector('span')?.textContent.trim(),b=r.querySelector('b');if(k&&b&&Object.prototype.hasOwnProperty.call(vals,k))b.textContent=vals[k]});
  }
  function setDateAndMapTitle(mode){
    const day=selectedDay(mode),lifetime=mode==='all';const pill=document.querySelector('#infographic .date-pill'),mapTitle=document.querySelector('#infographic .tele-map-head b');
    if(day){if(pill)pill.textContent=day.label||day.date;if(mapTitle)mapTitle.textContent=`DAY MAP (${String(day.label||day.date).toUpperCase()})`;return}
    if(pill)pill.textContent=lifetime?`${DATA.start} → ${DATA.end}`:`${DATA.infographic_week.start} → ${DATA.infographic_week.end}`;
    if(mapTitle)mapTitle.textContent=lifetime?`ALL TIME MAP (${String(DATA.start).toUpperCase()} – ${String(DATA.end).toUpperCase()})`:`LAST 7 DAYS MAP (${String(DATA.infographic_week.start).toUpperCase()} – ${String(DATA.infographic_week.end).toUpperCase()})`;
  }
  function setBars(mode){
    const box=document.getElementById('infoDailyBars');if(!box)return;const day=selectedDay(mode);const days=day?[day]:mode==='all'?DATA.days:DATA.infographic_week.days;const max=Math.max(...days.map(d=>Number(d.distance_km)||0),1);
    box.innerHTML=days.map(d=>`<div class="info-bar-wrap"><div class="info-bar-value">${Number(d.distance_km||0).toFixed(2)}</div><div class="info-bar" style="height:${Math.max(4,(Number(d.distance_km)||0)/max*88)}px"></div><div class="info-bar-label">${String(d.label||d.date).replace(/^\w+\s+/,'').replace(/\s+Aug.*/,'')}</div></div>`).join('');
  }
  function setStory(mode){
    const day=selectedDay(mode);if(!day)return;const right=document.querySelector('#infographic .tele-right');if(!right)return;const card=[...right.querySelectorAll('.tele-card')].find(c=>c.querySelector('.tele-title')?.textContent.trim()==='CURRENT STORY');if(!card)return;
    const big=card.querySelector('.story-big');if(big)big.textContent=day.label||day.date;
    card.querySelectorAll('.tele-row').forEach(r=>{const k=r.querySelector('span')?.textContent.trim(),b=r.querySelector('b');if(!b)return;if(k==='Distance')b.textContent=`${Number(day.distance_km||0).toFixed(2)} km`;if(k==='Max range')b.textContent=`${Number(day.max_range_m||day.max_core_m||0)} m`});
  }
  function rebuildMap(mode){
    if(typeof L==='undefined')return;const el=document.getElementById('infographicMap');if(!el)return;try{if(maps.infographic){maps.infographic.remove();maps.infographic=null}}catch(e){}
    if(mode==='recent'){try{initInfographic()}catch(e){console.warn('Recent infographic map failed',e)}return}
    const day=selectedDay(mode),points=day?(day.points||[]):DATA.all_points||[],segments=day?(day.segments||[]):DATA.all_segments||[],daysForHeat=day?[day]:DATA.days;
    try{const m=L.map(el,{preferCanvas:true,zoomControl:true,attributionControl:true}).setView(DATA.home,18);maps.infographic=m;try{satellite().addTo(m)}catch(e){}try{labels().addTo(m)}catch(e){}try{addSegments(m,segments,2.1)}catch(e){}try{if(L.heatLayer)L.heatLayer(buildRegularUseHeat(points,daysForHeat),{radius:25,blur:18,maxZoom:18,minOpacity:.11,max:1.0}).addTo(m)}catch(e){}try{L.marker(DATA.home).addTo(m).bindPopup('Home/core reference')}catch(e){}requestAnimationFrame(()=>{try{m.invalidateSize(true);fit(m,points)}catch(e){}});setTimeout(()=>{try{m.invalidateSize(true);fit(m,points)}catch(e){}},150)}catch(e){console.warn('Infographic map failed',e)}
  }
  function modeSubtitle(mode){const day=selectedDay(mode);return day?`Single day • ${day.label||day.date}`:mode==='all'?'Lifetime Statistics':'Recent • Last 7 Days'}
  function apply(mode){
    if(String(mode).startsWith('day:')&&!selectedDay(mode))mode='recent';setSummary(mode);setDateAndMapTitle(mode);setBars(mode);setStory(mode);rebuildMap(mode);
    document.querySelectorAll('.infographic-mode').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));const sub=document.getElementById('infographicModeSubtitle');if(sub)sub.textContent=modeSubtitle(mode);try{localStorage.setItem('narliaInfographicMode',mode)}catch(e){}
    setTimeout(()=>window.dispatchEvent(new Event('resize')),20);
  }
  function install(){
    if(!ready()||document.getElementById('infographicModeSwitch'))return;const section=document.getElementById('infographic'),telemetry=section.querySelector('.telemetry');if(!telemetry)return;
    const buttons=latestDays().map(d=>`<button class="infographic-mode" data-mode="day:${d.date}">${String(d.label||d.date).replace(/^\w+\s+/,'')}</button>`).join('')+`<button class="infographic-mode active" data-mode="recent">Recent (7 Days)</button><button class="infographic-mode" data-mode="all">All Time</button>`;
    const bar=document.createElement('div');bar.id='infographicModeSwitch';bar.innerHTML=`<style>.infographic-switch{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin:0 0 14px;padding:10px 12px;background:#0c1927;border:1px solid #253649;border-radius:10px}.infographic-switch-buttons{display:flex;gap:7px;flex-wrap:wrap}.infographic-mode{border:1px solid #26394a;background:#0d1a27;color:#cbd6de;border-radius:7px;padding:9px 13px;font-weight:700;cursor:pointer}.infographic-mode.active{background:#15314a;border-color:#2d7db9;color:#fff}.infographic-mode-note{color:#8fa6b7;font-size:12px}</style><div><b>Infographic</b><div id="infographicModeSubtitle" class="infographic-mode-note">Recent • Last 7 Days</div></div><div class="infographic-switch-buttons">${buttons}</div>`;
    section.insertBefore(bar,telemetry);bar.querySelectorAll('.infographic-mode').forEach(b=>b.addEventListener('click',()=>apply(b.dataset.mode)));let mode='recent';try{const saved=localStorage.getItem('narliaInfographicMode');if(saved==='all'||saved==='recent'||String(saved).startsWith('day:'))mode=saved}catch(e){}setTimeout(()=>apply(mode),100);console.info('Narlia infographic controller',BUILD)
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();setTimeout(install,250);
})();
