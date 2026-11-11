/* Shared Genaissance header, footer, and card toolbar. */
(function(){
  var ORIGIN='https://www.genaissance.ca';
  var LOGO='https://www.genaissance.ca/uploads/b/aa8065230b80bb75f03d0afacc25f58982da9629d77d2cd343f212a67cd667c1/GENAISSANCE%20logo%20%282%29_1733771251.png';
  var SERVICES=[
    ['Genetic testing','Tests génétiques','/genetic-testing'],
    ['OHIP genetics referrals','Références en génétique (OHIP)','/ohip-genetics'],
    ['Aesthetics','Esthétique','/aesthetics'],
    ['Supplements','Suppléments','/supplements'],
    ['IV therapy','Thérapie IV','/iv-therapy'],
    ['Sponsored Genetic Testing','Tests génétiques commandités','/sponsored-testing'],
    ['Precision Health','Santé de précision','/longevity-program'],
    ['Sofwave','Sofwave','/sofwave'],
    ['Microneedling','Microneedling','/microneedling'],
    ['Galleri Liquid Biopsy','Biopsie liquide Galleri','/galleri'],
    ['Longevity Clinic in Toronto','Clinique de longévité à Toronto','/longevity-clinic-toronto'],
    ['Polygenic Risk Score Testing','Score de risque polygénique','/polygenic-risk-score-testing'],
    ['Pharmacogenomic Testing','Tests pharmacogénomiques','/pharmacogenomic-testing']
  ];
  function t(en,fr){return '<span data-sb-lang="en">'+en+'</span><span data-sb-lang="fr">'+fr+'</span>';}
  function topLink(href,en,fr){return '<a class="gn-top" href="'+href+'">'+t(en,fr)+'</a>';}
  function subMenu(items){return '<div class="gn-menu">'+items.map(function(it){
    return '<a href="'+ORIGIN+it[2]+'">'+t(it[0],it[1])+'</a>';
  }).join('')+'</div>';}
  function caretBtn(label){return '<button type="button" class="gn-subtoggle" aria-expanded="false" aria-haspopup="true" aria-label="'+label+'"><span class="gn-caret" aria-hidden="true"></span></button>';}
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
  function syncChrome(){
    var fr=curLang()==='fr';
    var nodes=document.querySelectorAll('.gn-header,.gn-sitefoot,.sb-tools,.sb-print');
    for(var i=0;i<nodes.length;i++){
      nodes[i].classList.toggle('sb-fr',fr);
      nodes[i].classList.toggle('sb-en',!fr);
    }
    var langs=document.querySelectorAll('.gn-header .sb-lang');
    for(var j=0;j<langs.length;j++){
      var on=(langs[j].getAttribute('lang')==='fr')===fr;
      langs[j].classList.toggle('active',on);
      langs[j].setAttribute('aria-pressed',on?'true':'false');
    }
  }
  function closeMenus(header){
    var drops=header.querySelectorAll('.gn-drop.is-open');
    for(var i=0;i<drops.length;i++){
      drops[i].classList.remove('is-open');
      var b=drops[i].querySelector('.gn-subtoggle,.gn-pro');
      if(b)b.setAttribute('aria-expanded','false');
    }
  }
  function init(){
    if(document.querySelector('.gn-header'))return;
    var header=document.createElement('header');
    header.className='gn-header sb-banner';
    header.innerHTML=
      '<div class="gn-bar">'+
        '<button type="button" class="gn-burger" aria-expanded="false" aria-controls="gn-nav">'+
          '<span class="gn-bars" aria-hidden="true"><span></span><span></span><span></span></span>'+
          '<span class="gn-vh">'+t('Menu','Menu')+'</span></button>'+
        '<a class="gn-logo" href="'+ORIGIN+'/"><img src="'+LOGO+'" alt="Genaissance" width="1000" height="250"></a>'+
        '<div class="gn-lang"></div>'+
      '</div>'+
      '<nav id="gn-nav" class="gn-nav" aria-label="Main">'+
        topLink(ORIGIN+'/','Home','Accueil')+
        topLink(ORIGIN+'/about','About','\u00c0 propos')+
        '<div class="gn-drop">'+topLink(ORIGIN+'/services','Services','Services')+caretBtn('Services menu')+subMenu(SERVICES)+'</div>'+
        '<div class="gn-drop gn-here"><button type="button" class="gn-top gn-pro" aria-expanded="false" aria-haspopup="true" aria-current="true">'+
          t('Resources','Ressources')+'<span class="gn-caret" aria-hidden="true"></span></button>'+
          '<div class="gn-menu">'+
            '<a href="https://andrew-shuen.github.io/genaissance-protocol/" aria-current="page">'+t('Genetic conditions','Maladies g\u00e9n\u00e9tiques')+'</a>'+
            '<a href="https://andrew-shuen.github.io/longevity-wellness-guide/">'+t('Wellness','Mieux-\u00eatre')+'</a>'+
          '</div></div>'+
        topLink(ORIGIN+'/shop-all','Shop','Boutique')+
        topLink(ORIGIN+'/contact','Contact Us','Nous joindre')+
        topLink(ORIGIN+'/faqs','FAQ','FAQ')+
        topLink(ORIGIN+'/partners','Partners','Partenaires')+
        '<a class="gn-book" href="'+ORIGIN+'/s/appointments">'+t('Book','R\u00e9server')+'</a>'+
      '</nav>';
    document.body.insertBefore(header,document.body.firstChild);
    var toggle=document.querySelector('.lang-toggle');
    var slot=header.querySelector('.gn-lang');
    if(toggle&&slot&&!toggle.closest('.gn-header'))slot.appendChild(toggle);
    var burger=header.querySelector('.gn-burger');
    burger.addEventListener('click',function(){
      var open=!header.classList.contains('is-nav-open');
      header.classList.toggle('is-nav-open',open);
      burger.setAttribute('aria-expanded',open?'true':'false');
      if(!open)closeMenus(header);
    });
    header.addEventListener('click',function(e){
      var tog=e.target.closest&&e.target.closest('.gn-subtoggle,.gn-pro');
      if(!tog||!header.contains(tog))return;
      e.preventDefault();
      var drop=tog.closest('.gn-drop');
      var willOpen=!drop.classList.contains('is-open');
      closeMenus(header);
      drop.classList.toggle('is-open',willOpen);
      tog.setAttribute('aria-expanded',willOpen?'true':'false');
    });
    header.querySelector('.gn-nav').addEventListener('click',function(e){
      if(e.target.closest('a')){
        header.classList.remove('is-nav-open');
        burger.setAttribute('aria-expanded','false');
      }
    });
    document.addEventListener('click',function(e){
      if(!header.contains(e.target)){
        closeMenus(header);
        header.classList.remove('is-nav-open');
        burger.setAttribute('aria-expanded','false');
      }
    });
    document.addEventListener('keydown',function(e){
      if(e.key!=='Escape')return;
      closeMenus(header);
      header.classList.remove('is-nav-open');
      burger.setAttribute('aria-expanded','false');
    });
    if(!document.querySelector('.gn-sitefoot')){
      var foot=document.createElement('footer');
      foot.className='gn-sitefoot';
      foot.innerHTML=
        '<div class="gn-foot-inner">'+
          '<p class="gn-foot-line"><a href="tel:+14373201538">'+t('Phone','T\u00e9l\u00e9phone')+' (437) 320-1538</a>'+
            '<span class="gn-sep" aria-hidden="true">·</span><span>'+t('Fax','T\u00e9l\u00e9copieur')+' (437) 562-6597</span>'+
            '<span class="gn-sep" aria-hidden="true">·</span><a href="mailto:info@genaissance.ca">info@genaissance.ca</a></p>'+
          '<p class="gn-foot-line"><a href="'+ORIGIN+'/contact">'+t('Hours: 8am\u20138pm','Heures : 8 h \u00e0 20 h')+'</a></p>'+
          '<nav class="gn-foot-nav" aria-label="Footer">'+
            topLink(ORIGIN+'/','Home','Accueil')+
            topLink(ORIGIN+'/about','About','\u00c0 propos')+
            topLink(ORIGIN+'/contact','Contact','Nous joindre')+
            '<a class="gn-top" href="'+ORIGIN+'/s/appointments">'+t('Book','R\u00e9server')+'</a>'+
          '</nav>'+
          '<p class="gn-foot-line">Unit 213, 701 Sheppard Ave E, North York</p>'+
          '<p class="gn-foot-line"><a href="'+ORIGIN+'/privacy-policy">'+t('Privacy Policy','Politique de confidentialit\u00e9')+'</a></p>'+
        '</div>';
      document.body.appendChild(foot);
    }
    syncChrome();
    var mo=new MutationObserver(syncChrome);
    mo.observe(document.body,{attributes:true,attributeFilter:['class']});
    mo.observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
    document.addEventListener('click',function(){setTimeout(syncChrome,0);},true);
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
      lb[l]=b;
      var slot=document.querySelector('.gn-header .gn-lang');
      if(slot)slot.appendChild(b);else right.appendChild(b);});}
    for(var k=0;k<touched.length;k++){var c=touched[k];
      if(!c.querySelector('button:not(.sb-hide),a:not(.sb-hide),input,select'))c.classList.add('sb-hide');}
    var ban=document.querySelector('.sb-banner');
    if(ban&&ban.nextSibling)ban.parentNode.insertBefore(bar,ban.nextSibling);else document.body.insertBefore(bar,document.body.firstChild);
    function sync(){var l=curLang();bar.classList.toggle('sb-fr',l==='fr');bar.classList.toggle('sb-en',l!=='fr');
      if(lb.en){lb.en.classList.toggle('active',l==='en');lb.fr.classList.toggle('active',l==='fr');}
      syncChrome();}
    sync();var mo=new MutationObserver(sync);
    mo.observe(document.body,{attributes:true,attributeFilter:['class'],subtree:true});
    mo.observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  }
  function ytInit(){[].forEach.call(document.querySelectorAll('.yt-card[data-yt]'),function(c){var b=c.querySelector('.yt-thumb');if(!b||b.__yt)return;b.__yt=1;b.addEventListener('click',function(){var id=c.getAttribute('data-yt');var w=document.createElement('div');w.className='yt-player';var f=document.createElement('iframe');f.src='https://www.youtube-nocookie.com/embed/'+encodeURIComponent(id)+'?autoplay=1&rel=0';f.title=(c.querySelector('.yt-title')||{}).textContent||'YouTube video';f.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';f.setAttribute('allowfullscreen','');f.setAttribute('referrerpolicy','strict-origin-when-cross-origin');w.appendChild(f);b.parentNode.replaceChild(w,b);});});}
  function boot(){try{ytInit();}catch(_){}init();try{tools();}catch(e){try{addPrint();}catch(_){}}if(!window.__protocolLangInit){window.__protocolLangInit=1;applyStored();watch();}}
  if(document.readyState!=='loading')boot();else document.addEventListener('DOMContentLoaded',boot);
})();
