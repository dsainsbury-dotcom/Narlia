(()=>{
'use strict';
const build='20261101-shared-cat-gps-2',cats=window.NARLIA_CAT_PROFILES,gps=window.CAT_GPS_DATA;
const ids=['narlia','dante','amara'];
const views=[
 ['infographic','Infographic','Recent and all-time activity will appear here after tracking starts.'],
 ['story','Lifetime Story','Journeys will build a lifetime story after tracking starts.'],
 ['last30','Last 30 Days','There are no tracked days or routes to display yet.'],
 ['day','Daily Explorer','No GPS dates are available to select yet.'],
 ['records','Records','Records need genuine, checked GPS readings.'],
 ['trends','Trends','Trends need a history of genuine, checked GPS readings.']
];
if(!cats||!gps)return;
let selected='narlia',view='infographic',inGPS=false;
const isView=id=>views.some(v=>v[0]===id);
const profile=id=>id==='narlia'?'narlia-profile':id;
function el(tag,attrs={},text){const n=document.createElement(tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));if(text)n.textContent=text;return n;}
function init(){
 if(document.getElementById('cat-gps-navigation'))return;
 const nav=document.querySelector('nav'),main=document.querySelector('main');
 if(!nav||!main||typeof window.showPage!=='function')return;
 const original=window.showPage;
 // Leaflet heat redraws can arrive after a cat switch hides their map.
 // Wait for the existing map invalidation on return instead of drawing a zero-size canvas.
 const heat=window.L?.HeatLayer?.prototype;
 if(heat&&!heat._catVisibilityGuard){
  const redraw=heat._redraw;
  heat._redraw=function(){
   const container=this._map?.getContainer();
   if(!container?.clientWidth||!container?.clientHeight||!this._canvas?.width||!this._canvas?.height){this._frame=null;return this;}
   return redraw.apply(this,arguments);
  };
  heat._catVisibilityGuard=true;
 }
 const style=el('style');style.textContent=`
 #cat-gps-navigation{max-width:1450px;box-sizing:border-box;padding:20px 22px 0;margin:0 0 20px}
 .gps-selectors{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:10px 0 18px}
 .gps-select-cat{display:flex;align-items:center;gap:12px;text-align:left;background:linear-gradient(145deg,#15283b,#0c1927);border:1px solid #294158;border-radius:12px;padding:12px;color:#e8f3fb;cursor:pointer;min-width:0}
 .gps-select-cat img{width:64px;height:64px;object-fit:cover;border-radius:10px}
 .gps-select-cat strong{display:block;font-size:19px;margin-bottom:5px}
 .gps-select-cat small{display:block;color:#b8d7e9;line-height:1.4}
 .gps-select-cat[aria-pressed="true"]{border-color:#80bfea;box-shadow:0 0 0 2px #225274}
 .gps-select-cat:focus-visible,.gps-link:focus-visible{outline:2px solid #80bfea;outline-offset:3px}
 .gps-context{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px}
 .gps-context h2{font-size:24px;margin:4px 0}.gps-context p{color:var(--muted);margin:5px 0;line-height:1.5}
 .gps-links{display:flex;gap:8px;flex-wrap:wrap}.gps-link{background:#183650;border:1px solid #35658a;color:white;border-radius:8px;padding:10px 13px;cursor:pointer}
 #shared-gps-tabs{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}
 #gps-awaiting .gps-empty{border:1px dashed #42617b;border-radius:12px;background:#0e1c2a;padding:28px 20px;min-height:180px}
 #gps-awaiting h2{margin-top:0}#gps-awaiting p{color:var(--muted);line-height:1.7}
 @media(max-width:640px){.gps-selectors{gap:7px}.gps-select-cat{flex-direction:column;align-items:flex-start;padding:10px;gap:8px}.gps-select-cat img{width:52px;height:52px}.gps-select-cat strong{font-size:17px}.gps-select-cat small{font-size:11px}}
 `;document.head.append(style);
 const shell=el('section',{id:'cat-gps-navigation','aria-label':'Cat GPS dashboard'});
 shell.append(el('div',{'class':'cat-kicker'},'Select your cat'));
 const selectors=el('div',{'class':'gps-selectors','role':'group','aria-label':'Select cat'});
 ids.forEach(id=>{
  const b=el('button',{'type':'button','class':'gps-select-cat','data-gps-cat':id,'aria-pressed':String(id===selected)});
  if(cats[id].photo)b.append(el('img',{'src':cats[id].photo,'alt':id==='narlia'?'Narlia, brown tabby with white paws':cats[id].name,'loading':'lazy'}));
  const text=el('span');text.append(el('strong',{},cats[id].name),el('small',{},id==='narlia'?'GPS active':'Awaiting tracker'));b.append(text);
  b.addEventListener('click',()=>{selected=id;window.showPage(view);});selectors.append(b);
 });
 shell.append(selectors);
 const context=el('div',{'class':'gps-context'}),heading=el('div'),title=el('h2'),status=el('p'),links=el('div',{'class':'gps-links'});
 heading.append(title,status);
 const profileButton=el('button',{'type':'button','class':'gps-link'},'View profile & photos');
 profileButton.onclick=()=>window.showPage(profile(selected));
 const watchButton=el('button',{'type':'button','class':'gps-link'},'Kitten Watch');watchButton.onclick=()=>window.showPage('kitten-watch');
 links.append(profileButton,watchButton);context.append(heading,links);shell.append(context);
 const tabs=el('div',{'id':'shared-gps-tabs','role':'tablist','aria-label':'GPS views'});
 const buttons=views.map(([id,label])=>{
  const b=nav.querySelector('[data-page="'+id+'"]');
  b.textContent=label;b.setAttribute('role','tab');b.id='gps-tab-'+id;
  b.onclick=()=>window.showPage(id);tabs.append(b);return b;
 });
 shell.append(tabs);main.before(shell);
 const pending=el('section',{'id':'gps-awaiting','class':'page','role':'tabpanel','aria-live':'polite'});main.append(pending);
 views.forEach(([id])=>{const p=document.getElementById(id);p.setAttribute('role','tabpanel');p.setAttribute('aria-labelledby','gps-tab-'+id);});
 function refresh(){
  selectors.querySelectorAll('[data-gps-cat]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.gpsCat===selected)));
  title.textContent=cats[selected].name+'’s GPS Dashboard';
  const record=gps[selected];
  status.textContent=selected==='narlia'?'GPS active · Narlia’s own filtered tracking history':record.trackerId?'Tracker connected · Awaiting verified GPS history':'Awaiting tracker · No GPS history yet';
  buttons.forEach(b=>{
   const active=inGPS&&b.dataset.page===view;
   b.classList.toggle('active',active);b.setAttribute('aria-selected',String(active));
   b.setAttribute('tabindex',active||!inGPS&&b.dataset.page===view?'0':'-1');
   b.setAttribute('aria-controls',selected==='narlia'?b.dataset.page:'gps-awaiting');
  });
 }
 window.showPage=function(id){
  // Legacy profile links still enter the single shared dashboard.
  if(id==='gps-directory')id='cats';
  if(id==='gps-dante'||id==='gps-amara'){selected=id.slice(4);id=view;}
  const cat=ids.find(c=>profile(c)===id);if(cat)selected=cat;
  inGPS=isView(id);
  if(inGPS){
   view=id;
   if(selected==='narlia')original(id);
   else{
    const v=views.find(v=>v[0]===id),record=gps[selected];
    pending.replaceChildren();
    const box=el('div',{'class':'gps-empty'});
    box.append(el('div',{'class':'cat-kicker'},cats[selected].name+' / '+v[1]),el('h2',{},record.trackerId?'Awaiting verified GPS history':'Awaiting tracker'),el('p',{},v[2]),el('p',{},'This space belongs to '+cats[selected].name+'. No GPS history has been recorded here. Profiles, dated weights and real photo galleries are available now.'));
    pending.append(box);pending.setAttribute('aria-labelledby','gps-tab-'+id);original('gps-awaiting');
   }
  }else original(id);
  refresh();
 };
 tabs.addEventListener('keydown',e=>{
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
  e.preventDefault();const i=buttons.indexOf(document.activeElement);
  const next=e.key==='Home'?0:e.key==='End'?buttons.length-1:(i+(e.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;
  buttons[next].focus();window.showPage(views[next][0]);
 });
 ids.forEach(id=>{
  const card=document.querySelector('#cats [data-cat="'+profile(id)+'"]')?.closest('.cat-card');
  if(card){const b=el('button',{'type':'button','class':'cat-button','style':'margin-top:10px'},'Open '+cats[id].name+'’s GPS');b.onclick=()=>{selected=id;window.showPage(view);};card.append(b);}
 });
 window.CAT_GPS_NAVIGATION={build,get selectedCat(){return selected;},get selectedView(){return view;}};
 window.CAT_GPS_DIRECTORY_BUILD=build;
 window.showPage('cats');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
setTimeout(init,250);
})();
