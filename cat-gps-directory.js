(()=>{
'use strict';
const build='20261101-multicat-gps-directory-1',cats=window.NARLIA_CAT_PROFILES,gps=window.CAT_GPS_DATA;
if(!cats||!gps)return;
const views=[
 ['infographic','Infographic','Recent and all-time GPS activity will appear here after tracking starts.'],
 ['story','Lifetime Story','No GPS journeys have been recorded for this cat yet.'],
 ['last30','Last 30 Days','There are no tracked days or routes to display yet.'],
 ['day','Daily Explorer','No GPS dates are available to select.'],
 ['records','Records','Distance, territory, speed and exploration records will appear after GPS data is collected and checked.'],
 ['trends','Trends','A trend requires a history of genuine, cleaned GPS readings.'],
 ['places','Hotspot Investigations','No recurring places can be assessed without location history.']
];
const css=[
'.gps-directory-head{margin:6px 0 14px;font-size:clamp(23px,3vw,31px)}',
'.gps-directory-lede{color:var(--muted);line-height:1.6;max-width:850px}',
'.gps-directory-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;margin:18px 0}',
'.gps-cat-card,.gps-panel{background:linear-gradient(145deg,#15283b,#0c1927);border:1px solid #294158;border-radius:13px;padding:17px}',
'.gps-cat-card img{width:100%;height:205px;object-fit:cover;border-radius:9px}',
'.gps-cat-card h3{margin:12px 0 6px;font-size:23px}',
'.gps-status{font-size:12px;color:#a7c6db;margin:8px 0 14px;line-height:1.5}',
'.gps-action{border:1px solid #3c789d;border-radius:8px;background:#1c4a69;color:white;padding:10px 13px;cursor:pointer;font-weight:700}',
'.gps-action:hover,.gps-action:focus-visible{background:#286489;outline:2px solid #80bfea}',
'.gps-action-secondary{background:#10273a}',
'.gps-cat-controls{display:flex;gap:9px;flex-wrap:wrap;margin:12px 0 16px}',
'.gps-cat-tabs{display:flex;gap:8px;flex-wrap:wrap;margin:18px 0}',
'.gps-cat-tab{border:1px solid #294158;border-radius:7px;background:#101f2e;color:#e8f3fb;padding:9px 12px;cursor:pointer}',
'.gps-cat-tab[aria-selected="true"]{background:#225274;border-color:#65b8ec;color:white}',
'.gps-empty{border:1px dashed #42617b;border-radius:12px;background:#0e1c2a;padding:26px 18px;min-height:180px;display:flex;flex-direction:column;justify-content:center;gap:10px}',
'.gps-empty strong{font-size:20px}.gps-empty p{color:var(--muted);line-height:1.6;margin:0}',
'.gps-narlia-banner{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin:0 0 14px;padding:11px 14px;background:#0f2536;border:1px solid #294158;border-radius:10px}',
'.gps-narlia-banner span{color:#b8d7e9;font-size:13px}',
'.gps-nav-label{align-self:center;color:#82badc;font-size:11px;letter-spacing:.06em;text-transform:uppercase;font-weight:800;padding:0 4px}',
'.gps-profile-action{margin:8px 8px 10px 0}',
'@media(max-width:640px){.gps-directory-grid{grid-template-columns:1fr}.gps-cat-card img{height:220px}}'
].join('');
function node(html){const t=document.createElement('template');t.innerHTML=html.trim();return t.content.firstElementChild;}
function button(label,attr,secondary){return '<button type="button" class="gps-action'+(secondary?' gps-action-secondary':'')+'" '+attr+'>'+label+'</button>';}
function navGo(id){if(typeof showPage==='function')showPage(id);}
function status(id){
 if(id==='narlia')return 'GPS active · Tracker IAJVTCCE · Existing history preserved';
 const d=gps[id]||{},count=Array.isArray(d.cleanedPoints)?d.cleanedPoints.length:0;
 return d.trackerId?(count?'Tracker '+d.trackerId+' · '+count+' cleaned points':'Tracker '+d.trackerId+' · Awaiting first GPS data'):'No tracker connected yet · No GPS data';
}
function gpsCard(id){
 const c=cats[id],dest=id==='narlia'?'infographic':'gps-'+id;
 return '<article class="gps-cat-card">'+(c.photo?'<img src="'+c.photo+'" alt="'+c.name+'" loading="lazy">':'')+
 '<h3>'+c.name+'</h3><div class="gps-status">'+status(id)+'</div>'+
 button('Open '+c.name+'’s GPS','data-gps-go="'+dest+'"')+'</article>';
}
function gpsPage(id){
 const c=cats[id],p=document.createElement('section');p.id='gps-'+id;p.className='page';
 p.innerHTML='<div class="gps-cat-controls">'+button('← GPS Directory','data-gps-go="gps-directory"',true)+button('View '+c.name+'’s profile','data-gps-go="'+id+'"',true)+'</div>'+
 '<div class="cat-kicker">'+c.name+' · independent GPS area</div>'+
 '<h2 class="gps-directory-head">'+c.name+'’s GPS</h2>'+
 '<p class="gps-directory-lede">'+status(id)+'. This tracking area is reserved for '+c.name+' only. No Narlia GPS points are included.</p>'+
 '<div class="gps-cat-tabs" role="tablist" aria-label="'+c.name+' GPS views">'+views.map((v,i)=>'<button type="button" class="gps-cat-tab" role="tab" data-gps-view="'+v[0]+'" aria-selected="'+(i===0)+'">'+v[1]+'</button>').join('')+'</div>'+
 '<div class="gps-panel" data-gps-panel role="tabpanel" aria-live="polite"></div>';
 return p;
}
function showKittenView(page,key){
 const id=page.id.slice(4),c=cats[id],v=views.find(x=>x[0]===key)||views[0],d=gps[id]||{};
 page.querySelectorAll('[data-gps-view]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.gpsView===v[0])));
 const count=Array.isArray(d.cleanedPoints)?d.cleanedPoints.length:0;
 const detail=count>0?'GPS points have been received for '+c.name+'. These must be processed into verified maps and statistics before publishing this view.':'No GPS data yet';
 page.querySelector('[data-gps-panel]').innerHTML='<div class="gps-empty"><div class="cat-kicker">'+c.name+' / '+v[1]+'</div><strong>'+detail+'</strong><p>'+v[2]+'</p><p>Tracker: '+(d.trackerId||'not assigned')+' · Verified points: '+count+'</p></div>';
}
function init(){
 if(document.getElementById('gps-directory'))return;
 const nav=document.querySelector('nav'),main=document.querySelector('main');if(!nav||!main)return;
 const style=document.createElement('style');style.textContent=css;document.head.appendChild(style);
 const directory=node('<section class="page" id="gps-directory"><div class="cat-kicker">Separate GPS histories</div><h2 class="gps-directory-head">Choose a cat’s GPS</h2><p class="gps-directory-lede">Each cat has their own tracking area. Narlia’s existing maps and records stay exactly as they are. Dante and Amara are ready for trackers when they are big enough.</p><div class="gps-directory-grid">'+['narlia','dante','amara'].map(gpsCard).join('')+'</div></section>');
 main.append(directory,gpsPage('dante'),gpsPage('amara'));
 ['dante','amara'].forEach(id=>showKittenView(document.getElementById('gps-'+id),'infographic'));
 const our=nav.querySelector('[data-page="cats"]'),watch=nav.querySelector('[data-page="kitten-watch"]'),first=nav.querySelector('[data-page="infographic"]');
 const gpsTab=document.createElement('button');gpsTab.className='tab';gpsTab.dataset.page='gps-directory';gpsTab.textContent='GPS Directory';gpsTab.onclick=()=>navGo('gps-directory');
 if(our){nav.insertBefore(our,nav.firstElementChild);nav.insertBefore(gpsTab,our.nextSibling);}else nav.insertBefore(gpsTab,first);
 if(watch)nav.insertBefore(watch,gpsTab.nextSibling);
 const label=document.createElement('span');label.className='gps-nav-label';label.textContent='Narlia GPS ↓';nav.insertBefore(label,first);
 ['infographic','story','last30','day','places','records','trends'].forEach(id=>{
  const p=document.getElementById(id);if(!p)return;
  p.prepend(node('<div class="gps-narlia-banner"><span><strong>Narlia’s GPS</strong> · Tracker IAJVTCCE · These statistics belong to Narlia only.</span>'+button('Switch cat','data-gps-go="gps-directory"',true)+'</div>'));
 });
 ['dante','amara'].forEach(id=>{
  const p=document.getElementById(id),watchButton=p?.querySelector('[data-cat="kitten-watch"]');
  if(watchButton)watchButton.before(node(button('🗺️ Open '+cats[id].name+'’s GPS','data-gps-go="gps-'+id+'"')));
  const card=document.querySelector('#cats .cat-card [data-cat="'+id+'"]')?.closest('.cat-card');
  if(card)card.append(node('<div style="margin-top:10px">'+button('GPS tracking','data-gps-go="gps-'+id+'"',true)+'</div>'));
 });
 const narliaProfile=document.getElementById('narlia-profile');
 if(narliaProfile){const existing=narliaProfile.querySelector('[data-cat="infographic"]');if(existing)existing.after(node('<div style="margin:12px 0">'+button('Switch cat’s GPS','data-gps-go="gps-directory"',true)+'</div>'));}
 main.addEventListener('click',e=>{
  const tab=e.target.closest('[data-gps-view]');if(tab){showKittenView(tab.closest('.page'),tab.dataset.gpsView);return;}
  const go=e.target.closest('[data-gps-go]');if(go){navGo(go.dataset.gpsGo);}
 });
 window.CAT_GPS_DIRECTORY_BUILD=build;
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
setTimeout(init,250);
})();