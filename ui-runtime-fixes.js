(()=>{
  const BUILD='20260830-ui-fixes-1';

  function hideHotspots(){
    document.querySelectorAll('[data-page="places"]').forEach(el=>{el.style.display='none';el.setAttribute('aria-hidden','true');});
  }

  async function fixProfilePhoto(){
    let src='';
    try{
      const r=await fetch('profile-logo.js?v='+BUILD,{cache:'no-store'});
      if(r.ok){
        const txt=await r.text();
        const m=txt.match(/const src='([^']+)'/);
        if(m) src=m[1];
      }
    }catch(e){}
    if(!src) return;
    document.querySelectorAll('.logo,.petavatar').forEach(el=>{
      el.textContent='';
      el.style.overflow='hidden';
      el.style.padding='0';
      let im=el.querySelector('img');
      if(!im){im=document.createElement('img');el.appendChild(im);}
      im.src=src;
      im.alt='Narlia';
      im.style.cssText='width:100%;height:100%;object-fit:cover;display:block;border-radius:50%';
    });
  }

  function apply(){hideHotspots();fixProfilePhoto();window.NARLIA_UI_FIXES_BUILD=BUILD;}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
  [250,750,1500].forEach(ms=>setTimeout(apply,ms));
})();
