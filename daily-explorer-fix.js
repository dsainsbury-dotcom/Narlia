(()=>{
  const BUILD='20260830-dailyfix-2';
  function apply(){
    if(typeof DATA==='undefined'||!Array.isArray(DATA.days)||!DATA.days.length)return;
    const latestIndex=DATA.days.length-1;
    try{currentDayIndex=latestIndex;}catch(e){}
    try{if(typeof renderDays==='function')renderDays();}catch(e){}
    try{if(typeof updateDayControls==='function')updateDayControls();}catch(e){}

    const dayPage=document.getElementById('day');
    if(dayPage?.classList.contains('active')){
      try{if(typeof loadDayByIndex==='function')loadDayByIndex(latestIndex);}catch(e){}
    }

    window.NARLIA_DAILY_EXPLORER_BUILD=BUILD;
    window.NARLIA_DAILY_EXPLORER_LATEST=DATA.days[latestIndex].date;
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(apply,0),{once:true});else setTimeout(apply,0);
  [150,500,1200,2500].forEach(ms=>setTimeout(apply,ms));
})();
