/* EDTEX website assistant (guided).
   - Greets visitors with a page-aware note, offers paths, answers from the FAQ knowledge
     (js/assistant-data.js, generated from faqs.html), suggests case studies, and hands off
     to the demo form with the conversation pre-filled.
   - Live AI later: set window.EDTEX_ASSISTANT_ENDPOINT = 'https://…' before this file loads.
     Free-text questions are then POSTed as {question, page, history} and the JSON reply
     {answer, links:[{label,href}]} is shown. If the endpoint fails, the FAQ answer is used.
   - Every interaction is reported through window.edtexTrack (js/analytics.js). */
(function(){
  if(window.__edtexAssistant)return;window.__edtexAssistant=true;
  var H=window.edtexHref||function(p){return p;};
  var T=function(n,p){if(window.edtexTrack)window.edtexTrack(n,p||{});};
  var BASE=(document.querySelector('script[src*="js/site.js"]')||{}).getAttribute?document.querySelector('script[src*="js/site.js"]').getAttribute('src').replace(/js\/site\.js.*$/,''):'';
  function ss(k,v){try{if(v===undefined)return sessionStorage.getItem(k);sessionStorage.setItem(k,v);}catch(e){return null;}}

  /* ---------- content ---------- */
  var CS={
    bidding:[['How IIM Rohtak runs a round in under 60 minutes','/case-studies/iim-rohtak-registro-course-bidding-implementation'],['O.P. Jindal Global University: bidding at scale','/case-studies/op-jindal-global-university-registro-course-bidding-implementation']],
    timetabling:[['IIM Calcutta: bidding and multi-programme timetabling','/case-studies/iim-calcutta-registro-course-bidding-multiprogramme-timetabling-automation-implementation'],['IIM Kozhikode: timetabling across programmes','/case-studies/iim-kozhikode-registro-course-bidding-multiprogramme-timetabling-automation-implementation']],
    placements:[['IIT Bombay: Day 0 interview scheduling','/case-studies/iit-bombay-skynet-placement-automation-implementation'],['ISB Hyderabad: placement operations','/case-studies/isb-hyderabad-skynet-placement-automation-implementation']],
    erp:[['IIM Sambalpur: academic ERP','/case-studies/iim-sambalpur-registro-academic-erp-implementation'],['Student exchange with Registro','/products/registro-academic-exchange-automation']],
    general:[['All case studies','/case-studies'],['Why institutions choose EDTEX','/why-edtex']]
  };
  var PATHS=[
    {k:'bidding',label:'We run elective bidding',reply:'Registro runs elective bidding to your own policy: points or priorities, caps, credit rules and tie-breaks, with every allocation step recorded for appeals.',product:['Elective course bidding','/products/course-bidding'],interest:'course-bidding',check:true},
    {k:'timetabling',label:'Our timetable takes too long',reply:'Registro builds the timetable with a solver that checks every faculty, room and student constraint before release, across several programmes at once.',product:['Timetable automation','/products/registro-timetable-automation'],interest:'timetabling'},
    {k:'placements',label:'We run placements or Day 0',reply:'Skynet runs placement operations end to end, and its Day 0 scheduler slots and reschedules interviews live without clashes.',product:['Day 0 interview scheduling','/products/skynet-scheduler'],interest:'placements-bschool'},
    {k:'erp',label:'Student exchange or academic records',reply:'Registro covers student exchange (applications, partner seats, credit transfer) and an academic ERP for records, grades and programme administration.',product:['Academic ERP','/products/registro-academic-erp'],interest:'academic-erp'},
    {k:'general',label:'Just exploring EDTEX',reply:'EDTEX builds academic operations software for business schools, law schools and universities. 40+ institutions use it, starting with IIM Ahmedabad in 2016.',product:['All products','/products'],interest:''}
  ];
  var SECT={bidding:'Course bidding',timetabling:'Timetable automation',placements:'Placement automation',erp:'Academic ERP',general:'General'};

  var p=location.pathname.toLowerCase(),ctx='general',greet='Welcome to EDTEX. Can I help you find the right page or answer a question?';
  if(/bidding|elective/.test(p)){ctx='bidding';greet='Looking at elective bidding? I can show you how IIM Rohtak runs a full round in under 60 minutes.';}
  else if(/timetabl/.test(p)){ctx='timetabling';greet='Working on timetabling? I can show you how IIM Calcutta builds clash-free timetables across programmes.';}
  else if(/skynet|placement/.test(p)){ctx='placements';greet='Planning placements or Day 0? I can show you how IIT Bombay schedules Day 0 interviews.';}
  else if(/exchange|erp/.test(p)){ctx='erp';greet='Questions about exchange or academic records? I can answer them here.';}
  else if(/case-stud|customer/.test(p)){greet='Want the case study closest to your institution? Tell me what your office runs.';}
  else if(/request-a-demo/.test(p)){greet='Not sure what to write in the form? I can help you prepare for the call.';}
  else if(/allocation-check/.test(p)){ctx='bidding';greet='Questions about your self-check result? Ask me here.';}

  /* ---------- DOM ---------- */
  var root=document.createElement('div');root.className='ea';root.innerHTML=
  '<div class="ea-teaser" hidden role="status"><button class="ea-tx" type="button" aria-label="Dismiss">×</button><p></p><button class="ea-topen" type="button">Ask a question</button></div>'+
  '<button class="ea-launch" type="button" aria-expanded="false" aria-controls="ea-panel"><span class="ea-dot" aria-hidden="true"></span><span>Ask EDTEX</span></button>'+
  '<div class="ea-panel" id="ea-panel" role="dialog" aria-label="EDTEX assistant" hidden>'+
    '<div class="ea-head"><img src="'+BASE+'assets/images/arun-portrait.jpg" alt="" width="36" height="36"><div><b>EDTEX assistant</b><span>Guided answers. Our team replies within one business day.</span></div><button class="ea-x" type="button" aria-label="Close assistant">×</button></div>'+
    '<div class="ea-log" aria-live="polite"></div>'+
    '<form class="ea-in"><label class="sr-only" for="ea-q">Type your question</label><input id="ea-q" type="text" autocomplete="off" maxlength="300" placeholder="Type a question, e.g. Does it work with our SIS?"><button type="submit" aria-label="Send">→</button></form>'+
  '</div>';
  document.body.appendChild(root);
  var L=root.querySelector('.ea-launch'),P=root.querySelector('.ea-panel'),LOG=root.querySelector('.ea-log'),F=root.querySelector('.ea-in'),Q=root.querySelector('#ea-q'),TS=root.querySelector('.ea-teaser');
  var history=[],started=false,chosen=null,lead={};

  function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
  function scroll(){LOG.scrollTop=LOG.scrollHeight;}
  function say(txt,who){var m=el('div','ea-m ea-'+(who||'bot'));m.appendChild(el('p',null,txt));LOG.appendChild(m);history.push({who:who||'bot',text:txt});scroll();return m;}
  function typing(cb){var t=el('div','ea-m ea-bot ea-typing');t.innerHTML='<i></i><i></i><i></i>';LOG.appendChild(t);scroll();setTimeout(function(){t.remove();cb();},520);}
  function links(arr){var w=el('div','ea-links');arr.forEach(function(a){var x=el('a','ea-link',a[0]);x.href=H(a[1]);x.addEventListener('click',function(){T('assistant_link',{label:a[0],href:a[1]});});w.appendChild(x);});LOG.appendChild(w);scroll();}
  function chips(arr){var w=el('div','ea-chips');arr.forEach(function(c){var b=el('button','ea-chip',c[0]);b.type='button';b.addEventListener('click',function(){w.remove();say(c[0],'user');T('assistant_choice',{choice:c[0]});c[1]();});w.appendChild(b);});LOG.appendChild(w);scroll();}

  function menu(){chips(PATHS.map(function(x){return [x.label,function(){path(x);}];}));}
  function path(x){chosen=x;typing(function(){say(x.reply);links([[x.product[0]+' →',x.product[1]]]);
    var o=[['Show me a case study',function(){typing(function(){say('These are the closest examples:');links(CS[x.k]);next();});}],
           ['Common questions',function(){faqList(x.k);}]];
    if(x.check)o.push(['Check our process (2 min)',function(){location.href=H('/allocation-check');}]);
    o.push(['Talk to the team',handoff]);chips(o);});}
  function next(){chips([['Common questions',function(){faqList(chosen?chosen.k:ctx);}],['Talk to the team',handoff],['Something else',function(){typing(function(){say('What would you like to look at?');menu();});}]]);}
  function faqList(k){var c=SECT[k]||'General',items=(window.EDTEX_FAQ||[]).filter(function(f){return f.c===c;}).slice(0,5);
    typing(function(){say('Questions institutions often ask about '+c.toLowerCase()+':');chips(items.map(function(f){return [f.q,function(){answer(f,'list');}];}).concat([['Type my own question',function(){Q.focus();}]]));});}
  function answer(f,how){typing(function(){say(f.a);links([['Read all '+f.c.toLowerCase()+' questions','/faqs#'+f.s]]);feedback(f.q,how);});}
  function feedback(q,how){var w=el('div','ea-fb');w.appendChild(el('span',null,'Did this answer your question?'));
    [['Yes',1],['No',0]].forEach(function(v){var b=el('button','ea-fbb',v[0]);b.type='button';b.addEventListener('click',function(){w.remove();T('assistant_helpful',{question:q.slice(0,120),helpful:v[1],source:how});
      if(v[1]){typing(function(){say('Good. Anything else?');next();});}else{typing(function(){say('Sorry about that. A person from our team can answer it properly.');chips([['Talk to the team',handoff],['Ask another question',function(){Q.focus();}]]);});}});w.appendChild(b);});
    LOG.appendChild(w);scroll();}

  /* ---------- free text ---------- */
  var STOP='a an the is are do does can how what which who why when we our you your it to of in on for with and or be by at this that i my me there any'.split(' ');
  function toks(s){return s.toLowerCase().replace(/[^a-z0-9 ]+/g,' ').split(/\s+/).filter(function(w){return w.length>1&&STOP.indexOf(w)<0;}).map(function(w){return w.replace(/(ing|es|s)$/,'');});}
  var SYN={client:'institution use',customer:'institution use',gdpr:'data secure',dpdp:'data secure',privacy:'data secure',security:'data secure',sis:'integrate system',erp:'erp integrate',implementation:'deploy',onboard:'deploy',rollout:'deploy',sso:'integrate',lms:'integrate system',interview:'interview schedul',exam:'exam schedul'};
  function expand(q){return q.replace(/[a-z]+/gi,function(w){var k=w.toLowerCase().replace(/s$/,'');return SYN[k]?w+' '+SYN[k]:w;});}
  function best(q){var qt=toks(expand(q));if(!qt.length)return null;var top=null,sc=0;(window.EDTEX_FAQ||[]).forEach(function(f){var ft=toks(f.q),at=toks(f.a),s=0;qt.forEach(function(w){if(ft.indexOf(w)>=0)s+=3;else if(at.indexOf(w)>=0)s+=1;});s=s/Math.sqrt(ft.length+2);if(chosen&&f.c===SECT[chosen.k])s*=1.15;if(s>sc){sc=s;top=f;}});return sc>=1.1?top:null;}
  F.addEventListener('submit',function(e){e.preventDefault();var q=Q.value.trim();if(!q)return;Q.value='';say(q,'user');
    var intent=/demo|call|price|pricing|cost|quote|contact|talk|meet/i.test(q);
    T('assistant_question',{question:q.slice(0,120),page:location.pathname});
    if(window.EDTEX_ASSISTANT_ENDPOINT){live(q);return;}
    local(q,intent);});
  function local(q,intent){var f=best(q);
    if(f){T('assistant_answered',{question:q.slice(0,120),matched:f.q});answer(f,'search');if(intent)chips([['Talk to the team',handoff]]);}
    else{T('assistant_unanswered',{question:q.slice(0,120),page:location.pathname});
      typing(function(){say(intent?'Our team can help with that directly. Pricing depends on programmes and modules, so we scope it on the first call.':'I don\'t have a good answer for that yet. Someone from our team can reply within one business day.');chips([['Talk to the team',handoff],['See common questions',function(){faqList(chosen?chosen.k:ctx);}]]);});}}
  function live(q){var t=el('div','ea-m ea-bot ea-typing');t.innerHTML='<i></i><i></i><i></i>';LOG.appendChild(t);scroll();
    fetch(window.EDTEX_ASSISTANT_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:q,page:location.pathname,history:history.slice(-10)})})
    .then(function(r){if(!r.ok)throw 0;return r.json();}).then(function(d){t.remove();say(d.answer||'');if(d.links&&d.links.length)links(d.links.map(function(l){return [l.label,l.href];}));feedback(q,'live');T('assistant_answered',{question:q.slice(0,120),source:'live'});})
    .catch(function(){t.remove();local(q,false);});}

  /* ---------- handoff to the demo form ---------- */
  function handoff(){T('assistant_handoff_start',{path:chosen?chosen.k:ctx});
    typing(function(){say('Happy to connect you. Three quick details and I\'ll open the demo form with them filled in, so you only need to check and send.');ask(0);});}
  var STEPS=[['name','Your name?','text','name'],['institution','Which institution are you with?','text','organization'],['email','Your work email?','email','email']];
  function ask(i){if(i>=STEPS.length){finish();return;}var s=STEPS[i];say(s[1]);
    var f=el('form','ea-field'),inp=el('input');inp.type=s[2];inp.autocomplete=s[3];inp.required=true;inp.setAttribute('aria-label',s[1]);var b=el('button',null,'OK');b.type='submit';f.appendChild(inp);f.appendChild(b);LOG.appendChild(f);scroll();setTimeout(function(){inp.focus();},50);
    f.addEventListener('submit',function(e){e.preventDefault();var v=inp.value.trim();if(!v||(s[2]==='email'&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v))){inp.setAttribute('aria-invalid','true');inp.focus();return;}lead[s[0]]=v;f.remove();say(v,'user');ask(i+1);});}
  function finish(){var userQs=history.filter(function(h){return h.who==='user';}).map(function(h){return h.text;}).filter(function(t){return t!==lead.name&&t!==lead.institution&&t!==lead.email;});
    var msg='From the website assistant. '+(userQs.length?'Asked about: '+userQs.slice(-4).join('; '):'');
    var url=H('/request-a-demo')+'?src=assistant&name='+encodeURIComponent(lead.name)+'&institution='+encodeURIComponent(lead.institution)+'&email='+encodeURIComponent(lead.email)+(chosen&&chosen.interest?'&interest='+chosen.interest:'')+'&msg='+encodeURIComponent(msg.slice(0,600))+'#dm-form';
    T('assistant_handoff_complete',{path:chosen?chosen.k:ctx});
    typing(function(){say('Thank you, '+lead.name.split(' ')[0]+'. The form is ready with your details. Arun Korupolu, our co-founder, usually replies within one business day.');links([['Open the pre-filled demo form →',url]]);});}

  /* ---------- open / close ---------- */
  function open(src){P.hidden=false;L.setAttribute('aria-expanded','true');root.classList.add('ea-open');TS.hidden=true;ss('ea-teased','1');
    if(!started){started=true;say(greet.indexOf('Welcome')===0?greet:'Welcome to EDTEX. '+greet);typing(function(){say('What brings you here today?');menu();});}
    T('assistant_open',{source:src||'launcher',page:location.pathname});setTimeout(function(){(LOG.querySelector('.ea-chip')||Q).focus();},80);}
  function close(){P.hidden=true;L.setAttribute('aria-expanded','false');root.classList.remove('ea-open');L.focus();T('assistant_close',{messages:history.length});}
  L.addEventListener('click',function(){P.hidden?open('launcher'):close();});
  root.querySelector('.ea-x').addEventListener('click',close);
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!P.hidden)close();});
  document.querySelectorAll('[data-open-assistant]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();open('inline');});});
  window.edtexOpenAssistant=open;

  /* page-aware greeting, once per visit, after the visitor has had time to read */
  if(!ss('ea-teased')&&!/request-a-demo/.test(p)){
    var shown=false;function tease(){if(shown||!P.hidden)return;shown=true;TS.querySelector('p').textContent=greet;TS.hidden=false;ss('ea-teased','1');T('assistant_teaser_shown',{page:location.pathname});}
    setTimeout(tease,12000);
    window.addEventListener('scroll',function s(){if(window.scrollY>window.innerHeight*1.2){setTimeout(tease,1500);window.removeEventListener('scroll',s);}},{passive:true});
  }
  TS.querySelector('.ea-tx').addEventListener('click',function(){TS.hidden=true;T('assistant_teaser_dismissed');});
  TS.querySelector('.ea-topen').addEventListener('click',function(){open('teaser');});
})();
