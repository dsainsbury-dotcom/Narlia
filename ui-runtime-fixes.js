(()=>{
  const BUILD='20260830-ui-fixes-6';
  function hideHotspots(){
    document.querySelectorAll('[data-page="places"]').forEach(el=>{
      el.style.display='none';
      el.setAttribute('aria-hidden','true');
    });
    window.NARLIA_UI_FIXES_BUILD=BUILD;
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',hideHotspots,{once:true}); else hideHotspots();
  [100,500,1500,4000].forEach(ms=>setTimeout(hideHotspots,ms));
})();
