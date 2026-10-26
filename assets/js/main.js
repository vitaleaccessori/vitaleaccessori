/* Vitale Accessori - script condiviso */
(function(){
const y=document.getElementById('year'); if(y) y.textContent=new Date().getFullYear();
/* menu mobile */
const t=document.querySelector('.menu-toggle'),n=document.getElementById('main-nav');
if(t&&n){t.addEventListener('click',()=>{const o=n.classList.toggle('open');t.setAttribute('aria-expanded',o);});
n.addEventListener('click',e=>{if(e.target.tagName==='A'){n.classList.remove('open');t.setAttribute('aria-expanded',false);}});}
/* slider della home */
const slides=[...document.querySelectorAll('.hero-photo img')],box=document.querySelector('.dots'),pp=document.querySelector('.dots .pp');
if(box&&slides.length){box.querySelectorAll('button:not(.pp)').forEach(x=>x.remove());slides.forEach((s,k)=>{const d=document.createElement('button');d.type='button';d.setAttribute('aria-label','Diapositiva '+(k+1));pp?box.insertBefore(d,pp):box.appendChild(d);});}
const dots=box?[...box.querySelectorAll('button:not(.pp)')]:[];
if(slides.length){
const INTERVAL=3000; /* durata di ogni foto, in millisecondi */
let i=0,timer=null,paused=false;
function show(k){i=(k+slides.length)%slides.length;slides.forEach((s,j)=>s.classList.toggle('on',j===i));dots.forEach((d,j)=>{d.classList.toggle('on',j===i);j===i?d.setAttribute('aria-current','true'):d.removeAttribute('aria-current')});}
function stop(){clearInterval(timer);timer=null;}
function start(){stop();if(!paused&&slides.length>1)timer=setInterval(()=>show(i+1),INTERVAL);}
dots.forEach((d,k)=>d.addEventListener('click',()=>{show(k);start();}));
show(0);
if(pp)pp.addEventListener('click',()=>{paused=!paused;pp.textContent=paused?'\u25B6':'\u275A\u275A';pp.setAttribute('aria-pressed',paused);pp.setAttribute('aria-label',paused?'Riprendi lo scorrimento':'Metti in pausa lo scorrimento');start();});
start();}
/* filtro per marchio nella pagina download */
const fb=[...document.querySelectorAll('.filters button')],blocks=[...document.querySelectorAll('.brand-block')];
fb.forEach(b=>b.addEventListener('click',()=>{fb.forEach(x=>x.classList.toggle('on',x===b));blocks.forEach(k=>k.hidden=!(b.dataset.filter==='all'||k.dataset.brand===b.dataset.filter));}));
})();
