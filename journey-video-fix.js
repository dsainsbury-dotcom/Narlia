(()=>{
  function toBlobUrl(b64){
    const clean=(b64||'').replace(/\s/g,'');
    if(!clean || clean.length%4!==0) throw new Error('video data incomplete');
    const bin=atob(clean);
    const bytes=new Uint8Array(bin.length);
    for(let i=0;i<bin.length;i++) bytes[i]=bin.charCodeAt(i);
    return URL.createObjectURL(new Blob([bytes],{type:'video/mp4'}));
  }
  const data=window.JOURNEY_VIDEO_DATA||{};
  const videos=[...document.querySelectorAll('#journey video')];
  videos.forEach(v=>{
    const old=v.getAttribute('src')||'';
    const key=old.includes('dante-first-solid-food')?'dante':old.includes('kitten-early-video')?'kitten':null;
    if(!key || !data[key]) return;
    try{
      const err=v.nextElementSibling;
      if(err && err.classList.contains('journey-error')) err.style.display='none';
      v.style.display='block';
      v.removeAttribute('src');
      v.src=toBlobUrl(data[key]);
      v.load();
    }catch(e){
      console.error('Journey video setup failed',e);
    }
  });
})();