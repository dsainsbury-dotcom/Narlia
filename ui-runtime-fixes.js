(()=>{
  const BUILD='20260830-ui-fixes-2';
  const PROFILE_SRC='media/kitten-early-01.jpg?v='+BUILD;

  function hideHotspots(){
    document.querySelectorAll('[data-page="places"]').forEach(el=>{
      el.style.display='none';
      el.setAttribute('aria-hidden','true');
    });
  }

  function fixProfilePhoto(){
    document.querySelectorAll('.logo,.petavatar').forEach(el=>{
      el.replaceChildren();
      el.style.setProperty('overflow','hidden','important');
      el.style.setProperty('padding','0','important');
      el.style.setProperty('background','none','important');
      const im=document.createElement('img');
      im.src=PROFILE_SRC;
      im.alt='Narlia';
      im.decoding='async';
      im.style.cssText='width:100%;height:100%;object-fit:cover;object-position:center;display:block;border-radius:50%;';
      el.appendChild(im);
    });
  }

  function apply(){
    hideHotspots();
    fixProfilePhoto();
    window.NARLIA_UI_FIXES_BUILD=BUILD;
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
  [100,300,800,1600,3000].forEach(ms=>setTimeout(apply,ms));
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)apply();});
})();
