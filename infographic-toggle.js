(()=>{
  const BUILD='20260829-alltime-layoutfix-1';
  function ready(){ return typeof DATA!=='undefined' && document.getElementById('infographic'); }
  function fmtDate(s){return s||''}
  function getSummaryCard(){
    return [...document.querySelectorAll('#infographic .tele-card')].find(c=>c.querySelector('.tele-title')?.textContent.trim()==='LAST 7 DAYS' || c.dataset.infographicSummary==='1');
  }
  function setSummary(mode){
    const card=getSummaryCard(); if(!card)return;
    card.dataset.infographicSummary='1';
    const week=DATA.infographic_week;
    const lifetime=mode==='all';
    const title=card.querySelector('.tele-title');
    if(title) title.textContent=lifetime?'ALL TIME':'LAST 7 DAYS';
    const vals=lifetime?{
      'Tracked days':String(DATA.tracked_days),
      'Total distance':`${Number(DATA.total_km).toFixed(2)} km`,
      'Max distance from home':`${DATA.furthest_m} m`,
      'Avg. daily distance':`${(Number(DATA.total_km)/Math.max(1,DATA.tracked_days)).toFixed(2)} km`,
      'Clean GPS fixes':String(DATA.points_count||DATA.points||0),
      'GPS noise removed':String(DATA.noise_removed||0),
      'History started':fmtDate(DATA.start),
      'Latest data':fmtDate(DATA.end)
    }:{
      'Tracked days':String(week.tracked_days),
      'Total distance':`${Number(week.total_km).toFixed(2)} km`,
      'Max distance from home':`${week.max_range_m} m`,
      'Avg. daily distance':`${Number(week.avg_daily_km).toFixed(2)} km`,
      'Clean GPS fixes':String(week.fixes),
      'GPS noise removed':String(DATA.noise_removed||0),
      'History started':fmtDate(week.start),
      'Latest data':fmtDate(week.end)
    };
    card.querySelectorAll('.tele-row').forEach(r=>{
      const k=r.querySelector('span')?.textContent.trim(); const b=r.querySelector('b');
      if(k&&b&&Object.prototype.hasOwnProperty.call(vals,k)) b.textContent=vals[k];
    });
  }
  function setDateAndMapTitle(mode){
    const lifetime=mode==='all';
    const pill=document.querySelector('#infographic .date-pill');
    if(pill) pill.textContent=lifetime?`${DATA.start} → ${DATA.end}`:`${DATA.infographic_week.start} → ${DATA.infographic_week.end}`;
    const mapTitle=document.querySelector('#infographic .tele-map-head b');
    if(mapTitle) mapTitle.textContent=lifetime?`ALL TIME MAP (${String(DATA.start).toUpperCase()} – ${String(DATA.end).toUpperCase()})`:`LAST 7 DAYS MAP (${String(DATA.infographic_week.start).toUpperCase()} – ${String(DATA.infographic_week.end).toUpperCase()})`;
  }
  function setBars(mode){
    const box=document.getElementById('infoDailyBars'); if(!box)return;
    const days=mode==='all'?DATA.days:DATA.infographic_week.days;
    const max=Math.max(...days.map(d=>Number(d.distance_km)||0),1);
    box.innerHTML=days.map(d=>`<div class="info-bar-wrap"><div class="info-bar-value">${Number(d.distance_km).toFixed(2)}</div><div class="info-bar" style="height:${Math.max(4,(Number(d.distance_km)||0)/max*88)}px"></div><div class="info-bar-label">${String(d.label||d.date).replace(/^\w+\s+/,'').replace(/\s+Aug.*/,'')}</div></div>`).join('');
  }
  function rebuildMap(mode){
    if(typeof L==='undefined')return;
    const el=document.getElementById('infographicMap'); if(!el)return;
    try{if(maps.infographic){maps.infographic.remove();maps.infographic=null;}}catch(e){}
    if(mode==='recent'){
      try{initInfographic();}catch(e){console.warn('Recent infographic map failed',e)}
      return;
    }
    try{
      const m=L.map(el,{preferCanvas:true,zoomControl:true,attributionControl:true}).setView(DATA.home,18); maps.infographic=m;
      try{satellite().addTo(m);}catch(e){}
      try{labels().addTo(m);}catch(e){}
      try{addSegments(m,DATA.all_segments||[],2.1);}catch(e){}
      try{if(L.heatLayer)L.heatLayer(buildRegularUseHeat(DATA.all_points,DATA.days),{radius:25,blur:18,maxZoom:18,minOpacity:.11,max:1.0}).addTo(m);}catch(e){}
      try{L.marker(DATA.home).addTo(m).bindPopup('Home/core reference');}catch(e){}
      requestAnimationFrame(()=>{try{m.invalidateSize(true);fit(m,DATA.all_points);}catch(e){}});
      setTimeout(()=>{try{m.invalidateSize(true);fit(m,DATA.all_points);}catch(e){}},120);
    }catch(e){console.warn('All-time infographic map failed',e)}
  }
  function apply(mode){
    const lifetime=mode==='all';
    setSummary(mode); setDateAndMapTitle(mode); setBars(mode); rebuildMap(lifetime?'all':'recent');
    document.querySelectorAll('.infographic-mode').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));
    const sub=document.getElementById('infographicModeSubtitle');
    if(sub)sub.textContent=lifetime?'Lifetime Statistics':'Recent • Last 7 Days';
    try{localStorage.setItem('narliaInfographicMode',mode);}catch(e){}
  }
  function install(){
    if(!ready()||document.getElementById('infographicModeSwitch'))return;
    const section=document.getElementById('infographic');
    const telemetry=section.querySelector('.telemetry'); if(!telemetry)return;
    const bar=document.createElement('div'); bar.id='infographicModeSwitch';
    bar.innerHTML=`<style>
      .infographic-switch{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin:0 0 14px;padding:10px 12px;background:#0c1927;border:1px solid #253649;border-radius:10px}
      .infographic-switch-buttons{display:flex;gap:7px}
      .infographic-mode{border:1px solid #26394a;background:#0d1a27;color:#cbd6de;border-radius:7px;padding:9px 13px;font-weight:700;cursor:pointer}
      .infographic-mode.active{background:#15314a;border-color:#2d7db9;color:#fff}
      .infographic-mode-note{color:#8fa6b7;font-size:12px}
      #infographic .telemetry{display:grid!important;grid-template-columns:minmax(230px,300px) minmax(0,1fr) minmax(280px,340px)!important;gap:14px!important;align-items:start!important}
      #infographic .telemetry>*{min-width:0!important;max-width:100%!important;box-sizing:border-box!important}
      #infographic #infographicMap{width:100%!important;max-width:100%!important;min-width:0!important;overflow:hidden!important;box-sizing:border-box!important}
      #infographic #infographicMap .leaflet-pane,#infographic #infographicMap .leaflet-control-container{max-width:100%}
      @media(max-width:1100px){#infographic .telemetry{grid-template-columns:1fr!important}#infographic .telemetry>*{width:100%!important}}
    </style><div><b>Infographic</b><div id="infographicModeSubtitle" class="infographic-mode-note">Recent • Last 7 Days</div></div><div class="infographic-switch-buttons"><button class="infographic-mode active" data-mode="recent">Recent (7 Days)</button><button class="infographic-mode" data-mode="all">All Time</button></div>`;
    section.insertBefore(bar,telemetry);
    bar.querySelectorAll('.infographic-mode').forEach(b=>b.addEventListener('click',()=>apply(b.dataset.mode)));
    let mode='recent'; try{if(localStorage.getItem('narliaInfographicMode')==='all')mode='all';}catch(e){}
    setTimeout(()=>apply(mode),100);
    console.info('Narlia infographic controller',BUILD);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
  setTimeout(install,250);
})();
