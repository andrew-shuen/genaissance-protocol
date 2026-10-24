/* Shared compact homepage banner: injects a link back to index.html at the top of <body>. */
(function(){
  function helix(){
    var W=600,H=64,mid=32,A=20,P=150,s='',b='',r='',n='';
    for(var x=0;x<=W;x+=4){var y1=mid+A*Math.sin(2*Math.PI*x/P),y2=mid-A*Math.sin(2*Math.PI*x/P);s+=(x?'L':'M')+x+' '+y1.toFixed(1);b+=(x?'L':'M')+x+' '+y2.toFixed(1);}
    for(var k=7.5;k<W;k+=15){var a=mid+A*Math.sin(2*Math.PI*k/P),c=mid-A*Math.sin(2*Math.PI*k/P);
      r+='<line x1="'+k+'" y1="'+a.toFixed(1)+'" x2="'+k+'" y2="'+c.toFixed(1)+'" stroke="#35e0ff" stroke-width="1.6" opacity=".45"/>';
      n+='<circle cx="'+k+'" cy="'+a.toFixed(1)+'" r="1.8" fill="#f2ffff"/>';}
    return '<svg class="sb-helix" viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="xMaxYMid slice" aria-hidden="true">'+
      '<defs><filter id="sbGlow" x="-5%" y="-40%" width="110%" height="180%"><feGaussianBlur stdDeviation="2" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>'+
      '<path d="'+b+'" fill="none" stroke="#6fc8ff" stroke-width="2" opacity=".35"/>'+
      '<g filter="url(#sbGlow)">'+r+'<path d="'+s+'" fill="none" stroke="#9af2ff" stroke-width="3.2" stroke-linecap="round"/></g>'+
      '<g class="sb-nodes">'+n+'</g></svg>';
  }
  function t(en,fr){return '<span data-sb-lang="en">'+en+'</span><span data-sb-lang="fr">'+fr+'</span>';}
  function curLang(){
    var b=document.body;
    if(b.classList.contains('lang-fr'))return 'fr';
    if(b.classList.contains('lang-en'))return 'en';
    if(b.classList.contains('fr'))return 'fr';
    if(b.classList.contains('en'))return 'en';
    var act=document.querySelector('.langtab.active[data-lang]');
    if(act)return act.getAttribute('data-lang')==='fr'?'fr':'en';
    if(document.querySelector('#btn-fr.active'))return 'fr';
    if(document.querySelector('#btn-en.active'))return 'en';
    return /^fr/i.test(document.documentElement.lang||'')?'fr':'en';
  }
  function init(){
    if(document.querySelector('.sb-banner'))return;
    var a=document.createElement('a');
    a.className='sb-banner';a.href='index.html';
    a.setAttribute('aria-label','Home / Accueil \u2013 Genetic Conditions & Surveillance Protocols');
    a.innerHTML=helix()+'<div class="sb-inner"><span class="sb-home">\u2190 '+t('Home','Accueil')+'</span>'+
      '<span class="sb-text"><span class="sb-title">'+t('Genetic Conditions &amp; Surveillance Protocols','Maladies génétiques et protocoles de surveillance')+'</span>'+
      '</span><img class="sb-logo" src="genaissance-logo.png?v=2" alt="Genaissance"></div>';
    document.body.insertBefore(a,document.body.firstChild);
    function sync(){var l=curLang();a.classList.toggle('sb-fr',l==='fr');a.classList.toggle('sb-en',l!=='fr');}
    sync();
    var mo=new MutationObserver(sync);
    mo.observe(document.body,{attributes:true,attributeFilter:['class']});
    mo.observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
    document.addEventListener('click',function(){setTimeout(sync,0);},true);
  }
  /* ---- Remember EN/FR choice across pages (localStorage 'protocolLang'; ?lang=xx overrides) ---- */
  var KEY='protocolLang';
  function getStored(){try{return localStorage.getItem(KEY);}catch(e){return null;}}
  function store(l){try{if(l==='en'||l==='fr')localStorage.setItem(KEY,l);}catch(e){}}
  try{var qp=(location.search.match(/[?&]lang=(en|fr)\b/i)||[])[1];if(qp)store(qp.toLowerCase());}catch(e){}
  function findBtn(l){
    var sels=['[onclick*="Lang(\''+l+'\'"]','[onclick*="Lang(\\"'+l+'\\""]','button[data-lang="'+l+'"]','#btn-'+l,'#lang-'+l];
    for(var i=0;i<sels.length;i++){var el=document.querySelector(sels[i]);if(el&&!el.closest('.sb-banner'))return el;}
    var bs=document.querySelectorAll('button');
    var re=l==='fr'?/^\s*(FR|Fran[çc]ais)\s*$/i:/^\s*(EN|English)\s*$/i;
    for(var j=0;j<bs.length;j++)if(re.test(bs[j].textContent))return bs[j];
    return null;
  }
  function applyStored(){
    var want=getStored();
    if(want!=='en'&&want!=='fr')return;
    if(curLang()===want)return;
    var b=findBtn(want);
    if(b){try{b.click();}catch(e){}}
    if(curLang()!==want&&typeof window.setLang==='function'){try{window.setLang(want);}catch(e){}}
  }
  var hasLangUI=false;
  function watch(){
    hasLangUI=!!(findBtn('fr')||typeof window.setLang==='function');
    var last=curLang();
    function chk(){var l=curLang();if(l!==last){last=l;store(l);}}
    var mo=new MutationObserver(chk);
    mo.observe(document.body,{attributes:true,attributeFilter:['class'],subtree:true});
    mo.observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
    document.addEventListener('click',function(e){
      var t=e.target&&e.target.closest&&e.target.closest('button,a,[onclick],[data-lang]');
      if(!t||t.closest('.sb-banner'))return;
      setTimeout(function(){var l=curLang();last=l;
        if(t===findBtn('fr')||t===findBtn('en'))store(l);else chk();},0);
    },true);
  }
  /* ---- Print / Save as PDF button (skipped when the page already has its own print/PDF control) ---- */
  function hasOwnPrint(){
    var els=document.querySelectorAll('button,a,[onclick],[role="button"]');
    for(var i=0;i<els.length;i++){var e=els[i];if(e.closest('.sb-banner,.sb-print'))continue;
      var oc=e.getAttribute('onclick')||'',tx=(e.textContent||'')+' '+(e.getAttribute('aria-label')||'')+' '+(e.id||'');
      if(/print\s*\(/.test(oc)||/\b(print|imprimer|pdf)\b/i.test(tx)){if(e.getClientRects().length)return true;}}
    return false;
  }
  function addPrint(){
    if(document.querySelector('.sb-print')||hasOwnPrint())return;
    var b=document.createElement('button');b.type='button';b.className='sb-print';
    b.setAttribute('aria-label','Print / Save as PDF \u2013 Imprimer / PDF');
    b.innerHTML='<span aria-hidden="true">\u2399</span>'+t('Print / Save as PDF','Imprimer / PDF');
    b.addEventListener('click',function(){window.print();});
    document.body.appendChild(b);
    function sync(){var l=curLang();b.classList.toggle('sb-fr',l==='fr');b.classList.toggle('sb-en',l!=='fr');}
    sync();var mo=new MutationObserver(sync);
    mo.observe(document.body,{attributes:true,attributeFilter:['class'],subtree:true});
    mo.observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  }
  function boot(){init();try{addPrint();}catch(e){}if(!window.__protocolLangInit){window.__protocolLangInit=1;applyStored();watch();}}
  if(document.readyState!=='loading')boot();else document.addEventListener('DOMContentLoaded',boot);
})();
