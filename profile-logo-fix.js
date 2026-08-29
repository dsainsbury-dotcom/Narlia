(()=>{
  const BUILD='20260829-profilefix-1';
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
      el.textContent='';
      el.style.setProperty('overflow','hidden','important');
      el.style.setProperty('padding','0','important');
      el.style.setProperty('background-image',`url("${src}")`,'important');
      el.style.setProperty('background-size','cover','important');
      el.style.setProperty('background-position','center','important');
      el.style.setProperty('background-repeat','no-repeat','important');
      let img=el.querySelector('img[data-narlia-profile="1"]');
      if(!img){
        img=document.createElement('img');
        img.dataset.narliaProfile='1';
        img.alt='Narlia';
        el.appendChild(img);
      }
      img.src=src;
      img.style.cssText='width:100%;height:100%;object-fit:cover;display:block;border-radius:50%;';
    });
  }
  async function install(){
    const src=await getSrc();
    if(!src)return;
    const apply=()=>bind(src);
    apply();
    setTimeout(apply,100);setTimeout(apply,500);setTimeout(apply,1500);
    const root=document.body;
    if(root)new MutationObserver(apply).observe(root,{childList:true,subtree:true});
    console.info('Narlia profile image guard',BUILD);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();
