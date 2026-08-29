(()=>{
  const BUILD='20260829-overlapfix-2';
  function applyLayout(){
    const section=document.getElementById('infographic');
    if(!section)return;
    const telemetry=section.querySelector('.telemetry');
    const left=section.querySelector('.tele-left');
    const main=section.querySelector('.tele-main');
    const right=section.querySelector('.tele-right');
    const map=section.querySelector('#infographicMap');
    const mapCard=map?.closest('.tele-map-card');
    if(!telemetry||!left||!main||!right)return;

    const narrow=window.matchMedia('(max-width:1100px)').matches;
    if(narrow){
      telemetry.style.setProperty('display','grid','important');
      telemetry.style.setProperty('grid-template-columns','1fr','important');
      telemetry.style.setProperty('gap','14px','important');
      [left,main,right].forEach(el=>{
        el.style.setProperty('width','100%','important');
        el.style.setProperty('max-width','100%','important');
        el.style.setProperty('min-width','0','important');
      });
      right.style.setProperty('grid-column','auto','important');
    }else{
      telemetry.style.setProperty('display','flex','important');
      telemetry.style.setProperty('align-items','flex-start','important');
      telemetry.style.setProperty('gap','14px','important');
      telemetry.style.setProperty('width','100%','important');
      telemetry.style.setProperty('max-width','100%','important');
      telemetry.style.setProperty('overflow','hidden','important');

      left.style.setProperty('flex','0 0 300px','important');
      left.style.setProperty('width','300px','important');
      left.style.setProperty('min-width','0','important');

      main.style.setProperty('flex','1 1 0','important');
      main.style.setProperty('width','0','important');
      main.style.setProperty('min-width','0','important');
      main.style.setProperty('max-width','100%','important');
      main.style.setProperty('overflow','hidden','important');
      main.style.setProperty('position','relative','important');
      main.style.setProperty('z-index','1','important');

      right.style.setProperty('flex','0 0 340px','important');
      right.style.setProperty('width','340px','important');
      right.style.setProperty('min-width','0','important');
      right.style.setProperty('max-width','340px','important');
      right.style.setProperty('position','relative','important');
      right.style.setProperty('z-index','30','important');
      right.style.setProperty('background','#07111d','important');
      right.style.setProperty('grid-column','auto','important');
    }

    if(mapCard){
      mapCard.style.setProperty('width','100%','important');
      mapCard.style.setProperty('max-width','100%','important');
      mapCard.style.setProperty('min-width','0','important');
      mapCard.style.setProperty('overflow','hidden','important');
    }
    if(map){
      map.style.setProperty('width','100%','important');
      map.style.setProperty('max-width','100%','important');
      map.style.setProperty('min-width','0','important');
      map.style.setProperty('overflow','hidden','important');
      try{ if(window.maps?.infographic) window.maps.infographic.invalidateSize(true); }catch(e){}
    }
  }

  function install(){
    applyLayout();
    setTimeout(applyLayout,120);
    setTimeout(applyLayout,500);
    window.addEventListener('resize',applyLayout,{passive:true});
    document.querySelectorAll('.infographic-mode').forEach(b=>b.addEventListener('click',()=>{
      setTimeout(applyLayout,0);setTimeout(applyLayout,150);
    }));
    const section=document.getElementById('infographic');
    if(section){
      new MutationObserver(()=>setTimeout(applyLayout,0)).observe(section,{childList:true,subtree:true});
    }
    console.info('Narlia infographic hard layout guard',BUILD);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();
