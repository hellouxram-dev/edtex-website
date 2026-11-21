/* EDTEX site script: menu + current section in nav */
(function(){
  var btn=document.querySelector('.menu-btn'),menu=document.getElementById('mobile-menu');
  if(btn&&menu){
    function close(){menu.classList.remove('open');btn.setAttribute('aria-expanded','false');btn.setAttribute('aria-label','Open menu');}
    btn.addEventListener('click',function(){var o=menu.classList.toggle('open');btn.setAttribute('aria-expanded',o);btn.setAttribute('aria-label',o?'Close menu':'Open menu');});
    menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',close);});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});
  }
  var sec=document.body.getAttribute('data-section');
  if(sec){document.querySelectorAll('[data-nav="'+sec+'"]').forEach(function(a){a.setAttribute('aria-current','page');});}
})();

/* v2: dropdown menus */
(function(){
  var dds=[].slice.call(document.querySelectorAll('.dd'));
  function closeAll(except){dds.forEach(function(d){if(d!==except){d.classList.remove('open');d.querySelector('.dd-btn').setAttribute('aria-expanded','false');}});}
  dds.forEach(function(d){
    var b=d.querySelector('.dd-btn'),t;
    b.addEventListener('click',function(e){e.stopPropagation();var o=!d.classList.contains('open');closeAll(d);d.classList.toggle('open',o);b.setAttribute('aria-expanded',o);});
    d.addEventListener('mouseenter',function(){if(window.matchMedia('(hover:hover)').matches){clearTimeout(t);closeAll(d);d.classList.add('open');b.setAttribute('aria-expanded','true');}});
    d.addEventListener('mouseleave',function(){if(window.matchMedia('(hover:hover)').matches){t=setTimeout(function(){d.classList.remove('open');b.setAttribute('aria-expanded','false');},150);}});
  });
  document.addEventListener('click',function(){closeAll();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeAll();});
})();
/* v2: hover zoom on every content image. Rectangular images are clipped by their frame;
   round portraits and logos just grow slightly. */
(function(){
  var imgs=[].slice.call(document.querySelectorAll('main img'));
  imgs.forEach(function(img){
    if(img.closest('.igv-hub')||img.closest('.vposter')&&img.closest('.vposter').querySelector('iframe'))return;
    var cs=getComputedStyle(img),round=cs.borderRadius.indexOf('50%')>-1||parseFloat(cs.borderRadius)>=Math.min(img.width,img.height)/2-1;
    var parent=img.parentElement;
    if(round){img.classList.add('zoom-solo');parent.classList.add('zoom-host');return;}
    var pcs=getComputedStyle(parent),onlyImg=parent.children.length===1||[].every.call(parent.children,function(c){return c===img||getComputedStyle(c).position==='absolute';});
    if(pcs.overflow==='hidden'||onlyImg){parent.classList.add('zoom');return;}
    var w=document.createElement('span');w.className='zoom';w.style.display='block';w.style.borderRadius=cs.borderRadius;
    parent.insertBefore(w,img);w.appendChild(img);
  });
})();
/* v2: FAQ component: smooth open/close, one open at a time per group (except the FAQ page),
   expand/collapse all for longer lists, shareable link to each answer. */
