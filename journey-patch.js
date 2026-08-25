(()=>{
  const nav=document.querySelector('nav');
  const existing=document.getElementById('journey');
  if(existing) existing.remove();
  if(nav){
    nav.querySelectorAll('.tab').forEach(b=>{
      if((b.dataset&&b.dataset.page==='journey')||b.textContent.trim()==='Journey') b.remove();
    });
  }
})();
