(()=>{
  const BUILD='20260830-profilefix-3';
  async function getSrc(){
    try{
      const r=await fetch('profile-logo.js?v='+BUILD,{cache:'no-store'});
      if(!r.ok)throw new Error('profile-logo.js '+r.status);
      const txt=await r.text();
      const m=txt.match(/const src='([^']+)'/);
      return m?.[1]||null;
    }catch(e){console.warn('Narlia profile source load failed',e);return null;}
  }
  function bind(src){
    if(!src)return;
    document.querySelectorAll('.logo,.petavatar').forEach(el=>{
      el.replaceChildren();
      el.style.setProperty('overflow','hidden','important');
      el.style.setProperty('padding','0','important');
      el.style.setProperty('background-image',`url("${src}")`,'important');
      el.style.setProperty('background-size','cover','important');
      el.style.setProperty('background-position','center','important');
      el.style.setProperty('background-repeat','no-repeat','important');
    });
  }
  async function install(){
    const src=await getSrc();
    if(!src)return;
    [0,100,500,1500,3000].forEach(ms=>setTimeout(()=>bind(src),ms));
    window.addEventListener('resize',()=>bind(src),{passive:true});
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)bind(src)});
    console.info('Narlia profile background guard',BUILD);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
