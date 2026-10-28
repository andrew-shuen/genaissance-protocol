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
  /* ---- Standard toolbar: Print (top-left), page controls, EN/FR (top-right) ---- */
  var PRINT_SVG='<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M6 14h12v7H6z"/></svg>';
  var CHROME='.lang-bar,.topbar,.langbar,.toolbar,.util,.tabs,.lang-toggle,.langtabs,.lang-switch,.langswitch,.controls,.page-controls';
  function isPrintEl(e){var oc=e.getAttribute('onclick')||'',tx=(e.textContent||'').trim();
    return /print\s*\(/.test(oc)||/^(\W*)(print|imprimer)\b/i.test(tx)||/\bsave as pdf\b/i.test(tx);}
  function langOf(e){var oc=e.getAttribute('onclick')||'',m=oc.match(/Lang\w*\(\s*['"](en|fr)['"]/i);if(m)return m[1].toLowerCase();
    var id=(e.id||'').toLowerCase();if(/^(btn-|lang-|lang)(en|fr)$|^(en|fr)(tab|btn|-btn|-tab)$/.test(id))return /fr/.test(id)?'fr':'en';
    var dl=e.getAttribute('data-lang');if(dl&&/langtab|langbtn|lang-btn|lang-tab/.test(e.className||''))return dl==='fr'?'fr':'en';
    var tx=(e.textContent||'').trim();if(/^(EN|English)$/i.test(tx))return 'en';if(/^(FR|Fran[çc]ais)$/i.test(tx))return 'fr';return null;}
  function tools(){
    if(document.querySelector('.sb-tools')||/(^|\/)(index\.html)?$/.test(location.pathname))return;
    var bar=document.createElement('div');bar.className='sb-tools';
    var inner=document.createElement('div');inner.className='sb-tools-inner';bar.appendChild(inner);
    var left=document.createElement('div');left.className='sb-tl';var right=document.createElement('div');right.className='sb-tr';
    inner.appendChild(left);inner.appendChild(right);
    var p=document.createElement('button');p.type='button';p.className='sb-btn sb-btn-print';
    p.setAttribute('aria-label','Print / Save as PDF \u2013 Imprimer / Enregistrer en PDF');
    p.innerHTML=PRINT_SVG+t('Print / Save as PDF','Imprimer / PDF');
    p.addEventListener('click',function(){window.print();});left.appendChild(p);
    var natives={en:null,fr:null},touched=[];
    var segs=document.querySelectorAll('.bar-center,.view-toggle,.seg-group');
    for(var q=0;q<segs.length;q++){var sg=segs[q];if(sg.closest('.sb-tools'))continue;var pc=sg.closest(CHROME);if(!pc)continue;touched.push(pc);sg.classList.add('sb-seg');left.appendChild(sg);}
    var els=document.querySelectorAll('button,a[onclick],[role="button"],.langtab,.langbtn,.lang-btn,'+CHROME.split(',').map(function(c){return c+' a';}).join(','));
    for(var i=0;i<els.length;i++){var e=els[i];if(e.closest('.sb-banner,.sb-tools,.sb-print'))continue;
      var inChrome=e.closest(CHROME);
      if(isPrintEl(e)&&(inChrome||e.tagName==='BUTTON'||e.getAttribute('onclick'))){e.classList.add('sb-hide');if(inChrome)touched.push(inChrome);continue;}
      var l=langOf(e);
      if(l&&(inChrome||e.tagName==='BUTTON')){if(!natives[l])natives[l]=e;e.classList.add('sb-hide');if(inChrome)touched.push(inChrome);continue;}
      if(inChrome&&(e.tagName==='BUTTON'||e.tagName==='A'||e.getAttribute('role')==='button')){touched.push(inChrome);e.classList.add('sb-btn','sb-moved');left.appendChild(e);}
    }
    var hasLang=natives.en||natives.fr||typeof window.setLang==='function';
    var lb={};
    if(hasLang){['en','fr'].forEach(function(l){var b=document.createElement('button');b.type='button';b.className='sb-btn sb-lang';
      b.textContent=l==='en'?'English':'Fran\u00e7ais';b.setAttribute('lang',l);
      b.addEventListener('click',function(){var n=natives[l]||findBtn(l);if(n){try{n.click();}catch(e){}}
        if(curLang()!==l&&typeof window.setLang==='function'){try{window.setLang(l);}catch(e){}}
        store(curLang());setTimeout(sync,0);});
      lb[l]=b;right.appendChild(b);});}
    for(var k=0;k<touched.length;k++){var c=touched[k];
      if(!c.querySelector('button:not(.sb-hide),a:not(.sb-hide),input,select'))c.classList.add('sb-hide');}
    var ban=document.querySelector('.sb-banner');
    if(ban&&ban.nextSibling)ban.parentNode.insertBefore(bar,ban.nextSibling);else document.body.insertBefore(bar,document.body.firstChild);
    function sync(){var l=curLang();bar.classList.toggle('sb-fr',l==='fr');bar.classList.toggle('sb-en',l!=='fr');
      if(lb.en){lb.en.classList.toggle('active',l==='en');lb.fr.classList.toggle('active',l==='fr');}}
    sync();var mo=new MutationObserver(sync);
    mo.observe(document.body,{attributes:true,attributeFilter:['class'],subtree:true});
    mo.observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  }
  function ytInit(){[].forEach.call(document.querySelectorAll('.yt-card[data-yt]'),function(c){var b=c.querySelector('.yt-thumb');if(!b||b.__yt)return;b.__yt=1;b.addEventListener('click',function(){var id=c.getAttribute('data-yt');var w=document.createElement('div');w.className='yt-player';var f=document.createElement('iframe');f.src='https://www.youtube-nocookie.com/embed/'+encodeURIComponent(id)+'?autoplay=1&rel=0';f.title=(c.querySelector('.yt-title')||{}).textContent||'YouTube video';f.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';f.setAttribute('allowfullscreen','');f.setAttribute('referrerpolicy','strict-origin-when-cross-origin');w.appendChild(f);b.parentNode.replaceChild(w,b);});});}
  function boot(){try{ytInit();}catch(_){}init();try{tools();}catch(e){try{addPrint();}catch(_){}}if(!window.__protocolLangInit){window.__protocolLangInit=1;applyStored();watch();}}
  if(document.readyState!=='loading')boot();else document.addEventListener('DOMContentLoaded',boot);
})();
