(()=>{
  const BUILD='20260830-ui-fixes-5';
  const AVATAR_SOURCE='https://raw.githubusercontent.com/dsainsbury-dotcom/Narlia/3b89ec30a8276e0f50cd093c8051c9b540fcdec0/profile-logo.js';
  let profileSrc=null;
  let applying=false;

  function hideHotspots(){
    document.querySelectorAll('[data-page="places"]').forEach(el=>{
      el.style.display='none';
      el.setAttribute('aria-hidden','true');
    });
  }

  async function getEmbeddedProfileSrc(){
    if(profileSrc) return profileSrc;
    try{
      const r=await fetch(AVATAR_SOURCE,{cache:'no-store'});
      if(!r.ok) throw new Error('confirmed avatar source '+r.status);
      const txt=await r.text();
      const m=txt.match(/const src='(data:image\/jpeg;base64,[^']+)'/);
      profileSrc=m ? m[1] : null;
      return profileSrc;
    }catch(e){
      console.warn('Narlia confirmed profile source load failed',e);
      return null;
    }
  }

  function bindProfile(src){
    if(!src) return;
    document.querySelectorAll('.logo,.petavatar').forEach(el=>{
      const current=el.querySelector('img[data-narlia-avatar="1"]');
      if(current && current.src===src) return;
      el.replaceChildren();
      el.style.setProperty('overflow','hidden','important');
      el.style.setProperty('padding','0','important');
      el.style.setProperty('background','none','important');
      const im=document.createElement('img');
      im.src=src;
      im.alt='';
      im.setAttribute('aria-label','Narlia');
      im.decoding='async';
      im.dataset.narliaAvatar='1';
      im.style.cssText='width:100%;height:100%;object-fit:cover;object-position:center;display:block;border-radius:50%;';
      el.appendChild(im);
    });
  }

  async function apply(){
    if(applying) return;
    applying=true;
    try{
      hideHotspots();
      const src=await getEmbeddedProfileSrc();
      bindProfile(src);
      window.NARLIA_UI_FIXES_BUILD=BUILD;
    }finally{
      applying=false;
    }
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',apply,{once:true}); else apply();
  [50,150,300,600,1000,1600,2500,4000,7000].forEach(ms=>setTimeout(apply,ms));

  const observer=new MutationObserver(()=>{
    const needsFix=[...document.querySelectorAll('.logo,.petavatar')].some(el=>!el.querySelector('img[data-narlia-avatar="1"]'));
    if(needsFix) apply();
  });
  observer.observe(document.documentElement,{subtree:true,childList:true});

  document.addEventListener('visibilitychange',()=>{if(!document.hidden)apply();});
  window.addEventListener('pageshow',apply);
})();
