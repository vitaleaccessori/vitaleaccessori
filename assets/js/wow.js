/* VERSIONE "WOW" – animazioni della home (intro, entrata, comparse, numeri, inclinazione) */
(function(){
  var html=document.documentElement, body=document.body;
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* titolo della home diviso in righe, per farle entrare una alla volta */
  var h1=document.querySelector('.hero h1');
  if(h1){
    var righe=h1.innerHTML.split(/<br\s*\/?>/i);
    h1.innerHTML=righe.map(function(r,i){return '<span class="ln"><span style="--d:'+(0.15+i*0.14)+'s">'+r.trim()+'</span></span>';}).join('');
  }

  function avvia(){ body.classList.add('ready'); }

  /* ---------- Intro "La tapparella" ---------- */
  var intro=document.getElementById('intro');
  if(intro&&html.classList.contains('intro-on')&&!reduce){
    var chiusa=false;
    var chiudi=function(subito){
      if(chiusa)return; chiusa=true;
      try{sessionStorage.setItem('vaIntro','1');}catch(e){}
      avvia();
      if(subito){fine();return;}
      intro.classList.add('up');
      intro.addEventListener('animationend',function(e){ if(e.animationName==='i-roll')fine(); });
      setTimeout(fine,1600);
    };
    var fine=function(){ if(intro.parentNode)intro.parentNode.removeChild(intro); html.classList.remove('intro-on'); };
    var t=setTimeout(function(){chiudi(false);},5000);
    var skip=intro.querySelector('.intro-skip');
    if(skip)skip.addEventListener('click',function(){clearTimeout(t);chiudi(false);});
    document.addEventListener('keydown',function(e){ if(e.key==='Escape'){clearTimeout(t);chiudi(false);} });
  } else {
    html.classList.remove('intro-on');
    if(intro&&intro.parentNode)intro.parentNode.removeChild(intro);
    requestAnimationFrame(function(){requestAnimationFrame(avvia);});
  }

  /* ---------- Barra di avanzamento e ombra dell'intestazione ---------- */
  var bar=document.createElement('div'); bar.className='progress'; bar.setAttribute('aria-hidden','true'); body.appendChild(bar);
  var head=document.querySelector('.site-header');
  var onScroll=function(){
    var h=document.documentElement.scrollHeight-innerHeight;
    bar.style.transform='scaleX('+(h>0?Math.min(scrollY/h,1):0)+')';
    if(head)head.classList.toggle('scrolled',scrollY>10);
  };
  addEventListener('scroll',onScroll,{passive:true}); onScroll();

  /* ---------- Comparse allo scorrimento ---------- */
  var gruppi=[
    ['.brands .sub,.brands .t,.brands .d',0.1,''],
    ['.logos>div',0.15,'pop'],
    ['.stat',0.12,''],
    ['#prodotti .head',0,''],
    ['.cat',0.06,''],
    ['.benefit',0.12,''],
    ['.downloads .sub,.downloads .t,.downloads .d,.downloads .dl-layout .btn',0.08,''],
    ['.dl',0.12,''],
    ['.contact .eyebrow,.contact h2,.contact p,.contact-list,.contact .btn',0.08,'']
  ];
  var tutti=[];
  gruppi.forEach(function(g){
    var els=document.querySelectorAll(g[0]);
    Array.prototype.forEach.call(els,function(el,i){
      el.classList.add('rv'); if(g[2])el.classList.add(g[2]);
      /* nelle griglie il ritardo riparte a ogni riga */
      var k=(g[0]==='.cat')?(i%4):i;
      el.style.setProperty('--dl',(k*g[1]).toFixed(2)+'s');
      tutti.push(el);
    });
  });
  var conta=function(el){
    var n=el.querySelector('.num'); if(!n||n.dataset.done)return; n.dataset.done='1';
    var fineN=parseInt(n.getAttribute('data-to'),10)||0, t0=null, dur=1400;
    if(reduce){n.textContent=fineN;return;}
    var passo=function(ts){ if(!t0)t0=ts; var p=Math.min((ts-t0)/dur,1), e=1-Math.pow(1-p,3);
      n.textContent=Math.round(fineN*e); if(p<1)requestAnimationFrame(passo); };
    n.textContent='0'; requestAnimationFrame(passo);
  };
  if(!('IntersectionObserver' in window)||reduce){
    tutti.forEach(function(el){el.classList.add('in');});
    Array.prototype.forEach.call(document.querySelectorAll('.stat'),conta);
  } else {
    var io=new IntersectionObserver(function(voci){
      voci.forEach(function(v){
        if(v.isIntersecting){ var el=v.target; el.classList.add('in'); if(el.classList.contains('stat'))conta(el); io.unobserve(el);
          /* finita la comparsa, l'elemento torna normale (così l'inclinazione delle schede è immediata) */
          var d=parseFloat(el.style.getPropertyValue('--dl'))||0; setTimeout(function(){ if(!el.classList.contains('stat'))el.classList.remove('rv','in','pop'); },(d+1)*1000); }
      });
    },{rootMargin:'0px 0px -8% 0px',threshold:0.12});
    tutti.forEach(function(el){io.observe(el);});
  }

  /* ---------- Inclinazione delle schede prodotto (solo con il mouse) ---------- */
  if(!reduce&&window.matchMedia('(hover: hover) and (pointer: fine)').matches){
    Array.prototype.forEach.call(document.querySelectorAll('a.cat'),function(c){
      c.addEventListener('mousemove',function(e){
        var r=c.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
        c.style.transform='rotateX('+(-y*7).toFixed(2)+'deg) rotateY('+(x*9).toFixed(2)+'deg) translateY(-4px)';
      });
      c.addEventListener('mouseleave',function(){ c.style.transform=''; });
    });
  }
})();
