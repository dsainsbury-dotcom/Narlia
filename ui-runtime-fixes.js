(()=>{
  const BUILD='20260830-ui-fixes-3';

  function hideHotspots(){
    document.querySelectorAll('[data-page="places"]').forEach(el=>{
      el.style.display='none';
      el.setAttribute('aria-hidden','true');
    });
  }

  async function getEmbeddedProfileSrc(){
    try{
      const r=await fetch('profile-logo.js?v='+BUILD,{cache:'no-store'});
      if(!r.ok) throw new Error('profile-logo.js '+r.status);
      const txt=await r.text();
      const m=txt.match(/const src='(data:image\/jpeg;base64,[^']+)'/);
      return m ? m[1] : null;
    }catch(e){
      console.warn('Narlia embedded profile source load failed',e);
      return null;
    }
  }

  function bindProfile(src){
    if(!src) return;
    document.querySelectorAll('.logo,.petavatar').forEach(el=>{
      el.replaceChildren();
      el.style.setProperty('overflow','hidden','important');
      el.style.setProperty('padding','0','important');
      el.style.setProperty('background','none','important');
      const im=document.createElement('img');
      im.src=src;
      im.alt='Narlia';
      im.decoding='async';
      im.style.cssText='width:100%;height:100%;object-fit:cover;object-position:center;display:block;border-radius:50%;';
      el.appendChild(im);
    });
  }

  async function apply(){
    hideHotspots();
    const src=await getEmbeddedProfileSrc();
    bindProfile(src);
    window.NARLIA_UI_FIXES_BUILD=BUILD;
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
  [100,300,800,1600,3000].forEach(ms=>setTimeout(apply,ms));
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)apply();});
})();
