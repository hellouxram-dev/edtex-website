/* EDTEX analytics: consent banner, GA4 + Microsoft Clarity loaders, event tracking.
   Fill in the two IDs below (see ANALYTICS-PLAN.md). Nothing is loaded and no cookie is set
   until the visitor accepts. Events are always pushed to window.dataLayer, so Google Tag
   Manager can be used instead if preferred. Add ?debug=1 to any URL to see events in the console. */
(function(){
  var GA4_ID='';        // e.g. 'G-XXXXXXXXXX'
  var CLARITY_ID='';    // e.g. 'abcd1234ef'
  var KEY='edtex-consent';

  window.dataLayer=window.dataLayer||[];
  var DEBUG=/[?&]debug=1/.test(location.search);
  var consent=null;try{consent=localStorage.getItem(KEY);}catch(e){}
  var loaded=false;

  function load(){if(loaded)return;loaded=true;
    if(GA4_ID){var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+GA4_ID;document.head.appendChild(s);
      window.gtag=function(){dataLayer.push(arguments);};gtag('js',new Date());gtag('config',GA4_ID,{anonymize_ip:true});}
    if(CLARITY_ID){(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,'clarity','script',CLARITY_ID);
      window.clarity('consent');}
  }

  /* public tracking function used by site.js, assistant.js and page scripts */
  window.edtexEvents=[];
  window.edtexTrack=function(name,params){params=params||{};
    var e={event:name,page:location.pathname};for(var k in params)e[k]=params[k];
    window.edtexEvents.push(e);dataLayer.push(e);
    if(DEBUG&&window.console)console.info('[edtex event]',name,params);
    if(consent!=='yes')return;
    if(window.gtag)gtag('event',name,params);
    if(window.clarity){clarity('event',name);if(params.question)clarity('set','last_question',String(params.question).slice(0,100));}
  };
  var track=window.edtexTrack;

  /* consent banner */
  function banner(){
    var b=document.createElement('div');b.className='cc-banner';b.setAttribute('role','region');b.setAttribute('aria-label','Cookie choice');
    var cp=(window.edtexHref||function(x){return x;})('/cookie-policy');
    b.innerHTML='<p>We use analytics cookies to learn which pages help visitors and where they get stuck. No advertising cookies. <a href="'+cp+'">Cookie policy</a></p><div><button type="button" class="cc-no">Decline</button><button type="button" class="cc-yes">Accept analytics</button></div>';
    document.body.appendChild(b);
    function set(v){consent=v;try{localStorage.setItem(KEY,v);}catch(e){}b.remove();document.body.classList.remove('has-cc');track('consent_'+(v==='yes'?'granted':'denied'));if(v==='yes')load();}
    b.querySelector('.cc-yes').addEventListener('click',function(){set('yes');});
    b.querySelector('.cc-no').addEventListener('click',function(){set('no');});
    document.body.classList.add('has-cc');
  }
  window.edtexCookieSettings=function(){try{localStorage.removeItem(KEY);}catch(e){}consent=null;if(!document.querySelector('.cc-banner'))banner();};
  if(consent==='yes')load();else if(consent!=='no')banner();

  /* first-touch source: who came, from where (kept for the visit, attached to the demo form) */
  try{if(!sessionStorage.getItem('edtex-src')){var q=new URLSearchParams(location.search),src={landing:location.pathname,referrer:document.referrer||'direct'};
    ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid'].forEach(function(k){if(q.get(k))src[k]=q.get(k);});
    sessionStorage.setItem('edtex-src',JSON.stringify(src));}}catch(e){}
  var form=document.getElementById('dm-form');
  if(form){var src={};try{src=JSON.parse(sessionStorage.getItem('edtex-src')||'{}');}catch(e){}
    Object.keys(src).forEach(function(k){var i=document.createElement('input');i.type='hidden';i.name='src_'+k;i.value=src[k];form.appendChild(i);});
    var started=false;form.addEventListener('input',function(){if(!started){started=true;track('demo_form_start');}});
    form.addEventListener('submit',function(){if(form.checkValidity())track('generate_lead',{via:new URLSearchParams(location.search).get('src')||'direct',landing:src.landing||''});});
  }

  /* automatic events */
  document.addEventListener('click',function(e){var a=e.target.closest('a,[data-track]');if(!a)return;
    var t=a.getAttribute('data-track'),h=a.getAttribute('href')||'';
    if(t)track(t,{text:(a.textContent||'').trim().slice(0,60)});
    if(/request-a-demo/.test(h))track('demo_click',{text:(a.textContent||'').trim().slice(0,60),from:location.pathname});
    else if(/^mailto:/.test(h))track('email_click',{to:h.slice(7)});
    else if(/^tel:/.test(h))track('phone_click');
    else if(/^https?:/.test(h)&&a.host!==location.host)track('outbound_click',{url:h});
    else if(/case-stud/.test(h))track('case_study_click',{href:h});
  },true);
  document.addEventListener('toggle',function(e){var d=e.target;if(d.tagName==='DETAILS'&&d.open){var s=d.querySelector('summary');track('faq_open',{question:s?s.textContent.trim().slice(0,120):''});}},true);
  document.addEventListener('click',function(e){var v=e.target.closest('.vid,[data-youtube]');if(v)track('video_play',{title:v.getAttribute('data-title')||''});},true);
  var marks=[25,50,75,90],hit={},t0=Date.now();
  window.addEventListener('scroll',function(){var h=document.documentElement,p=(h.scrollTop+innerHeight)/h.scrollHeight*100;
    marks.forEach(function(m){if(p>=m&&!hit[m]){hit[m]=1;track('scroll_depth',{percent:m});}});
    if(hit[75]&&!hit.read&&Date.now()-t0>30000&&/case-stud|blog/.test(location.pathname)){hit.read=1;track('engaged_read',{title:document.title});}},{passive:true});
  if(document.body.classList.contains('page-404')||/404/.test(location.pathname)||/not found/i.test(document.title))track('page_not_found',{path:location.pathname,referrer:document.referrer});
})();