(function(){
  var items=[].slice.call(document.querySelectorAll('main details.faq'));
  if(!items.length) return;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var multi=!!document.querySelector('main details.fq');
  function slug(t){return 'q-'+t.toLowerCase().replace(/&[a-z]+;/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,60);}
  var used={};
  items.forEach(function(d){
    var q=d.querySelector('summary');
    if(!d.id){var id=slug(q.textContent),k=id,i=2;while(used[k]||document.getElementById(k)){k=id+'-'+(i++);}d.id=k;}
    used[d.id]=1;
    var a=d.querySelector('.faq-a');
    if(a&&navigator.clipboard){
      var b=document.createElement('button');b.type='button';b.className='faq-copy';
      b.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg><span>Copy link to this answer</span>';
      b.addEventListener('click',function(){var u=location.href.split('#')[0]+'#'+d.id;navigator.clipboard.writeText(u).then(function(){b.querySelector('span').textContent='Link copied';setTimeout(function(){b.querySelector('span').textContent='Copy link to this answer';},1800);});});
      a.appendChild(b);
    }
    q.addEventListener('click',function(e){
      e.preventDefault();
      var opening=!d.open;
      if(opening&&!multi){
        var group=d.parentElement;
        [].forEach.call(group.querySelectorAll(':scope > details.faq[open]'),function(o){if(o!==d)toggle(o,false);});
      }
      toggle(d,opening);
      if(opening&&history.replaceState)history.replaceState(null,'','#'+d.id);
    });
  });
  function toggle(d,open){
    var a=d.querySelector('.faq-a');
    if(reduce||!a||!a.animate){d.open=open;return;}
    if(open){d.open=true;var h=a.scrollHeight;a.animate([{height:'0px',opacity:0},{height:h+'px',opacity:1}],{duration:260,easing:'cubic-bezier(.2,.7,.2,1)'});}
    else{var h2=a.scrollHeight;var an=a.animate([{height:h2+'px',opacity:1},{height:'0px',opacity:0}],{duration:200,easing:'ease-in'});an.onfinish=function(){d.open=false;};}
  }
  /* expand / collapse all for groups of 4 or more */
  var groups=[];items.forEach(function(d){if(groups.indexOf(d.parentElement)<0)groups.push(d.parentElement);});
  groups.forEach(function(g){
    var list=[].slice.call(g.querySelectorAll(':scope > details.faq'));
    if(list.length<4) return;
    var bar=document.createElement('div');bar.className='faq-tools';
    var btn=document.createElement('button');btn.type='button';btn.textContent='Expand all';
    btn.addEventListener('click',function(){var open=btn.textContent==='Expand all';list.forEach(function(d){d.open=open;});btn.textContent=open?'Collapse all':'Expand all';});
    bar.appendChild(btn);g.insertBefore(bar,list[0]);
  });
  /* open the answer named in the address */
  function fromHash(){var h=decodeURIComponent(location.hash.slice(1));if(!h)return;var d=document.getElementById(h);
    if(d&&d.matches('details.faq')){d.open=true;d.classList.add('flash');setTimeout(function(){d.classList.remove('flash');},2000);setTimeout(function(){d.scrollIntoView({block:'center',behavior:reduce?'auto':'smooth'});},80);}}
  fromHash();window.addEventListener('hashchange',fromHash);
})();

/* Nov 2026: link helper, hero motion, demo-form prefill, analytics + assistant loaders */
(function(){
  /* Root links (/case-studies/x) become flat files (case-study-x.html) in the static build. */
  var flat=!!document.querySelector('a[href="faqs.html"],a[href="index.html"]');
  window.edtexHref=function(p){if(!flat||!p||p.charAt(0)!=='/'||p.charAt(1)==='/')return p;
    var m=p.match(/^([^?#]*)(\?[^#]*)?(#.*)?$/),path=m[1].replace(/\/$/,''),q=m[2]||'',h=m[3]||'';
    var parts=path.replace(/^\//,'').split('/'),pre={'case-studies':'case-study-','blogs':'blog-','videos':'video-','products':'product-'},f;
    if(!parts[0])f='index.html';else if(parts.length===2)f=(parts.join('/')==='solutions/consulting')?'consulting.html':(pre[parts[0]]||parts[0]+'-')+parts[1]+'.html';else f=parts[0]+'.html';
    return f+q+h;};

  /* demo form: prefill from ?name=&institution=&email=&interest=a,b&msg= (assistant and self-check) */
  var form=document.getElementById('dm-form');
  if(form&&location.search){var q=new URLSearchParams(location.search);
    [['name','f-name'],['institution','f-inst'],['email','f-email'],['msg','f-msg']].forEach(function(x){var v=q.get(x[0]),el=document.getElementById(x[1]);if(v&&el&&!el.value)el.value=v.slice(0,800);});
    (q.get('interest')||'').split(',').forEach(function(k){var el=k&&form.querySelector('input[type=checkbox][name="'+k.replace(/[^a-z0-9-]/g,'')+'"]');if(el)el.checked=true;});
  }

  /* footer: cookie settings link */
  var cp=document.querySelector('footer a[href$="cookie-policy"],footer a[href$="cookie-policy.html"]');
  if(cp&&cp.parentNode&&cp.parentNode.tagName==='LI'){var li=document.createElement('li'),cb=document.createElement('button');cb.type='button';cb.className='ft-cookie';cb.textContent='Cookie settings';cb.addEventListener('click',function(){if(window.edtexCookieSettings)edtexCookieSettings();});li.appendChild(cb);cp.parentNode.parentNode.insertBefore(li,cp.parentNode.nextSibling);}

  /* load analytics first, then the assistant */
  var me=document.querySelector('script[src*="js/site.js"]'),base=me?me.getAttribute('src').replace(/js\/site\.js.*$/,''):'';
  function load(src,cb){var s=document.createElement('script');s.src=base+src;s.defer=true;if(cb)s.onload=cb;document.body.appendChild(s);}
  load('js/motion.js');
  load('js/analytics.js',function(){load('js/assistant-data.js',function(){load('js/assistant.js');});});
})();
