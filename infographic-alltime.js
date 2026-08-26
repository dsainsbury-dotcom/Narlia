(()=>{
  const recent=document.getElementById('infographic');
  if(!recent || typeof DATA==='undefined' || typeof L==='undefined') return;

  // Keep the existing 7-day infographic intact. Add a simple 7 Days / All Time switch above it.
  const switcher=document.createElement('div');
  switcher.id='infographicRangeSwitch';
  switcher.style.cssText='display:flex;gap:8px;margin:0 0 14px 0;flex-wrap:wrap';
  switcher.innerHTML='<button id="range7" class="tab active" type="button">7 Days</button><button id="rangeAll" class="tab" type="button">All Time</button>';
  recent.insertBefore(switcher,recent.firstChild);

  const all=recent.cloneNode(true);
  all.id='infographicAllTime';
  all.classList.remove('active');
  all.style.display='none';
  const clonedSwitcher=all.querySelector('#infographicRangeSwitch');
  if(clonedSwitcher) clonedSwitcher.remove();

  // Make every id in the cloned infographic unique.
  all.querySelectorAll('[id]').forEach(el=>{ el.id='all_'+el.id; });
  recent.parentNode.insertBefore(all,recent.nextSibling);

  const days=Array.isArray(DATA.days)?DATA.days:[];
  const tracked=days.length || Number(DATA.tracked_days||0);
  const total=Number(DATA.total_km||0);
  const maxRange=Number(DATA.furthest_m||0);
  const avg=tracked?total/tracked:0;
  const points=Number(DATA.points_count||DATA.points||0);
  const noise=Number(DATA.noise_removed||0);
  const biggest=days.length?days.reduce((a,b)=>Number(b.distance_km||0)>Number(a.distance_km||0)?b:a,days[0]):null;
  const furthest=days.length?days.reduce((a,b)=>Number(b.max_core_m||b.max_range_m||0)>Number(a.max_core_m||a.max_range_m||0)?b:a,days[0]):null;
  const latest=days.length?days[days.length-1]:null;
  const fmtDate=s=>{try{return new Date(s+'T12:00:00').toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'});}catch(e){return s||'—';}};

  // Left summary card.
  const leftCard=all.querySelector('.tele-left .tele-card');
  if(leftCard){
    leftCard.innerHTML=`<div class="tele-title">ALL TIME</div>
      <div class="tele-row"><span>Tracked days</span><b>${tracked}</b></div>
      <div class="tele-row"><span>Total distance</span><b>${total.toFixed(2)} km</b></div>
      <div class="tele-row"><span>Max distance from home</span><b>${maxRange} m</b></div>
      <div class="tele-row"><span>Avg. daily distance</span><b>${avg.toFixed(2)} km</b></div>
      <div class="tele-row"><span>Clean GPS fixes</span><b>${points}</b></div>
      <div class="tele-row"><span>GPS noise removed</span><b>${noise}</b></div>
      <div class="tele-divider"></div>
      <div class="tele-row"><span>History started</span><b>${DATA.start||'—'}</b></div>
      <div class="tele-row"><span>Latest data</span><b>${DATA.end||'—'}</b></div>`;
  }

  const datePill=all.querySelector('.date-pill');
  if(datePill) datePill.textContent=`${DATA.start||''} → ${DATA.end||''}`;
  const mapTitle=all.querySelector('.tele-map-head b');
  if(mapTitle) mapTitle.textContent=`ALL TIME MAP (${String(DATA.start||'').toUpperCase()} – ${String(DATA.end||'').toUpperCase()})`;

  // Daily distance bars across the full history.
  const bars=all.querySelector('#all_infoDailyBars');
  if(bars && days.length){
    const peak=Math.max(...days.map(d=>Number(d.distance_km||0)),0.01);
    bars.innerHTML=days.map(d=>{
      const v=Number(d.distance_km||0);
      const h=Math.max(2,Math.round((v/peak)*100));
      return `<div class="info-bar-wrap"><div class="info-bar-value">${v.toFixed(2)}</div><div class="info-bar" style="height:${h}%"></div><div class="info-bar-label">${fmtDate(d.date).replace(/ .*$/,'')}</div></div>`;
    }).join('');
  }

  // Lifetime records panel.
  const recordCard=[...all.querySelectorAll('.tele-card')].find(x=>x.querySelector('.tele-title')?.textContent.includes('LIFETIME RECORDS'));
  if(recordCard){
    recordCard.innerHTML=`<div class="tele-title">LIFETIME RECORDS</div>
      <div class="tele-row"><span>Biggest movement</span><b>${biggest?Number(biggest.distance_km||0).toFixed(2):'0.00'} km</b></div>
      <div class="tele-row"><span>Furthest-ranging day</span><b>${furthest?Number(furthest.max_core_m||furthest.max_range_m||0):0} m</b></div>
      <div class="tele-row"><span>Top distance date</span><b>${biggest?fmtDate(biggest.date):'—'}</b></div>
      <div class="tele-row"><span>Top range date</span><b>${furthest?fmtDate(furthest.date):'—'}</b></div>`;
  }

  // Right-side story and insights become lifetime-focused.
  const story=all.querySelector('.tele-right .tele-card');
  if(story && latest){
    story.innerHTML=`<div class="tele-title">LATEST RECORDED DAY</div><div class="story-big">${fmtDate(latest.date)}</div>
      <div class="tele-row"><span>Distance</span><b>${Number(latest.distance_km||0).toFixed(2)} km</b></div>
      <div class="tele-row"><span>Max range</span><b>${Number(latest.max_core_m||latest.max_range_m||0)} m</b></div>`;
  }
  const insight=[...all.querySelectorAll('.tele-card')].find(x=>x.querySelector('.tele-title')?.textContent==='INSIGHTS');
  if(insight){
    insight.innerHTML=`<div class="tele-title">ALL-TIME INSIGHTS</div><div class="insight-list">
      <div class="insight-item">• Full tracked history: ${DATA.start} to ${DATA.end}.</div>
      <div class="insight-item">• ${tracked} tracked days and ${total.toFixed(2)} km of cleaned recorded movement.</div>
      <div class="insight-item">• Biggest movement day: ${biggest?fmtDate(biggest.date):'—'} at ${biggest?Number(biggest.distance_km||0).toFixed(2):'0.00'} km.</div>
      <div class="insight-item">• Furthest-ranging day: ${furthest?fmtDate(furthest.date):'—'} at ${furthest?Number(furthest.max_core_m||furthest.max_range_m||0):0} m from home.</div>
    </div>`;
  }
  const standout=[...all.querySelectorAll('.tele-card')].find(x=>x.querySelector('.tele-title')?.textContent==='STANDOUT DAY');
  if(standout && biggest){
    standout.innerHTML=`<div class="tele-title">ALL-TIME STANDOUT DAY</div><div class="story-big">${fmtDate(biggest.date)}</div>
      <div class="tele-row"><span>Distance</span><b>${Number(biggest.distance_km||0).toFixed(2)} km</b></div>
      <div class="tele-row"><span>Max from home</span><b>${Number(biggest.max_core_m||biggest.max_range_m||0)} m</b></div>`;
  }

  // Replace the cloned map container with a clean one, then build the lifetime map only when opened.
  let allMap=null;
  const mapEl=all.querySelector('#all_infographicMap');
  const drawAllMap=()=>{
    if(allMap || !mapEl) return;
    const pts=Array.isArray(DATA.all_points)?DATA.all_points:[];
    allMap=L.map(mapEl,{zoomControl:true});
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:20,attribution:'© OpenStreetMap'}).addTo(allMap);
    if(pts.length){
      L.polyline(pts,{weight:2,opacity:.55}).addTo(allMap);
      if(L.heatLayer) L.heatLayer(pts.map(p=>[p[0],p[1],0.55]),{radius:24,blur:20,maxZoom:18,minOpacity:.22}).addTo(allMap);
      const bounds=L.latLngBounds(pts);
      allMap.fitBounds(bounds.pad(.12));
    } else if(DATA.home) allMap.setView(DATA.home,17);
    if(DATA.home) L.marker(DATA.home,{title:'Home'}).addTo(allMap);
    setTimeout(()=>allMap.invalidateSize(),80);
  };

  const b7=switcher.querySelector('#range7');
  const ba=switcher.querySelector('#rangeAll');
  const showRecent=()=>{ all.style.display='none'; recent.style.display='block'; recent.classList.add('active'); b7.classList.add('active'); ba.classList.remove('active'); setTimeout(()=>{ if(window.infographicMap) try{window.infographicMap.invalidateSize()}catch(e){} },50); };
  const showAll=()=>{ recent.style.display='none'; recent.classList.remove('active'); all.style.display='block'; all.classList.add('active'); b7.classList.remove('active'); ba.classList.add('active'); drawAllMap(); };
  b7.addEventListener('click',showRecent);
  ba.addEventListener('click',showAll);
})();
